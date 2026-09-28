import db from '@/lib/db';
import { account, user } from '@trylinky/db/schema';
import {
  constantTimeEqual,
  hashPassword,
  verifyPassword,
} from 'better-auth/crypto';
import { eq } from 'drizzle-orm';

/**
 * Meta's app reviewers sign in with a fixed email and password through
 * lin.ky/api/test-user-private-login. Both come from the Worker's
 * APP_REVIEW_USER_EMAIL and APP_REVIEW_USER_PASSWORD secrets, and are read
 * per call rather than at module scope (see trustedOrigins in lib/auth.ts).
 */
function getAppReviewCredentials() {
  const email = process.env.APP_REVIEW_USER_EMAIL?.trim().toLowerCase();
  const password = process.env.APP_REVIEW_USER_PASSWORD;

  if (!email || !password) {
    return null;
  }

  return { email, password };
}

export function isAppReviewSignIn(body: unknown) {
  const credentials = getAppReviewCredentials();
  const { email, password } = (body ?? {}) as Record<string, unknown>;

  if (
    !credentials ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return false;
  }

  // Evaluate both so the response time does not reveal which one was wrong.
  const emailMatches = email.trim().toLowerCase() === credentials.email;
  const passwordMatches = constantTimeEqual(password, credentials.password);

  return emailMatches && passwordMatches;
}

/**
 * better-auth checks the password against the user's `credential` account,
 * so that row has to exist and hold a hash of the current secret. Creating it
 * here, rather than with a one-off script against production, means rotating
 * the secret is all it takes to change the password.
 */
export async function ensureAppReviewUser() {
  const credentials = getAppReviewCredentials();

  if (!credentials) {
    return;
  }

  let existingUser = await db.query.user.findFirst({
    where: (u, { eq }) => eq(u.email, credentials.email),
  });

  if (!existingUser) {
    // Inserted directly so the sign-up hooks (welcome emails, Slack, CRM
    // contact) never fire for a reviewer. The session hook still gives them
    // a personal organization on first sign-in.
    [existingUser] = await db
      .insert(user)
      .values({
        email: credentials.email,
        name: 'App Review',
        emailVerified: true,
      })
      .returning();
  }

  const existingAccount = await db.query.account.findFirst({
    where: (a, { and, eq }) =>
      and(eq(a.userId, existingUser.id), eq(a.providerId, 'credential')),
  });

  if (!existingAccount) {
    await db.insert(account).values({
      userId: existingUser.id,
      accountId: existingUser.id,
      providerId: 'credential',
      password: await hashPassword(credentials.password),
    });
    return;
  }

  if (
    existingAccount.password &&
    (await verifyPassword({
      hash: existingAccount.password,
      password: credentials.password,
    }))
  ) {
    return;
  }

  await db
    .update(account)
    .set({ password: await hashPassword(credentials.password) })
    .where(eq(account.id, existingAccount.id));
}
