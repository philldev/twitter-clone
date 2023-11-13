import { getCurrentUser } from "@/lib/session";
import {
  GitHubLogoIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { redirect } from "next/navigation";
import React from "react";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user) redirect("/");

  return (
    <div className="min-h-screen grid place-items-center">
      {children}
      <div className="text-muted-foreground text-xs">
        <div className="mb-2 text-center">
          This app is experimental a project created by{" "}
          <a
            href="https://github.com/philldev"
            target="_blank"
            className="font-bold underline"
          >
            @deddywolley
          </a>
        </div>
        <ul className="flex gap-2 justify-center">
          <li className="flex gap-2 items-center">
            <a href="https://github.com/philldev/twitter-clone" target="_blank">
              <GitHubLogoIcon />
            </a>
          </li>
          <li className="flex gap-2 items-center">
            <a href="https://twitter.com/DeddyWolley" target="_blank">
              <TwitterLogoIcon />
            </a>
          </li>
          <li className="flex gap-2 items-center">
            <a href="https://www.instagram.com/deddy.wolley/" target="_blank">
              <InstagramLogoIcon />
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
