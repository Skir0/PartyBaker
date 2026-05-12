import { createContext, useContext, type ReactNode } from 'react';
import { useTelegram } from '../hooks/useTelegram';

export interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
}

interface AuthContextType {
    user: TelegramUser | undefined;
    initData: string;
    isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { user, initData, isReady } = useTelegram();

    return (
        <AuthContext.Provider value={{ user, initData, isReady }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}