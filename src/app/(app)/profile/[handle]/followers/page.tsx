import { getProfile } from "@/lib/profile";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserFollowers } from "@/lib/user";
import Link from "next/link";

export default async function Page({ params }: { params: { handle: string } }) {
  const { handle } = params;

  const profile = await getProfile(handle);

  if (!profile) throw new Error("User not found!");

  const followers = await getUserFollowers(profile.userId);

  return (
    <div className="px-4 flex flex-col gap-4">
      <div className="flex border-b gap-4 py-4 items-center">
        <Button asChild size="icon" variant="outline">
          <Link href={`/profile/${handle}`}>
            <ArrowLeftIcon />
          </Link>
        </Button>
        <div className="flex gap-1">
          <div>@{profile.user.username}</div>
          <div>/</div>
          <div className="font-medium">Followers</div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {followers.map((user) => (
          <Link
            href={`/profile/${user.follower.username}`}
            key={user.follower.username}
            className="flex gap-4 items-center"
          >
            <Avatar>
              <AvatarImage src={user.follower.profile?.avatar_url ?? ""} />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <div>@{user.follower.username}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
