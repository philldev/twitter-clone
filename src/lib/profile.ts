import prisma from "./prisma";
import { getCurrentUser } from "./session";

export async function getProfile() {
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
