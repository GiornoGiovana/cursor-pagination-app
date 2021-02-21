import { Movie } from "../entity/Movie";
import { Arg, Query, Resolver } from "type-graphql";

@Resolver()
export class MovieResolver {
  @Query(() => String)
  nice() {
    return `Hey yo`;
  }

  @Query(() => [Movie])
  async movies(
    @Arg("offset") offset: number,
    @Arg("limit") limit: number
  ): Promise<Movie[]> {
    return Movie.find({
      where: `id > ${offset}`,
      take: limit,
    });
  }
}
