import { createContext, useContext, useState, useEffect } from "react";
import { User } from "../hooks/useUser";
import { useGetUserInfoQuery } from '@/generated/graphql-types';

interface AuthContext {
  user: User | null;
  isAuth: boolean;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContext>({
  user: null,
  isAuth: false,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuth, setisAuth] = useState(false);
  const { data } = useGetUserInfoQuery();

  useEffect(() => {
    if (!user) {
      setisAuth(false);
      return;
    }

    const serverUser = data?.getUserInfo.email;
    setisAuth(user.email === serverUser);
  }, [user, data]);

  return (
    <AuthContext.Provider value={{ user, isAuth, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuthContext = () => useContext(AuthContext);