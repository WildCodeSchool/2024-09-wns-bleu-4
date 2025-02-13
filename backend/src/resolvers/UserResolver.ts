import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { TempUser, User } from "@/entities/User";
import * as argon2 from "argon2";
import jwt, { Secret } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

@InputType()
export class UserInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ObjectType()
class UserInfo {
  @Field()
  isLoggedIn: boolean;

  @Field({ nullable: true })
  email?: String;
}

@Resolver(User)
class UserResolver {
  
  @Mutation(() => String)
  async register(@Arg("data") newUserData: UserInput) {
    
    const randomCode = uuidv4();
    const result = await TempUser.save({
      email: newUserData.email,
      password: await argon2.hash(newUserData.password),
      generatedCode: randomCode,
    });
    const resend = new Resend(process.env.RESEND_API_KEY);

      try {
        const { data } = await resend.emails.send({
          from: `Acme <${process.env.RESEND_EMAIL_SENDER}>`,
          to: [newUserData.email],
          subject: "Verify Email",
          html: `
            <p>Please click the link below to confirm your email address</p>
            <a href="http://localhost:7000/confirm/${randomCode}">
              http://localhost:7000/confirm/${randomCode}
            </a>
            `,
        });
        console.log({ data });
      } catch (error) {
        throw new Error(error);
      } finally {
        console.log("result", result);
      }

    return "The user has been created!";
  }
  
  async isPasswordCorrect(user: User | null, userInputData: UserInput): Promise<boolean> {
    return await argon2.verify(
      user!.password,
      userInputData.password
    );
  }

  @Mutation(() => String)
  async login(@Arg("data") loginUserData: UserInput, @Ctx() context: any) {
    
    const user = await User.findOneBy({ email: loginUserData.email });

    try {
      if (user && await this.isPasswordCorrect(user, loginUserData)) {
        const token = jwt.sign(
          { email: user.email, userRole: user.role },
          process.env.JWT_SECRET_KEY as Secret
        );
        context.res.setHeader("Set-Cookie", `token=${token}; Secure; HttpOnly`);

        return "The user has been logged in!";
      }
    } catch (error) {
      throw new Error(error);
    }
    return "There was an error during login."
  }

  @Mutation(() => String)
  async logout(@Ctx() context: any) {
    context.res.setHeader(
      "Set-Cookie",
      `token=; Secure; HttpOnly;expires=${new Date(Date.now()).toUTCString()}`
    );
    return "The user has been logged out";
  }

  @Query(() => UserInfo)
  async getUserInfo(@Ctx() context: any) {
    if (context.email) {
      return { isLoggedIn: true, email: context.email };
    } else {
      return { isLoggedIn: false };
    }
  }

  @Mutation(() => String)
  async confirmEmail(@Arg("codeByUser") codeByUser: string) {
    const tempUser = await TempUser.findOneByOrFail({ generatedCode: codeByUser });
    await User.save({
      email: tempUser.email,
      password: tempUser.password,
    });
    tempUser.remove();
    return "ok";
  }

  @Mutation(() => String)
  async forgotPassword(@Arg("userEmail") userEmail: string) {
    return ""
  }

  @Mutation(() => String)
  async changePassword(
    @Arg("code") code: string,
    @Arg("password") password: string
  ) {
    return ""
  }
}

export default UserResolver;
