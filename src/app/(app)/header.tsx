import Link from "next/link";
import { AppLogo, Menu } from "./menu";
import { getUserProfile } from "@/lib/profile";

export async function Header() {
  const profile = await getUserProfile();
  return (
    <div className="h-[65px] border-b px-4 flex items-center justify-between">
      <Link href="/">
        <AppLogo />
      </Link>
      <Menu
        avatarUrl={profile?.avatar_url!}
        username={profile?.user.username!}
      />
    </div>
  );
}
