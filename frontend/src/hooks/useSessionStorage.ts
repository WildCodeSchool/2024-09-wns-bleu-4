import { useState } from "react";

export const useSessionStorage = () => {
  const [value, setValue] = useState<string | null>(null);

  const setItem = (key: string, value: string) => {
    sessionStorage.setItem(key, value);
    setValue(value);
  };

  const getItem = (key: string) => {
    const value = sessionStorage.getItem(key);
    return value;
  };

  const removeItem = (key: string) => {
    sessionStorage.removeItem(key);
    setValue(null);
  };

  return { value, setItem, getItem, removeItem };
};
