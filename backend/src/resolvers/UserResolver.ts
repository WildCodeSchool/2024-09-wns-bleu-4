import { ResetPasswordEmail } from '@/emails/ResetPassword';
import { VerifyAccountEmail } from '@/emails/VerifyAccount';
import { Resource } from '@/entities/Resource';
import { LogType } from '@/entities/SystemLog';
import { TempUser, User, UserRole, UserStorage } from '@/entities/User';
import SystemLogResolver from '@/resolvers/SystemLogResolver';
import { getDomain } from '@/utils/envUtils';
import {
    calculateStoragePercentage,
    formatFileSize,
} from '@/utils/storageUtils';
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
    ) {
        const existingUser = await User.findOneBy({ email: newUserData.email });

        if (existingUser) {
            throw new Error('Un compte est déjà associé à cette adresse email');
        }

        const codeToConfirm = Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 10),
        ).join('');
        await TempUser.save({
            email: newUserData.email,
            password: await argon2.hash(newUserData.password),
            randomCode: codeToConfirm,
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
        const tempUser = await TempUser.findOneByOrFail({
            randomCode: codeByUser,
        });

        const existingUser = await User.findOneBy({ email: tempUser.email });

        if (existingUser) {
            throw new Error('Un compte est déjà associé à cette adresse email');
        }
        await User.save({
            email: tempUser.email,
            password: tempUser.password,
        });
        tempUser.remove();
        return 'ok';
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
                const token = jwt.sign(
                    { email: user.email, userRole: user.role },
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
            relations: [
                'reports',
                'sharedResources',
                'subscription',
            ],
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
