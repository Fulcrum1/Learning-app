// hooks/useAuth.ts
import { useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
}

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // Récupère les informations utilisateur depuis localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setUser(null);
        }
    }, []);

    return { user };
}
