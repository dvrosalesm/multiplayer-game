import { User } from "./Auth";

interface InMemoryDBFields {
  users: User[],
}

const MEMORYDB = {
  users: [],
} as InMemoryDBFields;

export const DataStorageHelper = {
  getUsers: (): User[] => {
    return MEMORYDB.users
  },
  getUserById: (id: string): User => {
    return MEMORYDB.users.find(user => user.id === id);
  },
  getUserBySocket: (socketId: string): User => {
    return MEMORYDB.users.find(user => user.socket?.id === socketId);
  },
  addUser: (user: User): void => {
    MEMORYDB.users.push(user);
  }
}
