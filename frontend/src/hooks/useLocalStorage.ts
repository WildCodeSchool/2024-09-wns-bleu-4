<<<<<<< HEAD
import { useState } from "react";

export const useLocalStorage = () => {
  const [value, setValue] = useState<string | null>(null);

  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
    setValue(value);
=======
export const useLocalStorage = () => {

  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
>>>>>>> origin/dev
  };

  const getItem = (key: string) => {
    const value = localStorage.getItem(key);
    return value;
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
<<<<<<< HEAD
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
=======
  };

  return { setItem, getItem, removeItem };
>>>>>>> origin/dev
};