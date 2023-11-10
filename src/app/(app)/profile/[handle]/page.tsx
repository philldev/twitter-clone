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

export default async function Page({ params }: { params: { handle: string } }) {
  const { handle } = params;

  const profile = await getProfile(handle);

  if (!profile) throw new Error("User not found!");

  return (
    <div className="flex flex-col gap-4 py-6">
      <div className="px-4 flex gap-8">
        <Avatar className="w-[110px] h-[110px] shrink-0">
          <AvatarImage src={profile?.avatar_url!} />
          <AvatarFallback>
            {getUserInitials(profile?.user.username || "")}
          </AvatarFallback>
        </Avatar>
        <div className="flex justify-between flex-1 text-sm items-center">
          <div className="text-center">
            <div className="font-bold">Tweets</div>
            <div>0</div>
          </div>
          <div className="text-center">
            <div className="font-bold">Followers</div>
            <div>0</div>
          </div>
          <div className="text-center">
            <div className="font-bold">Following</div>
            <div>0</div>
          </div>
        </div>
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
      <div className="px-4">
        <EditProfile />
      </div>
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
