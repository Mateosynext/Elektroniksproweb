import React, { createContext, useState, useCallback, useContext } from 'react';
import Icon from '../appIcon';

const ToastContext = createContext();

export const useToast = () => {
    const context = useContext(ToastContext); // ✅ AHORA useContext ESTÁ DISPONIBLE
    if (!context) {
        return {
            addToast: (message, type = 'info') => console.log(`[${type}]: ${message}`)
        };
    }
    return context;
};

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        const newToast = { id, message, type, duration };

        setToasts(prev => [...prev, newToast]);

        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, duration);
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    const getToastIcon = (type) => {
        switch (type) {
            case 'success': return 'CheckCircle';
            case 'error': return 'XCircle';
            case 'warning': return 'AlertTriangle';
            case 'info': return 'Info';
            default: return 'Info';
        }
    };

    const getToastColor = (type) => {
        switch (type) {
            case 'success': return 'text-success';
            case 'error': return 'text-error';
            case 'warning': return 'text-warning';
            case 'info': return 'text-info';
            default: return 'text-info';
        }
    };

    return (
        <ToastContext.Provider value={{ addToast, removeToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="flex items-center space-x-3 bg-card border border-border rounded-lg shadow-elevation-2 p-4 min-w-80 animate-in slide-in-from-right-full duration-300"
                    >
                        <Icon
                            name={getToastIcon(toast.type)}
                            size={20}
                            className={getToastColor(toast.type)}
                        />
                        <span className="text-sm font-medium text-card-foreground flex-1">
                            {toast.message}
                        </span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Icon name="X" size={16} />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};