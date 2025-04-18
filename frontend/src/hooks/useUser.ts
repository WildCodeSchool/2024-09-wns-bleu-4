import { useLocalStorage } from "./useLocalStorage";
import { useAuthContext } from "../context/AuthContext";
import { useEffect } from "react";

// NOTE: optimally move this into a separate file
export interface User {
  email: string;
  role: 'USER' | null;
  authToken?: string;
}

export const useUser = () => {
  const { user, setUser, isAuth } = useAuthContext();
  const { setItem, getItem } = useLocalStorage();

  useEffect(() => {
    if (!user) {
      const storedUser = getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  }, [getItem, setUser, user]); // Empty dependency array to run only once on mount

  const addUser = (user: User) => {
    setUser(user);
    setItem("user", JSON.stringify(user));
  };

  const removeUser = () => {
    setUser(null);
    setItem("user", "");
  };

  return { user, addUser, removeUser, setUser, isAuth };
};