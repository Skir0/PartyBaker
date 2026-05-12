import { useEffect, useState } from 'react';
import type { TelegramUser } from '../contexts/AuthContext.tsx';

const tg = (window as any).Telegram?.WebApp;

export function useTelegram() {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (tg) {
            tg.ready();
            setIsReady(true);
        }
    }, []);

    return {
        tg,
        // The secure string you send in headers to your Go backend
        initData: tg?.initData || '',

        // The parsed user object for FRONTEND UI USE ONLY
        user: tg?.initDataUnsafe?.user as TelegramUser,
        isReady,
    };
}