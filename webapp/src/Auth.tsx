import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { getProfile, loginUser, logoutUser } from "./api";
import { LoginDto, UserModel } from "./models/user.model";

interface AuthContextType {
    isAuthenticated: boolean;
    user: UserModel | null;
    login: (data: LoginDto) => Promise<void>;
    logout: () => Promise<void>;
}
interface AuthProviderProps {
    children: ReactNode;
}
export interface PrivateRouteProps {
    children: JSX.Element;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserModel | null>(null);
    useEffect(() => {
        getProfile().then((response) => {
            setIsAuthenticated(true);
            setUser(response);
        }).catch(() => {
            setIsAuthenticated(false);
            setUser(null);
        });
    }, []);

    const login = (data: LoginDto): Promise<void> => {
        return loginUser(data).then((response) => {
            setIsAuthenticated(true);
            setUser(response);
        }).catch(() => {
            setIsAuthenticated(false);
            setUser(null);
        });
    }
    const logout = (): Promise<void> => {
        return logoutUser().then(() => {
            setIsAuthenticated(false);
            setUser(null);
        }).catch((error) => {
            console.log('Error logging out: ', error);
        });
    }

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
