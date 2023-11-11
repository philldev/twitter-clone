import Link from "next/link";
import { AppLogo, Menu } from "./menu";
import { getUserProfile } from "@/lib/profile";

export async function Header() {
  const profile = await getUserProfile();

  return (
    <header className="h-[65px] max-w-2xl px-4 mx-auto w-full border-x border-b flex items-center justify-center">
      <div className="flex items-center justify-between w-full">
        <Link href="/">
          <AppLogo />
        </Link>
        <Menu
          avatarUrl={profile?.avatar_url!}
          username={profile?.user.username!}
        />
      </div>
    </header>
  );
}
