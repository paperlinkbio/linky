import { createApp } from '@/app';
import db from '@/lib/db';
import { testEnv } from '@/test/env';
import {
  account,
  member,
  organization,
  session,
  subscription,
  user,
  userFlag,
} from '@trylinky/db/schema';
import { hashPassword } from 'better-auth/crypto';
import { eq, inArray } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

// Meta's reviewers sign in with a password at lin.ky/api/test-user-private-login.
// Password sign-in must work for that one user and nobody else.

vi.mock('@/lib/resend', () => ({ createContact: vi.fn() }));
vi.mock('@/modules/notifications/service', () => ({
  sendMagicLinkEmail: vi.fn(),
  sendOrganizationInvitationEmail: vi.fn(),
  sendWelcomeEmail: vi.fn(),
  sendWelcomeFollowUpEmail: vi.fn(),
}));
vi.mock('@/modules/slack/service', () => ({
  sendNewUserSlackMessage: vi.fn(),
  sendSlackMessage: vi.fn(),
}));
vi.mock('@/modules/billing/utils/create-new-stripe-customer', () => ({
  createNewStripeCustomer: vi.fn(async () => ({ id: 'cus_review_test' })),
}));
vi.mock('@/modules/billing/utils/create-new-subscription', () => ({
  createNewSubscription: vi.fn(async () => ({ id: 'sub_review_test' })),
}));

const suffix = randomUUID().slice(0, 8);
const reviewEmail = `app-review-${suffix}@example.com`;
const otherEmail = `not-review-${suffix}@example.com`;
const password = `pw-${randomUUID()}`;

beforeAll(() => {
  vi.stubEnv(
    'API_BASE_URL',
    process.env.API_BASE_URL ?? 'http://localhost:3001'
  );
  vi.stubEnv(
    'APP_FRONTEND_URL',
    process.env.APP_FRONTEND_URL ?? 'http://localhost:3000'
  );
  vi.stubEnv('APP_REVIEW_USER_EMAIL', reviewEmail);
  vi.stubEnv('APP_REVIEW_USER_PASSWORD', password);
});

afterAll(async () => {
  vi.unstubAllEnvs();
  const users = await db
    .select({ id: user.id })
    .from(user)
    .where(inArray(user.email, [reviewEmail, otherEmail]));
  const userIds = users.map((u) => u.id);
  if (!userIds.length) return;

  const memberships = await db
    .select({ organizationId: member.organizationId })
    .from(member)
    .where(inArray(member.userId, userIds));
  const organizationIds = memberships.map((m) => m.organizationId);

  await db.delete(session).where(inArray(session.userId, userIds));
  await db.delete(account).where(inArray(account.userId, userIds));
  await db.delete(userFlag).where(inArray(userFlag.userId, userIds));
  if (organizationIds.length) {
    await db
      .delete(subscription)
      .where(inArray(subscription.referenceId, organizationIds));
    await db
      .delete(member)
      .where(inArray(member.organizationId, organizationIds));
    await db
      .delete(organization)
      .where(inArray(organization.id, organizationIds));
  }
  await db.delete(user).where(inArray(user.id, userIds));
});

function signIn(body: Record<string, string>) {
  const origin = process.env.APP_FRONTEND_URL as string;

  return createApp().request(
    '/api/auth/sign-in/email',
    {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin },
      body: JSON.stringify(body),
    },
    testEnv()
  );
}

describe('app review password sign-in', () => {
  it('signs the review user in and gives them an organization', async () => {
    const response = await signIn({ email: reviewEmail, password });
    expect(response.status).toBe(200);

    const cookieHeader = response.headers
      .getSetCookie()
      .map((cookie) => cookie.split(';')[0])
      .join('; ');
    const me = await createApp().request(
      '/api/auth/get-session',
      {
        headers: {
          cookie: cookieHeader,
          origin: process.env.APP_FRONTEND_URL as string,
        },
      },
      testEnv()
    );
    const body = (await me.json()) as Record<string, any>;
    expect(body.user.email).toBe(reviewEmail);
    expect(body.session.activeOrganizationId).toEqual(expect.any(String));
  });

  it('signs in again with the stored credential account', async () => {
    const response = await signIn({
      email: reviewEmail.toUpperCase(),
      password,
    });
    expect(response.status).toBe(200);

    const accounts = await db
      .select({ id: account.id })
      .from(account)
      .innerJoin(user, eq(user.id, account.userId))
      .where(eq(user.email, reviewEmail));
    expect(accounts).toHaveLength(1);
  });

  it('rejects the review email with the wrong password', async () => {
    const response = await signIn({ email: reviewEmail, password: 'wrong' });
    expect(response.status).toBe(401);
  });

  it('rejects any other user, even one with a credential account', async () => {
    const [other] = await db
      .insert(user)
      .values({ email: otherEmail, name: 'Other' })
      .returning();
    await db.insert(account).values({
      userId: other.id,
      accountId: other.id,
      providerId: 'credential',
      password: await hashPassword(password),
    });

    const response = await signIn({ email: otherEmail, password });
    expect(response.status).toBe(401);
  });

  it('does not allow password sign-up', async () => {
    const origin = process.env.APP_FRONTEND_URL as string;
    const response = await createApp().request(
      '/api/auth/sign-up/email',
      {
        method: 'POST',
        headers: { 'content-type': 'application/json', origin },
        body: JSON.stringify({
          email: `signup-${suffix}@example.com`,
          password,
          name: 'Nope',
        }),
      },
      testEnv()
    );
    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
