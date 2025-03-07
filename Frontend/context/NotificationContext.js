import { createContext, useState } from 'react';

const NotificationContext = createContext();

const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState({
        visible: false,
        message: '',
        type: 'success'
    });

    const showNotification = (message, type) => {
        setNotifications({
            visible: true,
            message,
            type
        });

        setTimeout(() => {
            setNotifications((prev) => ({ ...prev, visible: false }));
        }, 1000);
    };
    return (
        <NotificationContext.Provider value={{ notifications, showNotification }}>
            {children}
        </NotificationContext.Provider>
    )

}

export { NotificationProvider, NotificationContext };