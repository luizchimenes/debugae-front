import Cookies from "js-cookie";
import { UserService } from "./userService";

export const AuthService = {
  login(email: string, password: string) {
    const users = UserService.getAll();
    const user = users.find(
      (u) => u.email === email && u.password === password
    );

    if (user) {
      Cookies.set("loggedUser", JSON.stringify(user), {
        path: "/", 
        sameSite: "lax",
      });
      return user;
    }

    return null;
  },

  logout() {
    Cookies.remove("loggedUser", { path: "/" }); 
  },

  getLoggedUser() {
    const user = Cookies.get("loggedUser");
    return user ? JSON.parse(user) : null;
  },
};
