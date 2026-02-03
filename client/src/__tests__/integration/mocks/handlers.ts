import { http, HttpResponse } from "msw";

// Login mutation response format: JSON user string + "; token=" + token (same as backend)
const MOCK_LOGIN_RESPONSE =
  '{"id":1,"firstName":"Test","lastName":"User","mail":"test@test.com","birthDate":"1990-01-01","avatar":{"id":1,"title":"Avatar","image":"test.png"},"isAdmin":false}; token=mock-jwt-token';

export const loginHandlers = [
  http.post("/graphql", async ({ request }) => {
    const body = await request.json();
    const { operationName, query } = body as {
      operationName?: string;
      query?: string;
    };
    // Match Login mutation by operation name or query string
    const isLogin =
      operationName === "Login" || (query && query.includes("mutation Login"));

    if (isLogin) {
      return HttpResponse.json({
        data: {
          login: MOCK_LOGIN_RESPONSE,
        },
      });
    }

    return HttpResponse.json(
      { errors: [{ message: "Unhandled operation" }] },
      { status: 500 }
    );
  }),
];
