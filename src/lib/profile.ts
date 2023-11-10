"use server";

import prisma from "./prisma";
import { getCurrentUser } from "./session";

export async function getUserProfile() {
  const user = await getCurrentUser();

  if (!user) throw new Error("Not logged in");

  const profile = await prisma.profile.findUnique({
    where: {
      userId: user.uid,
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  return profile;
}

export async function getProfile(username: string) {
  const profile = await prisma.profile.findFirst({
    where: {
      user: {
        username,
      },
    },
    include: {
      user: {
        select: {
          username: true,
        },
      },
    },
  });

  return profile;
}

export async function updateProfile(input: {
  bio?: string | undefined;
  userId: string;
}) {
  try {
    await prisma.profile.update({
      data: {
        bio: input.bio,
      },
      where: {
        userId: input.userId,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
