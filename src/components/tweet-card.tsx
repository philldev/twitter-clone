"use client";

import Link from "next/link";
import { useSession } from "@/app/(app)/session-provider";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNumber, getUserInitials } from "@/lib/utils";
import { getTweets, likeTweet } from "@/lib/tweets";
import {
  ChatBubbleIcon,
  DotFilledIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { formatRelative } from "date-fns";
import { TweetSettingButton } from "./tweet-setting-button";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

type ITweets = Awaited<ReturnType<typeof getTweets>>;
type ITweet = ITweets[number];

export function TweetCard({ tweet }: { tweet: ITweet }) {
  return (
    <div className="flex cursor-pointer gap-2 pt-4 pb-3">
      <Link href={`/profile/${tweet.user.username}`}>
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={tweet.user.profile?.avatar_url || ""} />
          <AvatarFallback>
            {getUserInitials(tweet.user.username)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between">
          <div className="flex text-xs items-center gap-1">
            <Link
              href={`/profile/${tweet.user.username}`}
              className="font-medium text-muted-foreground"
            >
              @{tweet.user.username}
            </Link>
            <DotFilledIcon className="text-muted-foreground" />
            <div className="text-muted-foreground text-[0.6rem]">
              {formatRelative(tweet.createdAt, new Date())}
            </div>
          </div>
          <TweetSettingButton ownerId={tweet.userId} tweetId={tweet.id} />
        </div>
        <Link
          href={`/tweet/${tweet.id}`}
          className="text-foreground/70 text-sm"
        >
          {tweet.content}
        </Link>
        <div className="flex gap-4">
          <LikeButton
            tweetId={tweet.id}
            liked={tweet.liked}
            count={tweet.likeCount}
          />
          <Link
            href={`/tweet/${tweet.id}`}
            className="flex gap-1 text-[0.8rem] text-muted-foreground items-center"
          >
            <ChatBubbleIcon />
            <span>{formatNumber(tweet._count.replies)}</span>
          </Link>
        </div>
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

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

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
      className="flex gap-1 text-[0.8rem] text-muted-foreground items-center"
    >
      {_liked ? <HeartFilledIcon /> : <HeartIcon className="" />}
      <span>{formatNumber(_count)}</span>
    </button>
  );
}
