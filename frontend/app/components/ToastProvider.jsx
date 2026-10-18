"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }, []);

  const notify = useCallback((message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

    setToasts((currentToasts) => [...currentToasts.slice(-2), { id, message, type }]);
    window.setTimeout(() => dismiss(id), 3200);
  }, [dismiss]);

  const value = useMemo(() => ({ notify, dismiss }), [dismiss, notify]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" role="status" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <button className={`toast toast-${toast.type}`} type="button" key={toast.id} onClick={() => dismiss(toast.id)}>
            <span>{toast.message}</span>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const toast = useContext(ToastContext);

  if (!toast) {
    throw new Error("useToast must be used inside ToastProvider");
  }

  return toast;
}
