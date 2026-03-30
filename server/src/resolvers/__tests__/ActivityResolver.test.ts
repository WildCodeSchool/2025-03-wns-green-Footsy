import { beforeEach, describe, expect, it, jest } from "@jest/globals";

import {
  createMockActivity,
  createMockCategory,
  createMockType,
  createMockUser,
} from "../../__tests__/helpers";

import Activity from "../../entities/Activity";
import type Category from "../../entities/Category";
import Type from "../../entities/Type";
import User from "../../entities/User";

import ActivityResolver from "../ActivityResolver";
import { Between } from "typeorm";
import type { CreateActivityInput } from "../ActivityResolver";

describe("ActivityResolver", () => {
  let activityResolver: ActivityResolver;
  let mockUser: User;
  let mockActivity1: Activity;
  let mockActivity2: Activity;
  let mockActivity3: Activity;
  let mockCategory1: Category;
  let mockCategory2: Category;
  let mockType1: Type;
  let mockType2: Type;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Initialize resolver
    activityResolver = new ActivityResolver();

    // Create mock categories
    mockCategory1 = createMockCategory({
      id: 1,
      title: "Transport",
      quantity_unit: "km"
    });

    mockCategory2 = createMockCategory({
      id: 2,
      title: "Alimentation",
      quantity_unit: "kg"
    });

    // Create mock types
    mockType1 = createMockType({
      id: 1,
      title: "Voiture",
      category_id: 1,
      category: mockCategory1,
    });

    mockType2 = createMockType({
      id: 2,
      title: "Viande",
      category_id: 2,
      category: mockCategory2,
    });

    // Create mock user
    mockUser = createMockUser({
      id: 1,
      email: "test@example.com",
      first_name: "John",
      last_name: "Doe",
    });

    // Create mock activities
    mockActivity1 = createMockActivity({
      id: 1,
      title: "Trip to work",
      quantity: 15.5,
      date: new Date("2024-01-15"),
      co2_equivalent: 3.2,
      user: mockUser,
      type: mockType1,
    });

    mockActivity2 = createMockActivity({
      id: 2,
      title: "Lunch meat",
      quantity: 0.5,
      date: new Date("2024-01-16"),
      co2_equivalent: 2.8,
      user: mockUser,
      type: mockType2,
    });

    mockActivity3 = createMockActivity({
      id: 3,
      title: "Shopping trip",
      quantity: 8.0,
      date: new Date("2024-01-17"),
      co2_equivalent: 1.7,
      user: mockUser,
      type: mockType1,
    });
  });

  describe("getActivitiesByUserIdAndYear", () => {
    it("should return activities for a user within the specified year", async () => {
      // Arrange
      const userId = 1;
      const year = 2024;

      const mockActivities = [mockActivity1, mockActivity2, mockActivity3];

      jest.spyOn(Activity, "find").mockResolvedValue(mockActivities);

      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31);

      // Act
      const result = await activityResolver.findActivitiesByUserIdAndYear(
        userId,
        year
      );

      // Assert
      expect(Activity.find).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          date: Between(startDate, endDate),
        },
        relations: ["type", "type.category"],
        order: { date: "ASC" },
      });
      expect(result).toEqual(mockActivities);
      expect(result).toHaveLength(3);
    });
  });

  describe("getActivitiesByUserIdAndCategory", () => {
    it("should return activities for a user within the specified category", async () => {
      // Arrange
      const userId = 1;
      const categoryId = 1;

      const filteredActivities = [mockActivity1, mockActivity3];
      jest.spyOn(Activity, "find").mockResolvedValue(filteredActivities);

      // Act
      const result = await activityResolver.findActivitiesByUserIdAndCategory(
        userId,
        categoryId
      );

      // Assert
      expect(Activity.find).toHaveBeenCalledWith({
        where: {
          user: { id: userId },
          type: { category: { id: categoryId } },
        },
        relations: ["type", "type.category"],
        order: { date: "ASC" },
      });
      expect(result).toEqual(filteredActivities);
      expect(result).toHaveLength(2);
    });
  });

  describe("getActivitiesByUserIdAndFilters", () => {
    it("should return all activities for a user when no category filter is provided", async () => {
      // Arrange
      const filterData = {
        user_id: 1,
      };

      const mockActivities = [mockActivity1, mockActivity2, mockActivity3];

      // Mock User.findOne
      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      // Mock Activity.find
      jest.spyOn(Activity, "find").mockResolvedValue(mockActivities);

      // Act
      const result = await activityResolver.getActivitiesByUserIdAndFilters(
        filterData
      );

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Activity.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ["type", "type.category"],
      });
      expect(result).toEqual(mockActivities);
      expect(result).toHaveLength(3);
    });

    it("should return filtered activities by category when category_id is provided", async () => {
      // Arrange
      const filterData = {
        user_id: 1,
        category_id: 1, // Transport category
      };

      const filteredActivities = [mockActivity1, mockActivity3]; // Both are transport activities

      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(Activity, "find").mockResolvedValue(filteredActivities);

      // Act
      const result = await activityResolver.getActivitiesByUserIdAndFilters(
        filterData
      );

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Activity.find).toHaveBeenCalledWith({
        where: {
          user: { id: 1 },
          type: { category: { id: 1 } },
        },
        relations: ["type", "type.category"],
      });
      expect(result).toEqual(filteredActivities);
      expect(result).toHaveLength(2);
    });

    it("should return empty array when user has no activities for the specified category", async () => {
      // Arrange
      const filterData = {
        user_id: 1,
        category_id: 3, // Non-existent category
      };

      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(Activity, "find").mockResolvedValue([]);

      // Act
      const result = await activityResolver.getActivitiesByUserIdAndFilters(
        filterData
      );

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Activity.find).toHaveBeenCalledWith({
        where: {
          user: { id: 1 },
          type: { category: { id: 3 } },
        },
        relations: ["type", "type.category"],
      });
      expect(result).toEqual([]);
      expect(result).toHaveLength(0);
    });

    it("should throw an error when user is not found", async () => {
      // Arrange
      const filterData = {
        user_id: 999, // Non-existent user
      };

      jest.spyOn(User, "findOne").mockResolvedValue(null);

      // Act & Assert
      await expect(
        activityResolver.getActivitiesByUserIdAndFilters(filterData)
      ).rejects.toThrow("User not found");

      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(Activity.find).not.toHaveBeenCalled();
    });

    it("should handle undefined category_id correctly", async () => {
      // Arrange
      const filterData = {
        user_id: 1,
        category_id: undefined,
      };

      const mockActivities = [mockActivity1, mockActivity2];

      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(Activity, "find").mockResolvedValue(mockActivities);

      // Act
      const result = await activityResolver.getActivitiesByUserIdAndFilters(
        filterData
      );

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Activity.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ["type", "type.category"],
      });
      expect(result).toEqual(mockActivities);
    });

    it("should handle category_id value of 0 correctly", async () => {
      // Arrange
      const filterData = {
        user_id: 1,
        category_id: 0,
      };

      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(Activity, "find").mockResolvedValue([]);

      // Act
      const result = await activityResolver.getActivitiesByUserIdAndFilters(
        filterData
      );

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Activity.find).toHaveBeenCalledWith({
        where: {
          user: { id: 1 },
          type: { category: { id: 0 } },
        },
        relations: ["type", "type.category"],
      });
      expect(result).toEqual([]);
    });

    it("should verify that the correct where clause is built when both filters are provided", async () => {
      // Arrange
      const filterData = {
        user_id: 5,
        category_id: 2,
      };

      const mockUserDifferent = createMockUser({
        id: 5,
        email: "different@example.com",
      });
      const filteredActivities = [mockActivity2];

      jest.spyOn(User, "findOne").mockResolvedValue(mockUserDifferent);
      jest.spyOn(Activity, "find").mockResolvedValue(filteredActivities);

      // Act
      const result = await activityResolver.getActivitiesByUserIdAndFilters(
        filterData
      );

      // Assert
      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 5 } });
      expect(Activity.find).toHaveBeenCalledWith({
        where: {
          user: { id: 5 },
          type: { category: { id: 2 } },
        },
        relations: ["type", "type.category"],
      });
      expect(result).toEqual(filteredActivities);
    });

    it("should handle database errors gracefully", async () => {
      // Arrange
      const filterData = {
        user_id: 1,
      };

      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest
        .spyOn(Activity, "find")
        .mockRejectedValue(new Error("Database connection failed"));

      // Act & Assert
      await expect(
        activityResolver.getActivitiesByUserIdAndFilters(filterData)
      ).rejects.toThrow("Database connection failed");

      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Activity.find).toHaveBeenCalledWith({
        where: { user: { id: 1 } },
        relations: ["type", "type.category"],
      });
    });
  });

  describe("createActivity", () => {
    const validCreateInput: CreateActivityInput = {
      title: "Trajet domicile-travail",
      quantity: 25.5,
      date: new Date("2025-11-18"),
      co2_equivalent: 5.1,
      user_id: 1,
      type_id: 1,
    };

    it("should create an activity when user and type exist and input is valid", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(Type, "findOne").mockResolvedValue(mockType1);

      const savedActivity = createMockActivity({
        id: 10,
        title: validCreateInput.title,
        quantity: validCreateInput.quantity,
        date: validCreateInput.date,
        co2_equivalent: validCreateInput.co2_equivalent,
        user: mockUser,
        type: mockType1,
      });

      const createSpy = jest
        .spyOn(Activity, "create")
        .mockReturnValue(savedActivity);
      const saveSpy = jest
        .spyOn(savedActivity, "save")
        .mockResolvedValue(savedActivity);

      const result = await activityResolver.createActivity(validCreateInput);

      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Type.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(createSpy).toHaveBeenCalled();
      expect(saveSpy).toHaveBeenCalled();
      expect(result).toEqual(savedActivity);
    });

    it("should throw 'User not found' when user_id does not match any user", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(null);
      jest.spyOn(Type, "findOne").mockResolvedValue(mockType1);

      await expect(
        activityResolver.createActivity({
          ...validCreateInput,
          user_id: 999,
        })
      ).rejects.toThrow("User not found");

      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(Type.findOne).not.toHaveBeenCalled();
      expect(Activity.create).not.toHaveBeenCalled();
    });

    it("should throw 'Type not found' when type_id does not match any type", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(Type, "findOne").mockResolvedValue(null);

      await expect(
        activityResolver.createActivity({
          ...validCreateInput,
          type_id: 999,
        })
      ).rejects.toThrow("Type not found");

      expect(User.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(Type.findOne).toHaveBeenCalledWith({ where: { id: 999 } });
      expect(Activity.create).not.toHaveBeenCalled();
    });

    it("should normalize date when passed as string (ISO)", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(Type, "findOne").mockResolvedValue(mockType1);

      const savedActivity = createMockActivity({
        ...validCreateInput,
        date: new Date("2024-11-18"),
        user: mockUser,
        type: mockType1,
      });
      jest.spyOn(Activity, "create").mockReturnValue(savedActivity);
      jest.spyOn(savedActivity, "save").mockResolvedValue(savedActivity);

      await activityResolver.createActivity({
        ...validCreateInput,
        date: "2024-11-18" as unknown as Date,
      });

      expect(Activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          date: expect.any(Date),
        })
      );
    });

    it("should create activity with nullable quantity (undefined)", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(Type, "findOne").mockResolvedValue(mockType1);

      const inputWithoutQuantity = {
        ...validCreateInput,
        quantity: undefined,
      };
      const savedActivity = createMockActivity({
        ...inputWithoutQuantity,
        user: mockUser,
        type: mockType1,
      });
      jest.spyOn(Activity, "create").mockReturnValue(savedActivity);
      jest.spyOn(savedActivity, "save").mockResolvedValue(savedActivity);

      const result = await activityResolver.createActivity(
        inputWithoutQuantity as CreateActivityInput
      );

      expect(Activity.create).toHaveBeenCalledWith(
        expect.objectContaining({
          quantity: undefined,
        })
      );
      expect(result).toEqual(savedActivity);
    });

    it("should propagate database errors on save", async () => {
      jest.spyOn(User, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(Type, "findOne").mockResolvedValue(mockType1);

      const createdActivity = createMockActivity({
        ...validCreateInput,
        user: mockUser,
        type: mockType1,
      });
      jest.spyOn(Activity, "create").mockReturnValue(createdActivity);
      jest
        .spyOn(createdActivity, "save")
        .mockRejectedValue(new Error("value too long for column \"title\""));

      await expect(
        activityResolver.createActivity(validCreateInput)
      ).rejects.toThrow("value too long for column \"title\"");

      expect(Activity.create).toHaveBeenCalled();
      expect(createdActivity.save).toHaveBeenCalled();
    });
  });
});
