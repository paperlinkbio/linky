import { headers } from 'next/headers';
import 'server-only';

export const apiServerFetch = async (
  path: string,
  requestOptions: RequestInit = {}
) => {
  const headersList = await headers();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_BASE_URL;

  if (!apiUrl) {
    throw new Error(
      'Missing API URL. Set NEXT_PUBLIC_API_URL or API_BASE_URL for the frontend.'
    );
  }

  return fetch(`${apiUrl}${path}`, {
    ...requestOptions,
    headers: {
      ...requestOptions.headers,
      cookie: headersList.get('cookie') || '',
    },
  });
};
