"use server";

import prisma from "./prisma";
import { getCurrentUser } from "./session";

export async function getTweet(tweetId: string) {
  const currentUser = await getCurrentUser();

  let tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
      userId: true,
      replyParent: {
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
          _count: {
            select: {
              replies: true,
              likes: true,
            },
          },
        },
      },
      _count: {
        select: {
          replies: true,
          likes: true,
        },
      },
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

  let liked = false;
  let replyParentLiked = false;

  if (!tweet) throw new Error("Tweet not found");

  if (currentUser) {
    const tweetLike = await prisma.tweetLike.findUnique({
      where: {
        userId_tweetId: {
          tweetId: tweet.id,
          userId: currentUser.uid,
        },
      },
    });
    liked = !!tweetLike;

    if (tweet.replyParent) {
      const tweetLike = await prisma.tweetLike.findUnique({
        where: {
          userId_tweetId: {
            tweetId: tweet.replyParent.id,
            userId: currentUser.uid,
          },
        },
      });
      replyParentLiked = !!tweetLike;
    }
  }

  type Tweet = typeof tweet & {
    liked?: boolean;
    likeCount: number;
    replyCount: number;
    replyParent: typeof tweet.replyParent & {
      liked: boolean;
      likeCount: number;
      replyCount: number;
    };
  };

  return {
    ...tweet,
    likeCount: tweet._count.likes,
    replyCount: tweet._count.replies,
    liked,
    replyParent: tweet.replyParent
      ? {
          ...tweet.replyParent,
          liked: replyParentLiked,
          likeCount: tweet.replyParent?._count.likes,
          replyCount: tweet.replyParent?._count.replies,
        }
      : null,
  } as Tweet;
}

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
      replyParentId: null,
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
      _count: {
        select: {
          replies: true,
          likes: true,
        },
      },
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

        return {
          liked: !!liked,
          likeCount: t._count.likes,
          replyCount: t._count.replies,
          ...t,
        };
      }),
    );
  }

  type Tweet = (typeof tweets)[number] & {
    liked?: boolean;
    likeCount: number;
    replyCount: number;
  };

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

export async function getReplies(input: {
  tweetId: string;
  cursorId?: string;
}) {
  const currentUser = await getCurrentUser();
  const { cursorId } = input;

  if (!currentUser) throw new Error("no user!");

  try {
    const tweet = await prisma.tweet.findUnique({
      where: {
        id: input.tweetId,
      },
      select: {
        replies: {
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
            _count: {
              select: {
                replies: true,
                likes: true,
              },
            },
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
        },
      },
    });

    if (!tweet) return [];

    type Tweet = (typeof tweet.replies)[number] & {
      liked?: boolean;
      likeCount: number;
      replyCount: number;
    };

    let replies: Tweet[] = [];

    if (currentUser) {
      replies = await Promise.all(
        tweet.replies.map(async (t) => {
          const liked = await prisma.tweetLike.findUnique({
            where: {
              userId_tweetId: {
                tweetId: t.id,
                userId: currentUser.uid,
              },
            },
          });

          return {
            liked: !!liked,
            likeCount: t._count.likes,
            replyCount: t._count.replies,
            ...t,
          };
        }),
      );
    }

    return replies;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
}

export async function createReply(input: { content: string; tweetId: string }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("no user!");

  try {
    await prisma.tweet.create({
      data: {
        replyParentId: input.tweetId,
        content: input.content,
        userId: currentUser.uid,
      },
    });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
}

export async function deleteTweet(input: { tweetId: string }) {
  try {
    await prisma.tweetLike.deleteMany({
      where: {
        tweetId: input.tweetId,
      },
    });

    await prisma.tweet.delete({
      where: {
        id: input.tweetId,
      },
    });

    return true;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
}
