import Cookies from "js-cookie";
import api from "../config/axiosConfig";
import User from "../models/User";
import CreateUserResponse from "../models/responses/createUserResponse";
import CreateUserRequest from "../models/requests/createUserRequest";
import { ContributorProfession } from "../enums/ContribuitorProfession";

export const AuthService = {
  loginAsync: async (email: string, password: string): Promise<void> => {
    const response = await api.post("/login?useCookies=true&useSessionCookies=true", {email, password});
    if (response.status != 200) {
      throw new Error("Login failed");
    }
  },

  logout() {
    if (typeof window !== "undefined") {
      Cookies.remove("auth_cookie", { path: "/" });
    }
  },

  async getLoggedUser(): Promise<User | null> {    
    const currentLoggedUserData = await api.get("/contributors/me");

    if (currentLoggedUserData.status == 200) {
      const user = currentLoggedUserData.data;
      return {
        id: user.contributorId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        department: user.department,
        position: user.position
      };
    }
    return null;
  },

  registerAsync: async (userData: User): Promise<CreateUserResponse> => {
      const payload: CreateUserRequest = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password ?? "",
        department: userData.department,
        contributorProfession: ContributorProfession[userData.position as keyof typeof ContributorProfession]
      };
  
      const response = await api.post("/contributors/register", payload);
  
      return response.data;
    },
};