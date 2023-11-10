import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile, getUserProfile } from "@/lib/profile";
import { cn, getUserInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProfileForm } from "./profile-form";
import { Tweets } from "@/components/tweets";
import { getCurrentUser } from "@/lib/session";
import { FollowButton } from "./follow-button";
import {
  getFollowerCount,
  getFollowingCount,
  getIsFollowing,
} from "@/lib/user";
import Link from "next/link";

export default async function Page({ params }: { params: { handle: string } }) {
  const { handle } = params;

  const profile = await getProfile(handle);
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Not logged in!");
  if (!profile) throw new Error("User not found!");

  const isFollowing = await getIsFollowing(profile.userId);
  const followerCount = await getFollowerCount(profile.userId);
  const followingCount = await getFollowingCount(profile.userId);

  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="px-4 flex flex-col items-center gap-8">
        <Avatar className="w-[110px] h-[110px] shrink-0">
          <AvatarImage src={profile?.avatar_url!} />
          <AvatarFallback>
            {getUserInitials(profile?.user.username || "")}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="px-4 flex justify-center">
        {currentUser.uid !== profile.userId && (
          <FollowButton isFollowing={isFollowing} userId={profile.userId} />
        )}
      </div>
      <div className="px-4 flex flex-col gap-2">
        <div>
          <div className="font-bold">@{profile?.user.username}</div>
        </div>
        <div
          className={cn(!profile?.bio && "text-muted-foreground", "text-sm")}
        >
          {profile?.bio ?? "Bio empty"}
        </div>
      </div>
      <div className="px-4 text-sm flex gap-4">
        <Link
          href={`/profile/${handle}/followers`}
          className="flex hover:underline gap-1"
        >
          <div className="font-bold">{followerCount}</div>
          <div className="text-muted-foreground">Followers</div>
        </Link>
        <Link
          href={`/profile/${handle}/following`}
          className="flex hover:underline gap-1"
        >
          <div className="font-bold">{followingCount}</div>
          <div className="text-muted-foreground">Following</div>
        </Link>
      </div>
      {currentUser.uid === profile.userId && (
        <div className="px-4">
          <EditProfile />
        </div>
      )}
      <Tweets userId={profile.userId} />
    </div>
  );
}

async function EditProfile() {
  const profile = await getUserProfile();

  if (!profile) throw new Error("User not found!");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here.
          </DialogDescription>
        </DialogHeader>
        <ProfileForm
          userId={profile.userId}
          defaultValues={{
            bio: profile.bio ?? "",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
