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
      token,
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
