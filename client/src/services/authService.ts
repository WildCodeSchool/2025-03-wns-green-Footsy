export const parseLoginResponse = (response: string) => {
  try {
    // Parse user data (it's JSON stringified)
    const user = JSON.parse(response);
    return { user };
  } catch (error) {
    console.error("Error parsing login response:", error);
    throw new Error("Failed to parse login response");
  }
};
