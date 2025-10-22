import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Storage, StorageKeys } from "../utils/storage";
import { User } from "../types/index";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = () => {
    try {
      const storedToken = Storage.getString(StorageKeys.AUTH_TOKEN);
      const storedUser = Storage.getObject<User>(StorageKeys.USER);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error("Failed to load auth state:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (userData: User, authToken: string) => {
    try {
      setUser(userData);
      setToken(authToken);

      Storage.setString(StorageKeys.AUTH_TOKEN, authToken);
      Storage.setObject(StorageKeys.USER, userData);
    } catch (error) {
      console.error("Failed to save auth state:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      // Clear state
      setUser(null);
      setToken(null);

      // Clear storage (synchronous with MMKV)
      Storage.remove(StorageKeys.AUTH_TOKEN);
      Storage.remove(StorageKeys.USER);
    } catch (error) {
      console.error("Failed to clear auth state:", error);
      throw error;
    }
  };

  const updateUser = async (userData: User) => {
    try {
      setUser(userData);
      // Persist to storage (synchronous with MMKV)
      Storage.setObject(StorageKeys.USER, userData);
    } catch (error) {
      console.error("Failed to update user:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export for use in axios instance
let authContextInstance: AuthContextType | null = null;

export const setAuthContextInstance = (instance: AuthContextType) => {
  authContextInstance = instance;
};

export const getAuthToken = (): string | null => {
  return authContextInstance?.token || null;
};

export const getAuthUser = (): User | null => {
  return authContextInstance?.user || null;
};
