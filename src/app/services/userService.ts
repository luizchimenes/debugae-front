// services/UserService.ts
import { v4 as uuidv4 } from "uuid";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  department: string;
  position: string;
}

const LOCAL_STORAGE_KEY = "users";

export const UserService = {
  getAll: (): User[] => {
    const users = localStorage.getItem(LOCAL_STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  },

  create: (userData: Omit<User, "id">): User => {
    const users = UserService.getAll();
    const newUser: User = { id: uuidv4(), ...userData };
    users.push(newUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    return newUser;
  },

  getById: (id: string): User | undefined => {
    return UserService.getAll().find((user) => user.id === id);
  },

  getByListIds: (ids: string[]): User[] => {
    const users = UserService.getAll();
    return users.filter((user) => ids.includes(user.id));
  },

  update: (id: string, updatedData: Partial<Omit<User, "id">>): User | undefined => {
    const users = UserService.getAll();
    const index = users.findIndex((user) => user.id === id);
    if (index === -1) return undefined;

    users[index] = { ...users[index], ...updatedData };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
    return users[index];
  },

  delete: (id: string): void => {
    const users = UserService.getAll().filter((user) => user.id !== id);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(users));
  },
};
