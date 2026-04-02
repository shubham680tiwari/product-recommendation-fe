import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
    const context = useContext(UserContext);
    if(!context) {
        throw new Error('useUser must be used within userProvider');
    }
    return context;
};

export const UserProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(()=> {
        const savedUser = localStorage.getItem('user');
        if(savedUser) {
            setUser(JSON.parse(savedUser));
        } else {
            const demoUser = {
                _id: '699f40ae275daaea6426ca9b',
                name: 'Demo user',
                email: 'demo@example.com'
            };
            setUser(demoUser);
            localStorage.setItem('user', JSON.stringify(demoUser));
        }
        setLoading(false);
    }, [])

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user, 
        loading,
        login, 
        logout
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};