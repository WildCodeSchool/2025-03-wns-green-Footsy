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
  createMockAvatar,
  createMockFormEvent,
  createMockInputEvent,
  createMockUserFormData,
} from "../../__tests__/helpers";
import type { Avatar } from "../../types/Avatar.types";
import {
  type FormErrors,
  handleChange,
  handleSubmit,
  type SignUpFormData,
} from "../signUpForm.services";

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock Apollo Client mutation
const mockSignUpMutation = vi.fn();

// Utility function to get the callback from setErrors mock
const getSetErrorsCallback = (
  mockSetErrors: MockedFunction<
    React.Dispatch<React.SetStateAction<FormErrors>>
  >
) => {
  return mockSetErrors.mock.calls[0][0] as (prev: FormErrors) => FormErrors;
};

describe("signUpForm.services", () => {
  let mockFormData: SignUpFormData;
  let mockSetFormData: MockedFunction<
    React.Dispatch<React.SetStateAction<SignUpFormData>>
  >;
  let mockSetErrors: MockedFunction<
    React.Dispatch<React.SetStateAction<FormErrors>>
  >;
  let mockAvatar: Avatar;
  let mockErrors: FormErrors;

  beforeEach(() => {
    vi.clearAllMocks();

    mockAvatar = createMockAvatar();

    mockFormData = createMockUserFormData({
      avatar: mockAvatar,
    });

    mockErrors = {
      emailMismatch: false,
      passwordMismatch: false,
    };

    mockSetFormData = vi.fn();
    mockSetErrors = vi.fn();
  });

  describe("handleChange", () => {
    it("should update form data with new value", () => {
      const event = createMockInputEvent("name", "Smith");

      handleChange(event, mockFormData, mockSetFormData, mockSetErrors);

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        name: "Smith",
      });
    });

    it("should detect email mismatch when emails differ", () => {
      const event = createMockInputEvent(
        "confirmEmail",
        "different@example.com"
      );

      const formDataWithEmail = {
        ...mockFormData,
        email: "john@example.com",
      };

      handleChange(event, formDataWithEmail, mockSetFormData, mockSetErrors);

      expect(mockSetErrors).toHaveBeenCalledWith(expect.any(Function));

      // Verify the callback function sets emailMismatch to true
      const setErrorsCallback = getSetErrorsCallback(mockSetErrors);
      const result = setErrorsCallback({
        emailMismatch: false,
        passwordMismatch: false,
      });
      expect(result.emailMismatch).toBe(true);
    });

    it("should not detect email mismatch when emails match", () => {
      const event = createMockInputEvent("confirmEmail", "john@example.com");

      const formDataWithEmail = {
        ...mockFormData,
        email: "john@example.com",
      };

      handleChange(event, formDataWithEmail, mockSetFormData, mockSetErrors);

      expect(mockSetErrors).toHaveBeenCalledWith(expect.any(Function));

      const setErrorsCallback = getSetErrorsCallback(mockSetErrors);
      const result = setErrorsCallback({
        emailMismatch: false,
        passwordMismatch: false,
      });
      expect(result.emailMismatch).toBe(false);
    });

    it("should detect password mismatch when passwords differ", () => {
      const event = createMockInputEvent(
        "confirmPassword",
        "differentpassword"
      );

      const formDataWithPassword = {
        ...mockFormData,
        password: "password123",
      };

      handleChange(event, formDataWithPassword, mockSetFormData, mockSetErrors);

      expect(mockSetErrors).toHaveBeenCalledWith(expect.any(Function));

      const setErrorsCallback = getSetErrorsCallback(mockSetErrors);
      const result = setErrorsCallback({
        emailMismatch: false,
        passwordMismatch: false,
      });
      expect(result.passwordMismatch).toBe(true);
    });

    it("should not detect password mismatch when passwords match", () => {
      const event = createMockInputEvent("confirmPassword", "password123");

      const formDataWithPassword = {
        ...mockFormData,
        password: "password123",
      };

      handleChange(event, formDataWithPassword, mockSetFormData, mockSetErrors);

      expect(mockSetErrors).toHaveBeenCalledWith(expect.any(Function));

      const setErrorsCallback = getSetErrorsCallback(mockSetErrors);
      const result = setErrorsCallback({
        emailMismatch: false,
        passwordMismatch: false,
      });
      expect(result.passwordMismatch).toBe(false);
    });

    it("should not check mismatch when email or confirmEmail is empty", () => {
      const event = createMockInputEvent(
        "confirmEmail",
        "different@example.com"
      );

      const formDataWithEmptyEmail = {
        ...mockFormData,
        email: "",
      };

      handleChange(
        event,
        formDataWithEmptyEmail,
        mockSetFormData,
        mockSetErrors
      );

      const setErrorsCallback = getSetErrorsCallback(mockSetErrors);
      const result = setErrorsCallback({
        emailMismatch: false,
        passwordMismatch: false,
      });
      expect(result.emailMismatch).toBe(false);
    });
  });

  describe("handleSubmit", () => {
    let mockEvent: React.FormEvent;

    beforeEach(() => {
      mockEvent = createMockFormEvent();
    });

    it("should prevent default form submission", async () => {
      await handleSubmit(
        mockEvent,
        mockFormData,
        mockErrors,
        mockSignUpMutation
      );

      expect(mockEvent.preventDefault).toHaveBeenCalled();
    });

    it("should show error when there are email mismatch errors", async () => {
      const errorsWithEmailMismatch = {
        emailMismatch: true,
        passwordMismatch: false,
      };

      await handleSubmit(
        mockEvent,
        mockFormData,
        errorsWithEmailMismatch,
        mockSignUpMutation
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Veuillez corriger les erreurs avant de soumettre le formulaire."
      );
      expect(mockSignUpMutation).not.toHaveBeenCalled();
    });

    it("should show error when there are password mismatch errors", async () => {
      const errorsWithPasswordMismatch = {
        emailMismatch: false,
        passwordMismatch: true,
      };

      await handleSubmit(
        mockEvent,
        mockFormData,
        errorsWithPasswordMismatch,
        mockSignUpMutation
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Veuillez corriger les erreurs avant de soumettre le formulaire."
      );
      expect(mockSignUpMutation).not.toHaveBeenCalled();
    });

    it("should show error when required fields are missing", async () => {
      const incompleteFormData = {
        ...mockFormData,
        name: undefined,
        email: undefined,
      };

      await handleSubmit(
        mockEvent,
        incompleteFormData,
        mockErrors,
        mockSignUpMutation
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Veuillez remplir tous les champs et sélectionner un avatar."
      );
      expect(mockSignUpMutation).not.toHaveBeenCalled();
    });

    it("should show error when avatar is missing", async () => {
      const formDataWithoutAvatar = {
        ...mockFormData,
        avatar: undefined,
      };

      await handleSubmit(
        mockEvent,
        formDataWithoutAvatar,
        mockErrors,
        mockSignUpMutation
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Veuillez remplir tous les champs et sélectionner un avatar."
      );
      expect(mockSignUpMutation).not.toHaveBeenCalled();
    });

    it("should call signUpMutation with correct data when form is valid", async () => {
      mockSignUpMutation.mockResolvedValueOnce({});

      await handleSubmit(
        mockEvent,
        mockFormData,
        mockErrors,
        mockSignUpMutation
      );

      expect(mockSignUpMutation).toHaveBeenCalledWith({
        variables: {
          data: {
            first_name: mockFormData.surname,
            last_name: mockFormData.name,
            email: mockFormData.email,
            birthdate: mockFormData.birthdate
              ? new Date(mockFormData.birthdate).toISOString()
              : undefined,
            password: mockFormData.password,
            avatar: {
              id: mockAvatar.id,
              title: mockAvatar.title,
              image: mockAvatar.image,
            },
          },
        },
      });

      expect(toast.info).toHaveBeenCalledWith("Inscription réussie !");
    });

    it("should handle email already in use error", async () => {
      const emailInUseError = new Error("Email already in use");
      mockSignUpMutation.mockRejectedValueOnce(emailInUseError);

      await handleSubmit(
        mockEvent,
        mockFormData,
        mockErrors,
        mockSignUpMutation
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Cette adresse e-mail est déjà utilisée."
      );
    });

    it("should handle generic errors", async () => {
      const genericError = new Error("Network error");
      mockSignUpMutation.mockRejectedValueOnce(genericError);

      await handleSubmit(
        mockEvent,
        mockFormData,
        mockErrors,
        mockSignUpMutation
      );

      expect(toast.error).toHaveBeenCalledWith(
        "Erreur lors de l'inscription. Veuillez réessayer."
      );
    });
  });

  describe("integration test", () => {
    it("should complete full sign up form flow", async () => {
      // Test form data update
      const emailChangeEvent = createMockInputEvent(
        "email",
        "newuser@example.com"
      );

      handleChange(
        emailChangeEvent,
        mockFormData,
        mockSetFormData,
        mockSetErrors
      );

      expect(mockSetFormData).toHaveBeenCalledWith({
        ...mockFormData,
        email: "newuser@example.com",
      });

      // Test successful submission
      const completeFormData: SignUpFormData = {
        name: "Smith",
        surname: "Jane",
        birthdate: "1995-05-15",
        email: "jane.smith@example.com",
        confirmEmail: "jane.smith@example.com",
        password: "securepassword123",
        confirmPassword: "securepassword123",
        avatar: mockAvatar,
      };

      const mockEvent = createMockFormEvent();

      mockSignUpMutation.mockResolvedValueOnce({});

      await handleSubmit(
        mockEvent,
        completeFormData,
        mockErrors,
        mockSignUpMutation
      );

      expect(mockSignUpMutation).toHaveBeenCalledWith({
        variables: {
          data: {
            first_name: "Jane",
            last_name: "Smith",
            email: "jane.smith@example.com",
            birthdate: new Date("1995-05-15").toISOString(),
            password: "securepassword123",
            avatar: {
              id: mockAvatar.id,
              title: mockAvatar.title,
              image: mockAvatar.image,
            },
          },
        },
      });

      expect(toast.info).toHaveBeenCalledWith("Inscription réussie !");
    });
  });
});
