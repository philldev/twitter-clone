"use server";

import prisma from "./prisma";
import { getCurrentUser } from "./session";

export async function getTweets({
  userId,
  cursorId,
}: {
  userId?: string;
  cursorId?: string;
} = {}) {
  const tweets = await prisma.tweet.findMany({
    where: {
      userId,
    },
    cursor: cursorId
      ? {
          id: cursorId,
        }
      : undefined,
    orderBy: {
      createdAt: "desc",
    },
    skip: cursorId ? 1 : 0,
    take: 9,
    select: {
      id: true,
      content: true,
      createdAt: true,
      userId: true,
      user: {
        select: {
          username: true,
          profile: {
            select: {
              avatar_url: true,
            },
          },
        },
      },
    },
  });

  return tweets;
}

export async function createTweet(content: string) {
  const currentUser = await getCurrentUser();

  console.log({ currentUser });

  if (!currentUser) throw new Error("Not logged in");

  await prisma.tweet.create({
    data: {
      userId: currentUser.uid,
      content,
    },
  });

  return true;
}
