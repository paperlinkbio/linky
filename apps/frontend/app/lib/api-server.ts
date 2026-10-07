import { headers } from 'next/headers';
import 'server-only';

export const apiServerFetch = async (
  path: string,
  requestOptions: RequestInit = {}
) => {
  const headersList = await headers();

  const apiUrl =
    process.env.NEXT_PUBLIC_API_URL ??
    process.env.API_BASE_URL ??
    (process.env.VERCEL_URL || process.env.V0_RUNTIME_URL
      ? 'https://api.lin.ky'
      : 'http://localhost:8787');

  return fetch(`${apiUrl.replace(/\/$/, '')}${path}`, {
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
      cookie: headersList.get('cookie') || '',
    },
  });
};
