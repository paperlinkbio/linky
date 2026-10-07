'use client';

import posthog from 'posthog-js';
import {
  PostHogProvider as OGPostHogProvider,
  usePostHog,
} from 'posthog-js/react';
import { useEffect } from 'react';

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();

if (typeof window !== 'undefined' && posthogKey) {
  posthog.init(posthogKey, {
    api_host: 'https://eu.i.posthog.com',
    person_profiles: 'identified_only',
  });
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!posthogKey) {
    return <>{children}</>;
  }

  return <OGPostHogProvider client={posthog}>{children}</OGPostHogProvider>;
}

export function PostHogIdentify({
  userId,
  organizationId,
}: {
  userId: string;
  organizationId: string;
}) {
  const _posthog = usePostHog();

  useEffect(() => {
    if (posthogKey && userId) {
      _posthog?.identify(userId);
      if (organizationId) {
        _posthog?.group('team', organizationId);
      }
    }
  }, [_posthog, userId, organizationId]);

  return null;
}
