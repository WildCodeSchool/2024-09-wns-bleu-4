export const useLocalStorage = () => {

  const setItem = (key: string, value: string) => {
    localStorage.setItem(key, value);
  };

  const getItem = (key: string) => {
    const value = localStorage.getItem(key);
    return value;
  };

  const removeItem = (key: string) => {
    localStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};