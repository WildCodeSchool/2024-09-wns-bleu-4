import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContextInit';

export const useAuthContext = () => useContext(AuthContext);
