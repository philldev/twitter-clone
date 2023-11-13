import { NewTweetForm } from "@/components/tweet-form";
import { Tweets } from "@/components/tweets";
import { getProfile } from "@/lib/profile";
import { getCurrentUser } from "@/lib/session";

export default async function Page() {
  const currentUser = await getCurrentUser();

  if (!currentUser) throw new Error("Not logged in");

  const profile = await getProfile(currentUser.username);

  if (!profile) throw new Error("Profile not found");

  return (
    <div className="">
      <NewTweetForm avatarUrl={profile.avatar_url!} />
      <Tweets />
    </div>
  );
}
