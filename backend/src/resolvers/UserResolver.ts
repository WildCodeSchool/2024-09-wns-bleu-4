import { ResetPasswordEmail } from '@/emails/ResetPassword';
import { VerifyAccountEmail } from '@/emails/VerifyAccount';
import { Resource } from '@/entities/Resource';
import { SubscriptionStatus } from '@/entities/Subscription';
import { LogType } from '@/entities/SystemLog';
import { TempUser, User, UserRole, UserStorage } from '@/entities/User';
import SystemLogResolver from '@/resolvers/SystemLogResolver';
import { PaginatedResources, PaginationInput, SearchInput } from './ResourceResolver';
import { getDomain } from '@/utils/envUtils';
import {
    calculateStoragePercentage,
    formatFileSize,
} from '@/utils/storageUtils';
import { verifyRecaptchaToken } from '@/utils/recaptchaUtils';
import * as argon2 from 'argon2';
import { IsEmail, Length, Matches } from 'class-validator';
import jwt, { Secret } from 'jsonwebtoken';
import { Resend } from 'resend';
import {
    Arg,
    Ctx,
    Field,
    ID,
    InputType,
    Mutation,
    ObjectType,
    Query,
    Resolver,
} from 'type-graphql';

@InputType()
export class UserInput implements Partial<User> {
    @IsEmail({}, { message: 'Please enter a valid email address' })
    @Length(5, 150, { message: 'Email must be between 5 and 150 characters.' })
    @Field(() => String)
    email: string;

    @Field(() => String)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{12,}$/, {
        message:
            '🔒 Password must include an uppercase, lowercase, number & special character.',
    })
    password: string;
}

@InputType()
export class UpdateProfilePictureInput {
    @Field(() => String)
    profilePictureUrl: string;
}

@ObjectType()
export class UserInfo {
    @Field(() => Boolean)
    isLoggedIn: boolean;

    @Field(() => String, { nullable: true })
    email?: String;

    @Field(() => ID, { nullable: true })
    id?: number;

    @Field(() => Boolean, { nullable: true })
    isSubscribed?: boolean;

    @Field(() => UserRole, { nullable: true })
    role?: UserRole;

    @Field(() => String, { nullable: true })
    profilePicture?: string | null;

    @Field(() => UserStorage, { nullable: true })
    storage?: UserStorage;
}

@Resolver(User)
class UserResolver {
    @Mutation(() => String)
    async register(
        @Arg('data', () => UserInput) newUserData: User,
        @Arg('lang', () => String) lang: string = 'fr',
        @Arg('recaptchaToken', () => String, { nullable: true }) recaptchaToken?: string,
        @Ctx() context?: any,
    ) {
        // Valider le token reCAPTCHA avec l'API Google
        const nodeEnv = process.env.NODE_ENV;
        
        if (nodeEnv === 'production') {
            // En production, la validation est obligatoire
            if (!recaptchaToken) {
                throw new Error('reCAPTCHA token is required');
            }

            // Récupérer l'IP du client depuis le contexte (si disponible)
            const clientIp =
                context?.req?.ip ||
                context?.req?.headers?.['x-forwarded-for']?.split(',')[0] ||
                context?.req?.connection?.remoteAddress;

            const isValid = await verifyRecaptchaToken(recaptchaToken, clientIp);
            if (!isValid) {
                throw new Error(
                    'reCAPTCHA validation failed. Please try again.',
                );
            }
        } else {
            // En développement ou staging, on valide si un token est fourni et si la clé est configurée
            if (recaptchaToken) {
                const clientIp =
                    context?.req?.ip ||
                    context?.req?.headers?.['x-forwarded-for']?.split(',')[0] ||
                    context?.req?.connection?.remoteAddress;
                const isValid = await verifyRecaptchaToken(
                    recaptchaToken,
                    clientIp,
                );
                if (!isValid && process.env.RECAPTCHA_SECRET_KEY) {
                    // Seulement logger un warning si la clé est configurée (sinon verifyRecaptchaToken retourne true)
                    console.warn(
                        `reCAPTCHA validation failed in ${nodeEnv} mode`,
                    );
                }
            }
        }

        const existingUser = await User.findOneBy({ email: newUserData.email });

        if (existingUser) {
            throw new Error('Un compte est déjà associé à cette adresse email');
        }

        const codeToConfirm = Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 10),
        ).join('');
        
        // Set expiration date to 10 minutes from now
        const codeExpirationDate = new Date();
        codeExpirationDate.setMinutes(codeExpirationDate.getMinutes() + 1);
        
        await TempUser.save({
            email: newUserData.email,
            password: await argon2.hash(newUserData.password),
            randomCode: codeToConfirm,
            codeExpirationDate: codeExpirationDate,
        });
        const resend = new Resend(process.env.RESEND_API_KEY);

        try {
            await resend.emails.send({
                from: `verify@${process.env.RESEND_EMAIL_DOMAIN}`,
                to: [newUserData.email],
                subject: 'Verify Account Creation',
                react: VerifyAccountEmail({
                    validationCode: codeToConfirm,
                    lang: lang as 'fr' | 'en',
                }),
            });
        } catch (error) {
            throw new Error(error);
        }
        return 'The user has been created!';
    }

    @Mutation(() => String)
    async resetPasswordSendCode(
        @Arg('email', () => String) email: string,
        @Arg('lang', () => String) lang: string,
    ) {
        const user = await User.findOneBy({ email });
        if (!user) {
            throw new Error("L'utilisateur demandé n'a pas été trouvé");
        }

        // Generate a JWT token for password reset that expires in 1 hour
        const resetToken = jwt.sign(
            {
                email: user.email,
                type: 'password_reset',
                userId: user.id,
            },
            process.env.JWT_SECRET_KEY as Secret,
            { expiresIn: '1h' },
        );

        // Create the reset password link
        const resetPasswordLink = `${getDomain()}/reset-password?token=${resetToken}`;

        const resend = new Resend(process.env.RESEND_API_KEY);
        try {
            await resend.emails.send({
                from: `recovery@${process.env.RESEND_EMAIL_DOMAIN}`,
                to: [email],
                subject: 'Reset Password',
                react: ResetPasswordEmail({
                    userEmail: email,
                    resetPasswordLink: resetPasswordLink,
                    lang: lang as 'fr' | 'en',
                }),
            });
            return 'Un lien de réinitialisation a été envoyé à votre adresse email';
        } catch (error) {
            throw new Error(error.message);
        }
    }

    @Mutation(() => String)
    async resetPassword(
        @Arg('token', () => String) token: string,
        @Arg('newPassword', () => String) newPassword: string,
    ) {
        try {
            // Verify the JWT token
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET_KEY as Secret,
            ) as any;

            // Check if it's a password reset token
            if (decoded.type !== 'password_reset') {
                throw new Error('Invalid token type');
            }

            // Find the user
            const user = await User.findOneBy({ id: decoded.userId });
            if (!user) {
                throw new Error('User not found');
            }

            // Hash the new password
            const hashedPassword = await argon2.hash(newPassword);

            // Update the user's password
            user.password = hashedPassword;
            await user.save();

            return 'Password has been reset successfully';
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error(
                    'Reset link has expired. Please request a new one.',
                );
            } else if (error.name === 'JsonWebTokenError') {
                throw new Error(
                    'Invalid reset link. Please request a new one.',
                );
            }
            throw new Error(error.message || 'Error resetting password');
        }
    }

    @Mutation(() => User)
    async createUser(
        @Arg('user', () => UserInput) newUser: User,
    ): Promise<User> {
        const hashedPassword = await argon2.hash(newUser.password);
        const user = User.create({
            ...newUser,
            password: hashedPassword,
        });
        await user.save();
        return user;
    }

    @Mutation(() => String)
    async confirmEmail(@Arg('codeByUser', () => String) codeByUser: string) {
        const tempUser = await TempUser.findOneBy({
            randomCode: codeByUser,
        });

        // Check if TempUser exists
        if (!tempUser) {
            throw new Error('Le code de confirmation a expiré');
        }

        // Check if code has expired
        const now = new Date();
        if (now > tempUser.codeExpirationDate) {
            // Delete the expired TempUser
            await tempUser.remove();
            throw new Error('Le code de confirmation a expiré');
        }

        const existingUser = await User.findOneBy({ email: tempUser.email });

        if (existingUser) {
            // Delete TempUser if it exists
            await tempUser.remove();
            throw new Error('Un compte est déjà associé à cette adresse email');
        }
        
        await User.save({
            email: tempUser.email,
            password: tempUser.password,
        });
        await tempUser.remove();
        return 'ok';
    }

    @Mutation(() => String)
    async resendConfirmationEmail(
        @Arg('email', () => String) email: string,
        @Arg('lang', () => String) lang: string = 'fr',
    ) {
        // Check if user already exists
        const existingUser = await User.findOneBy({ email });
        if (existingUser) {
            throw new Error('Un compte est déjà associé à cette adresse email');
        }

        // Find existing TempUser
        let tempUser = await TempUser.findOneBy({ email });
        
        // Generate new code
        const codeToConfirm = Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 10),
        ).join('');
        
        // Set expiration date to 10 minutes from now
        const codeExpirationDate = new Date();
        codeExpirationDate.setMinutes(codeExpirationDate.getMinutes() + 10);

        if (tempUser) {
            // Update existing TempUser with new code and expiration
            tempUser.randomCode = codeToConfirm;
            tempUser.codeExpirationDate = codeExpirationDate;
            await tempUser.save();
        } else {
            throw new Error('Aucun compte temporaire trouvé pour cette adresse email');
        }

        const resend = new Resend(process.env.RESEND_API_KEY);

        try {
            await resend.emails.send({
                from: `verify@${process.env.RESEND_EMAIL_DOMAIN}`,
                to: [email],
                subject: 'Verify Account Creation',
                react: VerifyAccountEmail({
                    validationCode: codeToConfirm,
                    lang: lang as 'fr' | 'en',
                }),
            });
        } catch (error) {
            console.error('Error sending confirmation email:', error);
            throw new Error('Erreur lors de l\'envoi de l\'email');
        }
        
        return 'Un nouveau code de confirmation a été envoyé à votre adresse email';
    }

    async isPasswordCorrect(
        user: User | null,
        userInputData: UserInput,
    ): Promise<boolean> {
        return await argon2.verify(user!.password, userInputData.password);
    }

    @Mutation(() => String)
    async login(
        @Arg('data', () => UserInput) loginUserData: UserInput,
        @Ctx() context: any,
    ) {
        const user = await User.findOneBy({ email: loginUserData.email });

        if (!user) {
            throw new Error("Aucun compte n'est associé à cette adresse email");
        }

        try {
            if (await this.isPasswordCorrect(user, loginUserData)) {
                const isSubscribed =
                    user.subscription &&
                    user.subscription.status === SubscriptionStatus.ACTIVE;
                const token = jwt.sign(
                    { email: user.email, userRole: user.role, isSubscribed },
                    process.env.JWT_SECRET_KEY as Secret,
                    { expiresIn: '1h' },
                );
                context.res.setHeader(
                    'Set-Cookie',
                    `token=${token}; Secure; HttpOnly; SameSite=Strict; Path=/`,
                );

                return 'The user has been logged in!';
            } else {
                throw new Error('Le mot de passe saisi est incorrect');
            }
        } catch (error) {
            throw new Error(error.message || 'Erreur lors de la connexion');
        }
    }

    @Mutation(() => String)
    async logout(@Ctx() context: any) {
        context.res.setHeader(
            'Set-Cookie',
            `token=; Secure; HttpOnly;expires=${new Date(
                Date.now(),
            ).toUTCString()}`,
        );
        return 'The user has been logged out';
    }

    @Query(() => [User])
    async getAllUsers(): Promise<User[]> {
        const users = await User.find();
        return users;
    }

    @Query(() => Boolean)
    async checkUserExists(
        @Arg('email', () => String) email: string,
    ): Promise<boolean> {
        const user = await User.findOneBy({ email });
        return !!user;
    }

    @Query(() => UserInfo)
    async getUserInfo(@Ctx() context: any): Promise<UserInfo> {
        if (context.email) {
            const user = await User.findOne({
                where: { email: context.email },
            });
            if (user) {
                // Calculate total bytes used from user's resources using the same method as ResourceResolver
                const result = await Resource.createQueryBuilder('resource')
                    .select('SUM(resource.size)', 'totalSize')
                    .where('resource.user.id = :userId', { userId: user.id })
                    .getRawOne();

                const totalBytesUsed = result?.totalSize
                    ? Number(result.totalSize)
                    : 0;
                const storagePercentage =
                    calculateStoragePercentage(totalBytesUsed);

                return {
                    isLoggedIn: true,
                    email: context.email,
                    id: user.id,
                    isSubscribed: user.subscription ? true : false,
                    role: user.role,
                    profilePicture: user.profilePicture,
                    storage: {
                        bytesUsed: formatFileSize(totalBytesUsed),
                        percentage: storagePercentage,
                    },
                };
            }
        }
        return { isLoggedIn: false };
    }

    @Query(() => [Resource])
    async getUserSharedResources(
        @Arg('userId', () => ID) userId: number,
    ): Promise<Resource[]> {
        const user = await User.findOne({
            where: { id: userId },
            relations: ['sharedResources'],
        });
        const sharedResources = user?.sharedResources ?? [];

        // récup les infos de l'utilisateur propriétaire
        const resourcesWithOwner = await Promise.all(
            sharedResources.map(async (resource) => {
                const resourceWithUser = await Resource.findOne({
                    where: { id: resource.id },
                    relations: ['user'],
                });
                return resourceWithUser;
            }),
        );

        return resourcesWithOwner.filter(
            (resource): resource is Resource => resource !== null,
        );
    }

    @Query(() => PaginatedResources)
    async getUserSharedResourcesPaginated(
        @Arg('userId', () => ID) userId: number,
        @Arg('pagination', () => PaginationInput) pagination: PaginationInput,
    ): Promise<PaginatedResources> {
        const { page, limit } = pagination;
        const skip = (page - 1) * limit;

        // First get the user with shared resources
        const user = await User.findOne({
            where: { id: userId },
            relations: ['sharedResources'],
        });
        const sharedResources = user?.sharedResources ?? [];

        if (sharedResources.length === 0) {
            return {
                resources: [],
                totalCount: 0,
                totalPages: 0,
                currentPage: page,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        }

        // Get the resource IDs
        const resourceIds = sharedResources.map(resource => resource.id);

        // Get paginated resources with owner info
        const [resources, totalCount] = await Resource.createQueryBuilder('resource')
            .leftJoinAndSelect('resource.user', 'user')
            .where('resource.id IN (:...resourceIds)', { resourceIds })
            .orderBy('resource.createdAt', 'DESC')
            .skip(skip)
            .take(limit)
            .getManyAndCount();

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            resources,
            totalCount,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPreviousPage,
        };
    }

    @Query(() => [User])
    async getAuthorsWhoSharedWithUser(
        @Arg('userId', () => ID) userId: number,
    ): Promise<User[]> {
        // Get user and related shared resources
        const user = await User.findOne({
            where: { id: userId },
            relations: ['sharedResources', 'sharedResources.user'],
        });

        const authorsMap = new Map<number, User>();
        (user?.sharedResources || []).forEach((res) => {
            if (res.user) {
                authorsMap.set(res.user.id, res.user);
            }
        });
        
        return Array.from(authorsMap.values());
    }

    @Query(() => PaginatedResources)
    async searchSharedResourcesByUserId(
        @Arg('userId', () => ID) userId: number,
        @Arg('search', () => SearchInput) search: SearchInput,
    ): Promise<PaginatedResources> {
        const { searchTerm, page, limit, types, authorId } = search;
        const skip = (page - 1) * limit;

        // First get the user with shared resources
        const user = await User.findOne({
            where: { id: userId },
            relations: ['sharedResources'],
        });
        const sharedResources = user?.sharedResources ?? [];

        if (sharedResources.length === 0) {
            return {
                resources: [],
                totalCount: 0,
                totalPages: 0,
                currentPage: page,
                hasNextPage: false,
                hasPreviousPage: false,
            };
        }

        // Get the resource IDs
        const resourceIds = sharedResources.map(resource => resource.id);

        // Create a query builder for more complex search
        const queryBuilder = Resource.createQueryBuilder('resource')
            .leftJoinAndSelect('resource.user', 'user')
            .where('resource.id IN (:...resourceIds)', { resourceIds });
        
        // Add search term filter only if provided
        if (searchTerm && searchTerm.trim()) {
            queryBuilder.andWhere('resource.name ILIKE :searchTerm', { searchTerm: `%${searchTerm}%` });
        }
        
        queryBuilder.orderBy('resource.name', 'ASC') // Sort by name for relevance
            .addOrderBy('resource.createdAt', 'DESC'); // Secondary sort by creation date

        if (authorId) {
            queryBuilder.andWhere('user.id = :authorId', { authorId });
        }

        // Optional type filters by extension groups
        if (types && types.length > 0) {
            const extensionGroups: Record<string, string[]> = {
                image: ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'],
                video: ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', 'm4v'],
                audio: ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'],
                pdf: ['pdf'],
                archive: ['zip', 'rar', '7z', 'tar', 'gz', 'bz2', 'xz'],
                document: ['doc', 'docx', 'txt', 'rtf', 'odt'],
                spreadsheet: ['xls', 'xlsx', 'csv', 'ods'],
                code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'json', 'xml', 'sql', 'py', 'java', 'c', 'cpp', 'php', 'rb', 'go', 'rs'],
            };

            const selectedExtensions = types
                .flatMap((type: string) => extensionGroups[type] || [])
                .filter((v: string, i: number, a: string[]) => a.indexOf(v) === i);

            if (selectedExtensions.length > 0) {
                // Build OR conditions for matching file extensions in the name
                const orConditions: string[] = [];
                const params: Record<string, string> = {};
                selectedExtensions.forEach((ext: string, idx: number) => {
                    const key = `ext${idx}`;
                    orConditions.push(`resource.name ILIKE :${key}`);
                    params[key] = `%.${ext}`;
                });
                queryBuilder.andWhere(`(${orConditions.join(' OR ')})`, params);
            }
        }

        // Get total count for pagination
        const totalCount = await queryBuilder.getCount();

        // Apply pagination
        const resources = await queryBuilder
            .skip(skip)
            .take(limit)
            .getMany();

        const totalPages = Math.ceil(totalCount / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;

        return {
            resources,
            totalCount,
            totalPages,
            currentPage: page,
            hasNextPage,
            hasPreviousPage,
        };
    }

    @Mutation(() => User)
    async updateProfilePicture(
        @Arg('data', () => UpdateProfilePictureInput)
        data: UpdateProfilePictureInput,
        @Ctx() context: any,
    ): Promise<User> {
        if (!context.email) {
            throw new Error('User not authenticated');
        }

        const user = await User.findOne({ where: { email: context.email } });

        if (!user) {
            throw new Error('User not found');
        }

        user.profilePicture = data.profilePictureUrl;
        await user.save();

        return user;

        // TODO: Optionnel - supprimer l'ancien fichier du storage
    }

    @Mutation(() => String)
    async deleteUser(@Arg('id', () => ID) id: number): Promise<string> {
        const user = await User.findOne({
            where: { id },
            relations: ['reports', 'sharedResources', 'subscription'],
        });

        if (!user) {
            throw new Error("L'utilisateur demandé n'a pas été trouvé");
        }

        // Empêcher la suppression de l'utilisateur connecté
        // TODO: Ajouter une vérification du contexte pour empêcher l'auto-suppression

        try {
            await User.remove(user);

            // Log de l'événement
            await SystemLogResolver.logEvent(
                LogType.SUCCESS,
                'Utilisateur supprimé',
                `L'utilisateur ${user.email} a été supprimé du système`,
                user.email,
            );

            return 'Utilisateur supprimé avec succès';
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                "Erreur lors de la suppression d'utilisateur",
                `Erreur lors de la suppression de l'utilisateur ${user.email}: ${error}`,
                user.email,
            );
            throw new Error("Erreur lors de la suppression de l'utilisateur");
        }
    }

    @Mutation(() => String)
    async updateUserRole(
        @Arg('id', () => ID) id: number,
        @Arg('role', () => UserRole) role: UserRole,
    ): Promise<string> {
        const user = await User.findOne({ where: { id } });

        if (!user) {
            throw new Error("L'utilisateur demandé n'a pas été trouvé");
        }

        // Empêcher la modification de son propre rôle
        // TODO: Ajouter une vérification du contexte pour empêcher l'auto-modification

        try {
            const oldRole = user.role;
            user.role = role;
            await User.save(user);

            // Log de l'événement
            await SystemLogResolver.logEvent(
                LogType.SUCCESS,
                'Rôle utilisateur mis à jour',
                `L'utilisateur ${user.email} est passé de ${oldRole} à ${role}`,
                user.email,
            );

            return `Rôle de l'utilisateur mis à jour avec succès vers ${role}`;
        } catch (error) {
            // Log de l'erreur
            await SystemLogResolver.logEvent(
                LogType.ERROR,
                'Erreur lors de la mise à jour du rôle',
                `Erreur lors de la mise à jour du rôle de ${user.email}: ${error}`,
                user.email,
            );
            throw new Error('Erreur lors de la mise à jour du rôle');
        }
    }
}

export default UserResolver;
