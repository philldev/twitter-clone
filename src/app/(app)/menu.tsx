"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getUserInitials } from "@/lib/utils";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
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
