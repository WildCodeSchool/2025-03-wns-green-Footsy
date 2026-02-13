import { describe, expect, it } from "vitest";
import { getUserStatusBadge } from "../admin.services";
import type { User } from "../../types/User.types";

describe("admin.services", () => {
  describe("getUserStatusBadge", () => {
    it("should return 'Admin' badge with 'dark' variant for admin users", () => {
      // Arrange
      const adminUser: User = {
        id: 1,
        email: "admin@example.com",
        first_name: "Admin",
        last_name: "User",
        birthdate: "1990-01-01",
        isAdmin: true,
        avatar: {
          id: 1,
          title: "Avatar",
          image: "avatar.jpg",
        },
      };

      // Act
      const result = getUserStatusBadge(adminUser);

      // Assert
      expect(result).toEqual({
        label: "Admin",
        variant: "dark",
      });
    });

    it("should return 'Utilisateur' badge with 'light' variant for regular users", () => {
      // Arrange
      const regularUser: User = {
        id: 2,
        email: "user@example.com",
        first_name: "Regular",
        last_name: "User",
        birthdate: "1992-05-15",
        isAdmin: false,
        avatar: {
          id: 2,
          title: "Avatar",
          image: "avatar2.jpg",
        },
      };

      // Act
      const result = getUserStatusBadge(regularUser);

      // Assert
      expect(result).toEqual({
        label: "Utilisateur",
        variant: "light",
      });
    });

    it("should handle user without explicit isAdmin property (undefined)", () => {
      // Arrange
      const userWithoutAdminFlag: User = {
        id: 3,
        email: "newuser@example.com",
        first_name: "New",
        last_name: "User",
        birthdate: "1995-03-20",
        isAdmin: undefined as unknown as boolean,
        avatar: {
          id: 3,
          title: "Avatar",
          image: "avatar3.jpg",
        },
      };

      // Act
      const result = getUserStatusBadge(userWithoutAdminFlag);

      // Assert
      expect(result).toEqual({
        label: "Utilisateur",
        variant: "light",
      });
    });
  });
});
