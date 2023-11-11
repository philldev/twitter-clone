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
  const currentUser = await getCurrentUser();

  let tweets = await prisma.tweet.findMany({
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

  if (currentUser) {
    tweets = await Promise.all(
      tweets.map(async (t) => {
        const liked = await prisma.tweetLike.findUnique({
          where: {
            userId_tweetId: {
              tweetId: t.id,
              userId: currentUser.uid,
            },
          },
        });

        const likeCount = await prisma.tweetLike.count({
          where: {
            tweetId: t.id,
          },
        });

        return {
          liked: !!liked,
          likeCount,
          ...t,
        };
      }),
    );
  }

  type Tweet = (typeof tweets)[number] & { liked?: boolean; likeCount: number };

  return tweets as Tweet[];
}

export async function createTweet(content: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Not logged in");

  await prisma.tweet.create({
    data: {
      userId: currentUser.uid,
      content,
    },
  });

  return true;
}

export async function likeTweet(input: { userId: string; tweetId: string }) {
  try {
    const liked = await prisma.tweetLike.findUnique({
      where: {
        userId_tweetId: {
          ...input,
        },
      },
    });

    if (liked) {
      await prisma.tweetLike.delete({
        where: {
          userId_tweetId: {
            ...input,
          },
        },
      });
    } else {
      await prisma.tweetLike.create({
        data: {
          ...input,
        },
      });
    }

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
}
