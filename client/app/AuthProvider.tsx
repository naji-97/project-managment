// client/context/AuthContext.tsx
'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI, User } from '@/lib/auth';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    signup: (email: string, password: string, name: string, username: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const session = await authAPI.getSession();
            console.log('session', session);
            
            if (session?.data?.user) {
                setUser(session.data.user);
            }
        } catch (error) {
            console.error('Auth check failed:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        const result = await authAPI.signIn(email, password);
        if (result.data?.user) {
            setUser(result.data.user);
        } else {
            throw new Error(result.error || 'Login failed');
        }
    };

    const logout = async () => {
        await authAPI.signOut();
        setUser(null);
    };

    const signup = async (email: string, password: string, name: string, username: string) => {
        const result = await authAPI.signUp(email, password, name, username);
        if (result.data?.user) {
            setUser(result.data.user);
        } else {
            throw new Error(result.error || 'Signup failed');
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};