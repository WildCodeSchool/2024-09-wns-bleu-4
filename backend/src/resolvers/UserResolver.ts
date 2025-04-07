import { TempUser, User } from '@/entities/User';
import * as argon2 from 'argon2';
import { IsEmail, Length, Matches } from 'class-validator';
import jwt, { Secret } from 'jsonwebtoken';
import { Resend } from 'resend';
import {
    Arg,
    Ctx,
    Field,
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

@ObjectType()
export class UserInfo {
    @Field(() => Boolean)
    isLoggedIn: boolean;

    @Field(() => String, { nullable: true })
    email?: String;
}

@Resolver(User)
class UserResolver {
    @Mutation(() => String)
    async register(@Arg('data', () => UserInput) newUserData: User) {
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
                from: `${process.env.RESEND_EMAIL_SENDER}`,
                to: [newUserData.email],
                subject: 'Verify Email',
                html: `
            <p>Veuillez rentrer le code secret dans la page de confirmation d'inscription</p>
            <p>Code secret: ${codeToConfirm}</p>
            `,
            });
        } catch (error) {
            throw new Error(error);
        }
        return 'The user has been created!';
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
            throw new Error('A user with this email already exists');
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

        try {
            if (user && (await this.isPasswordCorrect(user, loginUserData))) {
                const token = jwt.sign(
                    { email: user.email, userRole: user.role },
                    process.env.JWT_SECRET_KEY as Secret,
                );
                context.res.setHeader(
                    'Set-Cookie',
                    `token=${token}; Secure; HttpOnly`,
                );

                return 'The user has been logged in!';
            }
        } catch (error) {
            throw new Error(error);
        }
        return 'There was an error during login.';
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

    @Query(() => UserInfo)
    async getUserInfo(@Ctx() context: any) {
        if (context.email) {
            return { isLoggedIn: true, email: context.email };
        } else {
            return { isLoggedIn: false };
        }
    }
}

export default UserResolver;
