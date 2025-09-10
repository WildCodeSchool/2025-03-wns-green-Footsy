const API_URL = "http://localhost:5050/graphql";

export const login = async (email: string, password: string) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: `
          mutation Login($data: UserInput!) {
            login(data: $data)
          }
        `,
        variables: {
          data: {
            email,
            password,
          },
        },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      throw new Error("Login failed");
    }

    return result.data.login;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const parseLoginResponse = (response: string) => {
  try {
    // Split by "; token=" to separate user data and token
    const parts = response.split("; token=");
    if (parts.length !== 2) {
      throw new Error("Invalid response format");
    }
    
    const userData = parts[0];
    const token = parts[1];
    
    // Parse user data (it's JSON stringified)
    const user = JSON.parse(userData);
    
    return {
      user,
      token
    };
  } catch (error) {
    console.error("Error parsing login response:", error);
    throw new Error("Failed to parse login response");
  }
};

export const saveToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
};
