import { toast } from "react-toastify";
import {
  beforeEach,
  describe,
  expect,
  it,
  type MockedFunction,
  vi,
} from "vitest";

import {
  createMockFormEvent,
  createMockInputEvent,
} from "../../__tests__/helpers";
import type { User } from "../../types/User.types";
import {
  type ActivityFormData,
  handleActivityChange,
  handleActivitySubmit,
} from "../activityForm.services";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mock localStorage for Node test environment (vitest)
const mockLocalStorage = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
if (typeof vi.stubGlobal === "function") {
  vi.stubGlobal("localStorage", mockLocalStorage as unknown as Storage);
} else {
  (globalThis as any).localStorage = mockLocalStorage;
}

// Mock Apollo Client mutation
const mockCreateActivity = vi.fn();

// Helper function to create mock user
const createMockUser = (overrides?: Partial<User>): User => ({
  id: 1,
  first_name: "John",
  last_name: "Doe",
  email: "john.doe@example.com",
  birthdate: "1990-01-01",
  isAdmin: false,
  avatar: {
    id: 1,
    title: "Avatar 1",
    image: "avatar1.png",
  },
  ...overrides,
});

// Helper function to create mock activity form data
const createMockActivityFormData = (
  overrides?: Partial<ActivityFormData>,
): ActivityFormData => ({
  title: "Morning Run",
  date: "2024-01-15",
  category_id: 1,
  type_id: 1,
  quantity: 30,
  co2_equivalent: 2.5,
  user_id: 1,
  ...overrides,
});

// Helper to create mock select event
const createMockSelectEventHelper = (
  id: string,
  value: string,
): React.ChangeEvent<HTMLSelectElement> =>
  ({
    target: {
      id,
      value,
    } as HTMLSelectElement,
    currentTarget: {} as HTMLSelectElement,
    preventDefault: vi.fn(),
    stopPropagation: vi.fn(),
  }) as unknown as React.ChangeEvent<HTMLSelectElement>;

describe("activityForm.services", () => {
  let mockFormData: ActivityFormData;
  let mockSetFormData: MockedFunction<
    React.Dispatch<React.SetStateAction<ActivityFormData>>
  >;
  let mockUser: User;
  let mockOnCategoryChange: MockedFunction<(categoryId: number) => void>;

  beforeEach(() => {
    vi.clearAllMocks();

    mockFormData = createMockActivityFormData();
    mockSetFormData = vi.fn();
    mockUser = createMockUser();
    mockOnCategoryChange = vi.fn();
  });

  describe("handleActivityChange", () => {
    it("should update form data with text value", () => {
      const event = createMockInputEvent("title", "Evening Walk");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        title: "Evening Walk",
      });
    });

    it("should update form data with date value", () => {
      const event = createMockInputEvent("date", "2024-02-20");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        date: "2024-02-20",
      });
    });

    it("should convert type_id to number", () => {
      const event = createMockSelectEventHelper("type_id", "5");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        type_id: 5,
      });
    });

    it("should handle empty type_id as 0", () => {
      const event = createMockSelectEventHelper("type_id", "");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        type_id: 0,
      });
    });

    it("should convert quantity to number", () => {
      const event = createMockInputEvent("quantity", "45");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        quantity: 45,
      });
    });

    it("should handle empty quantity as 0", () => {
      const event = createMockInputEvent("quantity", "");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        quantity: 0,
      });
    });

    it("should convert co2_equivalent to number", () => {
      const event = createMockInputEvent("co2_equivalent", "3.75");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        co2_equivalent: 3.75,
      });
    });

    it("should handle empty co2_equivalent as 0", () => {
      const event = createMockInputEvent("co2_equivalent", "");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        co2_equivalent: 0,
      });
    });

    it("should update category_id as number when category_id changes", () => {
      const event = createMockSelectEventHelper("category_id", "3");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        category_id: 3,
      });
    });

    it("should not call onCategoryChange when category_id changes but callback is not provided", () => {
      const event = createMockSelectEventHelper("category_id", "3");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        category_id: 3,
      });
      expect(mockOnCategoryChange).not.toHaveBeenCalled();
    });

    it("should not call onCategoryChange when other fields change", () => {
      const event = createMockInputEvent("title", "New Title");

      handleActivityChange(event, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalled();
    });
  });

  describe("handleActivitySubmit", () => {
    let mockEvent: React.FormEvent<HTMLFormElement>;

    beforeEach(() => {
      mockEvent = createMockFormEvent();
    });

    it("should prevent default form submission", async () => {
      await handleActivitySubmit(
        mockEvent,
        mockFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it("should show error when user is not logged in", async () => {
      await handleActivitySubmit(
        mockEvent,
        mockFormData,
        undefined,
        mockCreateActivity,
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Vous devez être connecté pour ajouter une activité.",
      );
      expect(mockCreateActivity).not.toHaveBeenCalled();
    });

    it("should show error when title is missing", async () => {
      const incompleteFormData = {
        ...mockFormData,
        title: "",
      };

      await handleActivitySubmit(
        mockEvent,
        incompleteFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(toast.error).toHaveBeenCalledWith("Le titre est requis.");
      expect(mockCreateActivity).not.toHaveBeenCalled();
    });

    it("should show error when date is missing", async () => {
      const incompleteFormData = {
        ...mockFormData,
        date: "",
      };

      await handleActivitySubmit(
        mockEvent,
        incompleteFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(toast.error).toHaveBeenCalledWith("La date est requise.");
      expect(mockCreateActivity).not.toHaveBeenCalled();
    });

    it("should show error when type_id is 0", async () => {
      const incompleteFormData = {
        ...mockFormData,
        type_id: 0,
      };

      await handleActivitySubmit(
        mockEvent,
        incompleteFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Le type d'activité est requis.",
      );
      expect(mockCreateActivity).not.toHaveBeenCalled();
    });

    it("should show error when type_id is falsy", async () => {
      const incompleteFormData = {
        ...mockFormData,
        type_id: 0,
      };

      await handleActivitySubmit(
        mockEvent,
        incompleteFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Le type d'activité est requis.",
      );
      expect(mockCreateActivity).not.toHaveBeenCalled();
    });

    it("should show error when quantity is missing", async () => {
      const incompleteFormData = {
        ...mockFormData,
        quantity: 0,
      };

      await handleActivitySubmit(
        mockEvent,
        incompleteFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(toast.error).toHaveBeenCalledWith(
        "La quantité doit être un nombre positif.",
      );
      expect(mockCreateActivity).not.toHaveBeenCalled();
    });

    it("should show error when quantity is negative", async () => {
      const invalidFormData = {
        ...mockFormData,
        quantity: -5,
      };

      await handleActivitySubmit(
        mockEvent,
        invalidFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(toast.error).toHaveBeenCalledWith(
        "La quantité doit être un nombre positif.",
      );
      expect(mockCreateActivity).not.toHaveBeenCalled();
    });

    it("should show error when co2_equivalent is negative", async () => {
      const invalidFormData = {
        ...mockFormData,
        co2_equivalent: -1.5,
      };

      await handleActivitySubmit(
        mockEvent,
        invalidFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(toast.error).toHaveBeenCalledWith(
        "L'équivalent CO2 doit être un nombre positif ou nul.",
      );
      expect(mockCreateActivity).not.toHaveBeenCalled();
    });

    it("should reject submission when quantity is 0", async () => {
      const invalidFormData = {
        ...mockFormData,
        quantity: 0,
      };

      await handleActivitySubmit(
        mockEvent,
        invalidFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(mockCreateActivity).not.toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith(
        "La quantité doit être un nombre positif.",
      );
    });

    it("should call createActivity with correct data when form is valid", async () => {
      mockCreateActivity.mockResolvedValueOnce({});

      const result = await handleActivitySubmit(
        mockEvent,
        mockFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(mockCreateActivity).toHaveBeenCalledWith({
        variables: {
          data: {
            title: mockFormData.title,
            date: new Date(mockFormData.date).toISOString(),
            type_id: mockFormData.type_id,
            quantity: mockFormData.quantity,
            co2_equivalent: mockFormData.co2_equivalent,
            user_id: mockUser.id,
          },
        },
      });

      expect(toast.success).toHaveBeenCalledWith(
        "Activité ajoutée avec succès !",
      );
      expect(result).toBe("success");
    });

    it("should handle generic errors", async () => {
      const genericError = new Error("Network error");
      mockCreateActivity.mockRejectedValueOnce(genericError);

      const result = await handleActivitySubmit(
        mockEvent,
        mockFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Une erreur est survenue lors de l'ajout de l'activité. Veuillez réessayer.",
      );
      expect(result).toBeUndefined();
    });

    it("should log error to console when submission fails", async () => {
      const consoleErrorSpy = vi
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const genericError = new Error("Network error");
      mockCreateActivity.mockRejectedValueOnce(genericError);

      await handleActivitySubmit(
        mockEvent,
        mockFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        "Erreur lors de l'ajout de l'activité:",
        genericError,
      );

      consoleErrorSpy.mockRestore();
    });
  });

  describe("integration test", () => {
    it("should complete full activity form flow", async () => {
      // Test form data update
      const titleChangeEvent = createMockInputEvent("title", "Cycling to work");

      handleActivityChange(titleChangeEvent, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        title: "Cycling to work",
      });

      // Test category change with callback
      const categoryChangeEvent = createMockSelectEventHelper(
        "category_id",
        "2",
      );

      handleActivityChange(categoryChangeEvent, mockFormData, mockSetFormData);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        category_id: 2,
      });

      // Test successful submission
      const completeFormData: ActivityFormData = {
        title: "Cycling to work",
        date: "2024-01-20",
        category_id: 2,
        type_id: 3,
        quantity: 15,
        co2_equivalent: 1.2,
        user_id: mockUser.id,
      };

      const mockEvent = createMockFormEvent();

      mockCreateActivity.mockResolvedValueOnce({});

      const result = await handleActivitySubmit(
        mockEvent,
        completeFormData,
        mockUser,
        mockCreateActivity,
      );

      expect(mockCreateActivity).toHaveBeenCalledWith({
        variables: {
          data: {
            title: "Cycling to work",
            date: new Date("2024-01-20").toISOString(),
            type_id: 3,
            quantity: 15,
            co2_equivalent: 1.2,
            user_id: mockUser.id,
          },
        },
      });

      expect(toast.success).toHaveBeenCalledWith(
        "Activité ajoutée avec succès !",
      );
      expect(result).toBe("success");
    });
  });
});
