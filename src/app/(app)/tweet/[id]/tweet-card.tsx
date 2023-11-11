"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { getTweet, likeTweet } from "@/lib/tweets";
import { formatNumber, getUserInitials } from "@/lib/utils";
import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { formatRelative } from "date-fns";
import { useSession } from "@/app/(app)/session-provider";
import Link from "next/link";
import { useState } from "react";

type ITweet = Awaited<ReturnType<typeof getTweet>>;

function TweetCard({ tweet }: { tweet: ITweet }) {
  return (
    <div className="flex flex-col py-4 gap-3 px-4">
      <Link
        href={`/profile/${tweet.user.username}`}
        className="flex items-center gap-2"
      >
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={tweet.user.profile?.avatar_url || ""} />
          <AvatarFallback>
            {getUserInitials(tweet.user.username)}
          </AvatarFallback>
        </Avatar>
        <div className="font-medium text-muted-foreground">
          @{tweet.user.username}
        </div>
      </Link>
      <div className="text-foreground/70 text-lg">{tweet.content}</div>
      <div className="text-muted-foreground text-[0.6rem]">
        {formatRelative(tweet.createdAt, new Date())}
      </div>
      <div>
        <LikeButton
          tweetId={tweet.id}
          liked={tweet.liked}
          count={tweet.likeCount}
        />
      </div>
    </div>
  );
}

function LikeButton({
  liked,
  tweetId,
  count,
}: {
  liked?: boolean;
  tweetId: string;
  count: number;
}) {
  const [_liked, setLiked] = useState(liked);
  const [_count, setCount] = useState(count);
  const { user } = useSession();
  const { toast } = useToast();

  const handleClick = async () => {
    setLiked((p) => !p);
    if (count < 999) {
      if (_liked && _count > 0) {
        setCount((p) => p - 1);
      } else if (!_liked) {
        setCount((p) => p + 1);
      }
    }

    try {
      await likeTweet({
        userId: user.uid,
        tweetId,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong!",
      });

      setLiked((p) => !p);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex gap-2 text-muted-foreground items-center"
    >
      {_liked ? (
        <HeartFilledIcon className="w-4 h-4" />
      ) : (
        <HeartIcon className="" />
      )}
      <span>{formatNumber(_count)}</span>
    </button>
  );
}

export { TweetCard };
