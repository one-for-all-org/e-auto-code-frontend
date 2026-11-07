import { useCallback, useEffect, useState } from 'react';
import { Toast } from './Toast';
import { registerToast } from '@/lib/toast';

export type ToastInput = {
  type: 'success' | 'error' | 'info' | 'loading';
  message: string;
  duration?: number;
};

type StoredToast = ToastInput & { id: string };

export function Toaster() {
  const [toasts, setToasts] = useState<StoredToast[]>([]);

  const addToast = useCallback((input: ToastInput): string => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { ...input, id }]);
    return id;
  }, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    registerToast(addToast);
  }, [addToast]);

  return (
    <>
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
      ))}
    </>
  );
}
