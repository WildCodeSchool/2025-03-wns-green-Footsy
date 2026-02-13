import { HttpResponse, http } from "msw";

// Login mutation response format: JSON user string + "; token=" + token (same as backend)
const MOCK_LOGIN_RESPONSE =
	'{"id":1,"firstName":"Test","lastName":"User","mail":"test@test.com","birthDate":"1990-01-01","avatar":{"id":1,"title":"Avatar","image":"test.png"},"isAdmin":false}; token=mock-jwt-token';

const MOCK_USER = {
	id: 1,
	firstName: "Test",
	lastName: "User",
	mail: "test@test.com",
	birthDate: "1990-01-01",
	avatar: { id: 1, title: "Avatar", image: "test.png" },
	isAdmin: false,
};

const MOCK_ACTIVITIES = [
	{
		id: 1,
		title: "Activité 1",
		description: "Description de l'activité 1",
		date: "2024-01-15",
		quantity: 10,
		co2Equivalent: 5.5,
		type: {
			id: 1,
			title: "Transport",
			category: { id: 1, title: "Déplacement" },
		},
	},
	{
		id: 2,
		title: "Activité 2",
		description: "Description de l'activité 2",
		date: "2024-01-16",
		quantity: 20,
		co2Equivalent: 10.2,
		type: {
			id: 2,
			title: "Alimentation",
			category: { id: 2, title: "Nourriture" },
		},
	},
];

export const loginHandlers = [
	http.post("/graphql", async ({ request }) => {
		const body = await request.json();
		const { operationName, query } = body as {
			operationName?: string;
			query?: string;
		};
		// Match Login mutation by operation name or query string
		const isLogin =
			operationName === "Login" || query?.includes("mutation Login");

		if (isLogin) {
			return HttpResponse.json({
				data: {
					login: MOCK_LOGIN_RESPONSE,
				},
			});
		}

		return HttpResponse.json(
			{ errors: [{ message: "Unhandled operation" }] },
			{ status: 500 },
		);
	}),
];

export const activitiesListHandlers = [
	http.post("/graphql", async ({ request }) => {
		const body = await request.json();
		const { operationName, query } = body as {
			operationName?: string;
			query?: string;
		};

		// Handle currentUser query to provide authenticated user
		const isCurrentUser =
			operationName === "GetCurrentUser" || query?.includes("currentUser");
		if (isCurrentUser) {
			return HttpResponse.json({
				data: {
					currentUser: MOCK_USER,
				},
			});
		}

		// Handle GetActivities or similar query
		const isGetActivities =
			operationName === "GetActivitiesByUser" ||
			query?.includes("activitiesByUser");
		if (isGetActivities) {
			return HttpResponse.json({
				data: {
					activitiesByUser: MOCK_ACTIVITIES,
				},
			});
		}

		return HttpResponse.json({
			data: {
				currentUser: MOCK_USER,
				activitiesByUser: MOCK_ACTIVITIES,
			},
		});
	}),
];
