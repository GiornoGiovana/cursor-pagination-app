import { MyContext } from "src/context";
import { MiddlewareFn } from "type-graphql";

export const isAuth: MiddlewareFn<MyContext> = ({ context }, next) => {
  const { userId } = context.req.session;
  if (!userId) {
    throw new Error("Not authenticated");
  }
  return next();
};
