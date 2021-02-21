import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import argon2 from "argon2";
import { User } from "../entity/User";
import { MyContext } from "../context";
import { isAuth } from "../middleware/isAuth";

@InputType()
class EmailPasswordInput {
  @Field()
  email!: string;
  @Field()
  password!: string;
}

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext): Promise<User | undefined> | null {
    const { userId } = req.session;
    if (!userId) {
      return null;
    }
    return User.findOne(userId);
  }

  @Mutation(() => User, { nullable: true })
  async login(
    @Arg("options") options: EmailPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<User | null> {
    const user = await User.findOne({ where: { email: options.email } });

    if (!user) {
      return null;
    }

    try {
      const isValid = await argon2.verify(user.password, options.password);
      if (isValid) {
        req.session.userId = user.id;
        return user;
      } else {
        return null;
      }
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  @Mutation(() => User)
  async register(
    @Arg("username") username: string,
    @Arg("options") options: EmailPasswordInput,
    @Ctx() { req }: MyContext
  ): Promise<User> {
    const hashePassord = await argon2.hash(options.password);
    try {
      const user = await User.create({
        username,
        email: options.email,
        password: hashePassord,
      }).save();

      req.session.userId = user.id;
      return user;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
        res.clearCookie(process.env.COOKIE_NAME!);
        if (err) {
          resolve(false);
          return;
        }
        resolve(true);
      })
    );
  }
}
