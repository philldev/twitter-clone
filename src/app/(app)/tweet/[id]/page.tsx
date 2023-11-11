import { getTweet } from "@/lib/tweets";
import { TweetCard } from "./tweet-card";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default async function Page({ params }: { params: { id: string } }) {
  const tweet = await getTweet(params.id);

  return (
    <div className="py-4">
      <div className="px-4 items-center flex gap-4">
        <Link href="/">
          <ArrowLeftIcon className="w-6 h-6" />
        </Link>
        <div className="text-xl font-medium">Tweet</div>
      </div>
      <TweetCard tweet={tweet} />
      <div className="px-4">
        <Separator />
      </div>
    </div>
  );
}
