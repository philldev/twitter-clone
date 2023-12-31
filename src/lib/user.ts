"use server";

import { hash } from "bcrypt";
import prisma from "./prisma";
import { getCurrentUser } from "./session";

export async function getIsFollowing(followerId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Not logged in");

  try {
    const exists = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.uid,
          followingId: followerId,
        },
      },
    });
    return !!exists;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

export async function getFollowerCount(userId: string) {
  try {
    const count = await prisma.follows.count({
      where: {
        followingId: userId,
      },
    });
    return count;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

export async function getFollowingCount(userId: string) {
  try {
    const count = await prisma.follows.count({
      where: {
        followerId: userId,
      },
    });
    return count;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

export async function followUser(userId: string) {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Not logged in");

  try {
    const exists = await prisma.follows.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.uid,
          followingId: userId,
        },
      },
    });
    if (exists) {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: currentUser.uid,
            followingId: userId,
          },
        },
      });
    } else {
      await prisma.follows.create({
        data: {
          followerId: currentUser.uid,
          followingId: userId,
        },
      });
    }
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }

  return true;
}

export async function getUserFollowers(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        followers: {
          select: {
            follower: {
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

    if (!user) throw new Error("User not found");

    return user.followers;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

export async function getUserFollowing(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        following: {
          select: {
            following: {
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

    if (!user) throw new Error("User not found");

    return user.following;
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong");
  }
}

export async function updateUsername(input: { username: string }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Not logged in");

  const exists = await prisma.user.findUnique({
    where: {
      username: input.username,
    },
  });

  if (exists) throw new Error("Username is taken");

  await prisma.user.update({
    where: {
      id: currentUser.uid,
    },
    data: {
      username: input.username,
    },
  });

  return true;
}

export async function updatePassword(input: { password: string }) {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Not logged in");

  const hashedPassword = await hash(input.password, 10);

  await prisma.user.update({
    where: {
      id: currentUser.uid,
    },
    data: {
      password: hashedPassword,
    },
  });

  return true;
}

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  return user;
}
