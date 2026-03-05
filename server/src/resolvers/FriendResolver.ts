import { Field, Float, InputType, Int, ObjectType, Query, Resolver, Arg } from "type-graphql";
import { In } from "typeorm";

import Friend from "../entities/Friend";
import User from "../entities/User";
import Activity from "../entities/Activity";

@InputType()
class FriendInput {
    @Field(()=> Int)
    requester_id: number;

    @Field(()=> Int)
    requested_id: number;

    @Field(() => Boolean)
    accepted: boolean;
}

@ObjectType()
class FriendCo2RankingEntry {
  @Field(() => User)
  user: User;

  @Field(() => Float, { nullable: true })
  averageCo2Kg: number | null;

  @Field(() => Int)
  activitiesCount: number;

  @Field(() => Int)
  rank: number;
}

@ObjectType()
class FriendCo2RankingResponse {
  @Field(() => [FriendCo2RankingEntry])
  top3: FriendCo2RankingEntry[];

  @Field(() => FriendCo2RankingEntry, { nullable: true })
  me: FriendCo2RankingEntry | null;

  @Field(() => Int)
  total: number;
}

@Resolver(Friend)
export default class FriendResolver {
  private async getAcceptedFriendIds(userId: number): Promise<number[]> {
    const friendships = await Friend.find({
      where: [
        { requester_id: userId, accepted: true },
        { requested_id: userId, accepted: true },
      ],
    });

    const ids: number[] = [];
    for (const friend of friendships) {
      const otherId = friend.requester_id === userId ? friend.requested_id : friend.requester_id;
      ids.push(otherId);
    }
    return Array.from(new Set(ids));
  }

  @Query(() => [User])
  async getAcceptedFriends(
    @Arg("userId", () => Int) userId: number
  ): Promise<User[]> {
    const friendIds = await this.getAcceptedFriendIds(userId);
    if (friendIds.length === 0) return [];

    return await User.find({
      where: { id: In(friendIds) },
      relations: ["avatar"],
    });
  }

  @Query(() => FriendCo2RankingResponse)
  async getFriendsCo2Ranking(
    @Arg("userId", () => Int) userId: number
  ): Promise<FriendCo2RankingResponse> {
    const friendIds = await this.getAcceptedFriendIds(userId);
    const groupIds = Array.from(new Set([userId, ...friendIds]));

    const users = await User.find({
      where: { id: In(groupIds) },
      relations: ["avatar"],
    });

    if (users.length === 0) {
      return { top3: [], me: null, total: 0 };
    }

    const aggregates = await Activity.createQueryBuilder("activity")
      .leftJoin("activity.user", "user")
      .select("user.id", "userId")
      .addSelect("AVG(activity.co2_equivalent)", "avgCo2")
      .addSelect("COUNT(activity.id)", "count")
      .where("user.id IN (:...ids)", { ids: groupIds })
      .groupBy("user.id")
      .getRawMany<{ userId: string; avgCo2: string; count: string }>();

    const aggByUserId = new Map<number, { avgCo2: number; count: number }>();
    for (const row of aggregates) {
      const id = Number(row.userId);
      const avgCo2 = Number(row.avgCo2);
      const count = Number(row.count);
      aggByUserId.set(id, {
        avgCo2: Number.isFinite(avgCo2) ? avgCo2 : 0,
        count: Number.isFinite(count) ? count : 0,
      });
    }

    const entries: FriendCo2RankingEntry[] = users.map((u) => {
      const agg = aggByUserId.get(u.id);
      return {
        user: u,
        averageCo2Kg: agg && agg.count > 0 ? agg.avgCo2 : null,
        activitiesCount: agg?.count ?? 0,
        rank: 0,
      };
    });

    entries.sort((a, b) => {
      const aVal = a.averageCo2Kg ?? Number.POSITIVE_INFINITY;
      const bVal = b.averageCo2Kg ?? Number.POSITIVE_INFINITY;
      if (aVal !== bVal) return aVal - bVal;
      // If same average, prefer more data (more activities), then stable by id.
      if (a.activitiesCount !== b.activitiesCount) return b.activitiesCount - a.activitiesCount;
      return a.user.id - b.user.id;
    });

    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    const me = entries.find((e) => e.user.id === userId) ?? null;
    return {
      top3: entries.slice(0, 3),
      me,
      total: entries.length,
    };
  }
}

