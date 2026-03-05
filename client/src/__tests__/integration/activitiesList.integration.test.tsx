import { screen, waitFor } from "@testing-library/react";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

import History from "../../pages/history/History";
import { renderWithProviders } from "./helpers";
import { activitiesListHandlers } from "./mocks/handlers";

const server = setupServer(...activitiesListHandlers);

describe("Activities List (integration)", () => {
	beforeAll(() => {
		server.listen({ onUnhandledRequest: "warn" });
	});

	afterAll(() => {
		server.close();
	});

	beforeEach(() => {
		localStorage.clear();
	});

	it("should render the history page with filters", async () => {
		renderWithProviders(<History />);

		// Wait for the page to load
		await waitFor(() => {
			// Check that the header is rendered
			const headers = screen.getAllByText(/Historique/i);
			expect(headers.length).toBeGreaterThan(0);
		});

		// Assert: Verify filters are present
		expect(screen.getByLabelText(/Catégorie/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/Trier par/i)).toBeInTheDocument();
	});

	it("should display 'No activities found' message when list is empty", async () => {
		renderWithProviders(<History />);

		// Wait for the empty state message
		await waitFor(() => {
			expect(screen.getByText(/Aucune activité trouvée/i)).toBeInTheDocument();
		});
	});

	it("should have category and sorting filters", async () => {
		renderWithProviders(<History />);

		// Wait for filters to be rendered
		await waitFor(() => {
			const categorySelect = screen.getByDisplayValue(/Toutes/i);
			expect(categorySelect).toBeInTheDocument();
		});

		// Check that sort select has the default option
		const sortSelect = screen.getByDisplayValue(/Date ↓/i);
		expect(sortSelect).toBeInTheDocument();
	});
});
