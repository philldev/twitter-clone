"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/lib/utils";
import Link from "next/link";
import {
  GitHubLogoIcon,
  HamburgerMenuIcon,
  InstagramLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { SignoutButton } from "./signout-btn";
import { useState } from "react";

export function Menu({
  username,
  avatarUrl,
}: {
  avatarUrl: string;
  username: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="px-2">
        <div className="py-4 flex flex-col gap-6">
          <Link href="/" className="pl-4 flex">
            <AppLogo />
          </Link>
          <div>
            <div className="flex pl-4 gap-2 items-center bg-black/5 py-2 rounded">
              <Avatar className="w-[32px] h-[32px]">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback>
                  {getUserInitials(username || "")}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-bold">@{username}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Button
              onClick={() => setOpen(false)}
              asChild
              variant="ghost"
              className="justify-start"
            >
              <Link href={`/profile/${username}`}>Profile</Link>
            </Button>
            <Button
              onClick={() => setOpen(false)}
              asChild
              variant="ghost"
              className="justify-start"
            >
              <Link href={`/settings`}>Settings</Link>
            </Button>
            <SignoutButton />
          </div>
        </div>
        <div className="px-4 text-xs">
          <div className="text-muted-foreground">
            <div className="mb-2">
              This app is experimental a project created by{" "}
              <a
                href="https://github.com/philldev"
                target="_blank"
                className="font-bold underline"
              >
                @deddywolley
              </a>
              .
            </div>
            <ul className="flex gap-2">
              <li className="flex gap-2 items-center">
                <a
                  href="https://github.com/philldev/twitter-clone"
                  target="_blank"
                >
                  <GitHubLogoIcon />
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <a href="https://twitter.com/DeddyWolley" target="_blank">
                  <TwitterLogoIcon />
                </a>
              </li>
              <li className="flex gap-2 items-center">
                <a
                  href="https://www.instagram.com/deddy.wolley/"
                  target="_blank"
                >
                  <InstagramLogoIcon />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function AppLogo() {
  return (
    <div className="font-bold">
      twitter<span className="text-blue-500">clone</span>
    </div>
  );
}
