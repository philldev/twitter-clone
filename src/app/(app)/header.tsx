import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserProfile } from "@/lib/profile";
import { getUserInitials } from "@/lib/utils";
import Link from "next/link";

export async function Header() {
  const profile = await getUserProfile();

  return (
    <div className="h-[65px] border-b px-4 flex items-center justify-between">
      <AppLogo />
      <Link href={`/profile/${profile?.user.username}`}>
        <Avatar>
          <AvatarImage src={profile?.avatar_url!} />
          <AvatarFallback>
            {getUserInitials(profile?.user.username || "")}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  );
}

function AppLogo() {
  return (
    <div className="font-bold">
      twitter<span className="text-blue-500">clone</span>
    </div>
  );
}
