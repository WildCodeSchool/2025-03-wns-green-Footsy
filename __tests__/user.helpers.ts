import { type APIRequestContext, expect, test } from "@playwright/test";

const GRAPHQL_URL = process.env.E2E_GRAPHQL_URL ?? "http://localhost:4000";

export type E2ETestUser = {
  id: number;
  email: string;
  password: string;
};

type SignupPublicProfile = {
  id: number;
};

async function createTestUser(
  request: APIRequestContext,
): Promise<E2ETestUser> {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  const email = `e2e-auth-${unique}@footsy.com`;
  const password = "TestPassword123";

  const avatarsResponse = await request.post(GRAPHQL_URL, {
    data: {
      query: `
        query GetAllAvatars {
          getAllAvatars {
            id
            title
            image
          }
        }
      `,
    },
  });

  const avatarsBody = await avatarsResponse.json();
  const avatar = avatarsBody?.data?.getAllAvatars?.[0];
  expect(
    avatar,
    "Aucun avatar disponible pour créer un utilisateur e2e",
  ).toBeTruthy();

  const signUpResponse = await request.post(GRAPHQL_URL, {
    data: {
      query: `
        mutation SignUp($data: NewUserInput!) {
          signup(data: $data)
        }
      `,
      variables: {
        data: {
          first_name: "E2E",
          last_name: "Auth",
          email,
          password,
          birthdate: "1990-01-01",
          avatar,
        },
      },
    },
  });

  const signUpBody = await signUpResponse.json();
  expect(signUpBody.errors).toBeFalsy();

  const rawProfile = signUpBody.data?.signup;
  expect(rawProfile).toBeTruthy();

  const parsedProfile = JSON.parse(rawProfile) as SignupPublicProfile;

  return {
    id: parsedProfile.id,
    email,
    password,
  };
}

async function deleteTestUser(request: APIRequestContext, userId: number) {
  const deleteResponse = await request.post(GRAPHQL_URL, {
    data: {
      query: `
        mutation DeleteAccount($userId: Int!) {
          deleteAccount(userId: $userId)
        }
      `,
      variables: {
        userId,
      },
    },
  });

  const deleteBody = await deleteResponse.json();
  expect(deleteBody.errors).toBeFalsy();
  expect(deleteBody.data?.deleteAccount).toBeTruthy();
}

export function useE2ETestUser() {
  let testUser: E2ETestUser | null = null;

  test.beforeAll(async ({ request }) => {
    testUser = await createTestUser(request);
  });

  test.afterAll(async ({ request }) => {
    if (!testUser) return;
    await deleteTestUser(request, testUser.id);
  });

  return {
    get user(): E2ETestUser {
      if (!testUser) {
        throw new Error("Le test user n'est pas initialisé");
      }
      return testUser;
    },
  };
}
