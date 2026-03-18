import * as SecureStore from "expo-secure-store";
import api from "./api";

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post("/users/login", { email, password });

    if (response.data.token) {
      await SecureStore.setItemAsync("userToken", response.data.token);
    }
    return response.data;
  },

  register: async (username: string, email: string, password: string) => {
    const response = await api.post("/users/register", {
      username,
      email,
      password,
    });

    if (response.data.token) {
      await SecureStore.setItemAsync("userToken", response.data.token);
    }
    return response.data;
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("userToken");
  },
};
