import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { User } from "../entities/User";


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

  }

  @Mutation(() => String)
  async login(@Arg("data") loginUserData: UserInput, @Ctx() context: any) {

  }

  @Mutation(() => String)
  async logout(@Ctx() context: any) {
    
  }

  @Query(() => UserInfo)
  async getUserInfo(@Ctx() context: any) {
    
  }

  @Mutation(() => String)
  async confirmEmail(@Arg("codeByUser") codeByUser: string) {
    
  }

  @Mutation(() => String)
  async forgotPassword(@Arg("userEmail") userEmail: string) {
    
  }

  @Mutation(() => String)
  async changePassword(
    @Arg("code") code: string,
    @Arg("password") password: string
  ) {
    
  }
}

export default UserResolver;
