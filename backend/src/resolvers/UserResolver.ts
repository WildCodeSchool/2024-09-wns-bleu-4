import { TempUser, User } from '@/entities/User';
import * as argon2 from 'argon2';
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
import { v4 as uuidv4 } from 'uuid';

@InputType()
export class UserInput implements Partial<User> {
    @Field(() => String)
    email: string;

    @Field(() => String)
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
        const randomCode = uuidv4();
        await TempUser.save({
            email: newUserData.email,
            password: await argon2.hash(newUserData.password),
            generatedCode: randomCode,
        });
        const resend = new Resend(process.env.RESEND_API_KEY);

        try {
            await resend.emails.send({
                from: `${process.env.RESEND_EMAIL_SENDER}`,
                to: [newUserData.email],
                subject: 'Verify Email',
                html: `
            <p>Please click the link below to confirm your email address</p>
            <a href="http://localhost:7000/confirm/${randomCode}">
              http://localhost:7000/confirm/${randomCode}
            </a>
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
            generatedCode: codeByUser,
        });
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
