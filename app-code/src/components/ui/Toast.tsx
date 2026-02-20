"use client";

import React, { useState, useEffect, useCallback, createContext, useContext } from "react";

type ToastType = "success" | "error" | "warning" | "info";

interface ToastItem {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: ToastType, message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType>({
    showToast: () => { },
});

export function useToast() {
    return useContext(ToastContext);
}

const iconMap: Record<ToastType, string> = {
    success: "check_circle",
    error: "cancel",
    warning: "warning",
    info: "info",
};

const colorMap: Record<ToastType, string> = {
    success: "var(--color-success)",
    error: "var(--color-error)",
    warning: "var(--color-warning)",
    info: "var(--color-info)",
};

function ToastMessage({ item, onClose }: { item: ToastItem; onClose: (id: string) => void }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(item.id);
        }, item.duration || 4000);
        return () => clearTimeout(timer);
    }, [item, onClose]);

    return (
        <div className={`toast toast-${item.type} animate-toast-in`}>
            <span
                className="material-symbols-outlined icon-filled"
                style={{ color: colorMap[item.type], fontSize: 20, flexShrink: 0 }}
            >
                {iconMap[item.type]}
            </span>
            <div style={{ flex: 1, fontSize: 13, lineHeight: 1.5 }}>
                {item.message}
            </div>
            <button
                onClick={() => onClose(item.id)}
                style={{
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    padding: 0,
                    color: "var(--color-text-muted)",
                    flexShrink: 0,
                }}
            >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
            </button>
        </div>
    );
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);

    const showToast = useCallback((type: ToastType, message: string, duration?: number) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, type, message, duration }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container */}
            <div
                style={{
                    position: "fixed",
                    top: 16,
                    right: 16,
                    zIndex: 100,
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                }}
            >
                {toasts.map((t) => (
                    <ToastMessage key={t.id} item={t} onClose={removeToast} />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export default ToastProvider;
