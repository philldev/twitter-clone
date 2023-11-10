import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getUserProfile } from "@/lib/profile";
import { getUserInitials } from "@/lib/utils";
import Link from "next/link";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { signOut } from "next-auth/react";
import { SignoutButton } from "./signout-btn";

export async function Header() {
  return (
    <div className="h-[65px] border-b px-4 flex items-center justify-between">
      <Link href="/">
        <AppLogo />
      </Link>
      <Menu />
    </div>
  );
}

async function Menu() {
  const profile = await getUserProfile();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost">
          <HamburgerMenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="py-4 flex flex-col gap-6">
          <Link href="/">
            <AppLogo />
          </Link>
          <div>
            <div className="flex gap-2 items-center">
              <Avatar className="w-[32px] h-[32px]">
                <AvatarImage src={profile?.avatar_url!} />
                <AvatarFallback>
                  {getUserInitials(profile?.user.username || "")}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <div className="font-bold">@{profile?.user.username}</div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <Button asChild variant="ghost" className="justify-start">
              <Link href={`/profile/${profile?.user.username}`}>Profile</Link>
            </Button>
            <SignoutButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function AppLogo() {
  return (
    <div className="font-bold">
      twitter<span className="text-blue-500">clone</span>
    </div>
  );
}
