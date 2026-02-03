import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";

import { renderWithProviders } from "./helpers";
import { loginHandlers } from "./mocks/handlers";
import Login from "../../pages/login/Login";

const server = setupServer(...loginHandlers);

describe("Login (integration)", () => {
  beforeAll(() => {
    server.listen({ onUnhandledRequest: "warn" });
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it("should save token after successful login", async () => {
    renderWithProviders(<Login />);

    // Fill form
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mot de passe/i);
    fireEvent.change(emailInput, { target: { value: "test@test.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });

    // Submit form
    const submitButton = screen.getByRole("button", { name: /connexion/i });
    fireEvent.click(submitButton);

    // Assert: token saved (login flow completed successfully)
    await waitFor(() => {
      expect(localStorage.getItem("token")).toBe("mock-jwt-token");
    });
  });
});
