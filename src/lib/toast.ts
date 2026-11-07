let addToastFn: ((toast: { type: 'success' | 'error' | 'info' | 'loading'; message: string; duration?: number }) => string) | null = null;

export function registerToast(fn: (toast: { type: 'success' | 'error' | 'info' | 'loading'; message: string; duration?: number }) => string) {
  addToastFn = fn;
}

export function toast(type: 'success' | 'error' | 'info' | 'loading', message: string, duration?: number) {
  if (addToastFn) {
    return addToastFn({ type, message, duration });
  }
  return null;
}
