
import { createContext, useState, useContext, useEffect, ReactNode } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  name?: string; // Added name field that user can set
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved auth state on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("c0lornote_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error("Failed to parse user data", err);
        localStorage.removeItem("c0lornote_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if user exists in localStorage (simple authentication simulation)
        const usersStr = localStorage.getItem("c0lornote_users");
        if (usersStr) {
          const users = JSON.parse(usersStr);
          const foundUser = users.find((u: any) => u.email === email);
          
          if (foundUser && foundUser.password === password) {
            // Don't store password in the user object in context
            const { password, ...userWithoutPassword } = foundUser;
            setUser(userWithoutPassword);
            localStorage.setItem("c0lornote_user", JSON.stringify(userWithoutPassword));
            setIsLoading(false);
            resolve();
            return;
          }
        }
        
        setIsLoading(false);
        reject(new Error("Invalid email or password"));
      }, 1000);
    });
  };

  const register = async (username: string, email: string, password: string, name?: string) => {
    setIsLoading(true);
    
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const usersStr = localStorage.getItem("c0lornote_users");
        const users = usersStr ? JSON.parse(usersStr) : [];
        
        if (users.some((u: any) => u.email === email || u.username === username)) {
          setIsLoading(false);
          reject(new Error("User with this email or username already exists"));
          return;
        }
        
        // Create new user
        const newUser = {
          id: "user-" + Date.now(),
          username,
          email,
          password, // Note: In a real app, this would be hashed
          name: name || username, // Use name if provided, otherwise use username
          avatar: `https://source.unsplash.com/random/400x400?face&_=${Date.now()}`,
          bio: `Hi, I'm ${name || username}! This is my c0lornote profile.`,
        };
        
        // Save to "database" (localStorage)
        users.push(newUser);
        localStorage.setItem("c0lornote_users", JSON.stringify(users));
        
        // Login the new user (without the password in the context)
        const { password: _, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem("c0lornote_user", JSON.stringify(userWithoutPassword));
        
        setIsLoading(false);
        resolve();
      }, 1000);
    });
  };

  const updateProfile = async (profileData: Partial<User>) => {
    return new Promise<void>((resolve, reject) => {
      if (!user) {
        reject(new Error("No user logged in"));
        return;
      }

      // Update user in context
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      localStorage.setItem("c0lornote_user", JSON.stringify(updatedUser));

      // Also update in the users list
      const usersStr = localStorage.getItem("c0lornote_users");
      if (usersStr) {
        const users = JSON.parse(usersStr);
        const updatedUsers = users.map((u: any) => 
          u.id === user.id ? { ...u, ...profileData } : u
        );
        localStorage.setItem("c0lornote_users", JSON.stringify(updatedUsers));
      }

      resolve();
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("c0lornote_user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
