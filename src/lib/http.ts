import { API_URL, USE_MOCK } from '@/lib/env';
import { ApiError } from '@/lib/errors';
import { mockRequest } from '@/lib/mock';
import { clearToken, getToken } from '@/lib/tokenStorage';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type RequestOptions = { method?: Method; body?: unknown };

async function send<T>(path: string, method: Method, body: unknown, token: string | null): Promise<T> {
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  let payload: BodyInit | undefined;
  if (body instanceof FormData) {
    payload = body;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }

  const response = await fetch(`${API_URL}${path}`, { method, headers, body: payload });
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(data?.message ?? 'Une erreur est survenue, réessayez.', response.status);
  }
  return data as T;
}

export async function request<T>(path: string, { method = 'GET', body }: RequestOptions = {}): Promise<T> {
  const token = getToken();
  try {
    return USE_MOCK
      ? await mockRequest<T>({ method, path, body, token })
      : await send<T>(path, method, body, token);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && !path.startsWith('/auth')) {
      clearToken();
      window.location.assign('/login');
    }
    throw error;
  }
}
