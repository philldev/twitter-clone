"use server";

import { hash } from "bcrypt";
import prisma from "./prisma";

export async function signUp(input: {
  username: string;
  password: string;
  gender: "male" | "female";
}) {
  const userExists = await prisma.user.findUnique({
    select: {
      id: true,
    },
    where: {
      username: input.username,
    },
  });

  if (userExists) {
    return {
      status: "error",
      message: "Account already exists",
    };
  }

  const hashedPassword = await hash(input.password, 10);

  try {
    await prisma.user.create({
      data: {
        username: input.username,
        password: hashedPassword,
        profile: {
          create: {
            gender: input.gender,
            avatar_url: `https://avatar.iran.liara.run/public/${
              input.gender === "male" ? "boy" : "girl"
            }?username=${input.username}`,
          },
        },
      },
    });
    return {
      status: "success",
      message: "Account created!",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Something went wrong!",
    };
  }
}
