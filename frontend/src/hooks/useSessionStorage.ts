export const useSessionStorage = () => {

  const setItem = (key: string, value: string) => {
    sessionStorage.setItem(key, value);
  };

  const getItem = (key: string) => {
    const value = sessionStorage.getItem(key);
    return value;
  };

  const removeItem = (key: string) => {
    sessionStorage.removeItem(key);
  };

  return { setItem, getItem, removeItem };
};
