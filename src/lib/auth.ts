import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Get the current user's ID (server component / API route).
 * Returns null if not signed in.
 */
export async function getUserId(): Promise<string | null> {
  const { userId } = await auth();
  return userId;
}

/**
 * Require authentication. Redirects to /sign-in if not signed in.
 * Use in protected server components.
 *
 * Usage:
 *   const userId = await requireAuth();
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return userId;
}

/**
 * Get the full Clerk user object (server component only).
 * Includes name, email, avatar, etc.
 * Returns null if not signed in.
 */
export async function getUser() {
  return await currentUser();
}

/**
 * Get just the display name from a Clerk user object.
 */
export function getDisplayName(user: Awaited<ReturnType<typeof currentUser>>): string {
  if (!user) return "there";
  if (user.firstName) return user.firstName;
  if (user.username)  return user.username;
  return user.emailAddresses[0]?.emailAddress?.split("@")[0] ?? "there";
}