import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import FriendResolver from "../FriendResolver";

import Activity from "../../entities/Activity";
import Friend from "../../entities/Friend";
import User from "../../entities/User";

import { createMockUser } from "../../__tests__/helpers";

describe("FriendResolver", () => {
  let friendResolver: FriendResolver;

  beforeEach(() => {
    jest.clearAllMocks();
    friendResolver = new FriendResolver();
  });

  describe("getAcceptedFriends", () => {
    it("should return empty array when user has no accepted friends", async () => {
      jest.spyOn(Friend, "find").mockResolvedValue([] as any);
      const userFindSpy = jest.spyOn(User, "find");

      const result = await friendResolver.getAcceptedFriends(1);

      expect(Friend.find).toHaveBeenCalledWith({
        where: [
          { requester_id: 1, accepted: true },
          { requested_id: 1, accepted: true },
        ],
      });
      expect(userFindSpy).not.toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should return unique accepted friends (both directions)", async () => {
      jest.spyOn(Friend, "find").mockResolvedValue([
        { requester_id: 1, requested_id: 2, accepted: true },
        { requester_id: 3, requested_id: 1, accepted: true },
        // Duplicate relationship in opposite direction to ensure de-duplication
        { requester_id: 2, requested_id: 1, accepted: true },
      ] as any);

      const user2 = createMockUser({ id: 2, first_name: "A", last_name: "Two" });
      const user3 = createMockUser({ id: 3, first_name: "B", last_name: "Three" });

      const userFindSpy = jest
        .spyOn(User, "find")
        .mockResolvedValue([user2, user3] as any);

      const result = await friendResolver.getAcceptedFriends(1);

      expect(User.find).toHaveBeenCalledTimes(1);
      const userFindArg = userFindSpy.mock.calls[0][0] as any;
      expect(userFindArg.relations).toEqual(["avatar"]);

      // TypeORM's `In([...])` returns a FindOperator instance.
      // Comparing it with `toHaveBeenCalledWith(In([...]))` is brittle because each call creates a new instance.
      const idOperator = (userFindArg.where as any).id;
      const ids = (idOperator?.value ?? idOperator?._value) as number[];
      expect(Array.isArray(ids)).toBe(true);
      expect(ids).toHaveLength(2);
      expect(ids).toEqual(expect.arrayContaining([2, 3]));
      expect(result).toEqual([user2, user3]);
    });
  });

  describe("getFriendsCo2Ranking", () => {
    it("should return empty response when no users are found", async () => {
      jest.spyOn(Friend, "find").mockResolvedValue([] as any);
      jest.spyOn(User, "find").mockResolvedValue([] as any);
      const qbSpy = jest.spyOn(Activity, "createQueryBuilder");

      const result = await friendResolver.getFriendsCo2Ranking(1);

      expect(result).toEqual({ top3: [], me: null, total: 0 });
      expect(qbSpy).not.toHaveBeenCalled();
    });

    it("should rank users by avg CO2, then by activities count, then by id", async () => {
      jest.spyOn(Friend, "find").mockResolvedValue([
        { requester_id: 1, requested_id: 2, accepted: true },
        { requester_id: 1, requested_id: 3, accepted: true },
        { requester_id: 4, requested_id: 1, accepted: true },
      ] as any);

      const me = createMockUser({ id: 1, first_name: "Me", last_name: "User" });
      const u2 = createMockUser({ id: 2, first_name: "U", last_name: "Two" });
      const u3 = createMockUser({ id: 3, first_name: "U", last_name: "Three" });
      const u4 = createMockUser({ id: 4, first_name: "U", last_name: "Four" });

      // Deliberately unsorted input to make sure resolver sorts it.
      jest.spyOn(User, "find").mockResolvedValue([u4, me, u2, u3] as any);

      const qb = {
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        groupBy: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(async () => [
          // avg 5, count 2
          { userId: "2", avgCo2: "5", count: "2" },
          // avg 3, count 1
          { userId: "1", avgCo2: "3", count: "1" },
          // avg 3, count 5 (should beat user 1 due to more activities)
          { userId: "3", avgCo2: "3", count: "5" },
          // Note: user 4 absent => averageCo2Kg should be null
        ]),
      };

      jest.spyOn(Activity, "createQueryBuilder").mockReturnValue(qb as any);

      const result = await friendResolver.getFriendsCo2Ranking(1);

      // Sorted order should be: u3 (avg 3, count 5), me (avg 3, count 1), u2 (avg 5), u4 (null)
      expect(result.total).toBe(4);
      expect(result.top3.map((e) => e.user.id)).toEqual([3, 1, 2]);
      expect(result.me?.user.id).toBe(1);
      expect(result.me?.rank).toBe(2);
      expect(result.top3.map((e) => e.rank)).toEqual([1, 2, 3]);

      // Ensure query uses group ids (me + accepted friends)
      expect(qb.where).toHaveBeenCalledTimes(1);
      const whereArgs = (qb.where as jest.Mock).mock.calls[0];
      expect(whereArgs[0]).toBe("user.id IN (:...ids)");
      expect(whereArgs[1]).toEqual({
        ids: expect.arrayContaining([1, 2, 3, 4]),
      });
    });
  });
});