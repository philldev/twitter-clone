"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { getTweet, likeTweet } from "@/lib/tweets";
import { formatNumber, getUserInitials } from "@/lib/utils";
import {
  ChatBubbleIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { formatRelative } from "date-fns";
import { useSession } from "@/app/(app)/session-provider";
import { useState } from "react";

type ITweet = Awaited<ReturnType<typeof getTweet>>;

function TweetCard({ tweet }: { tweet: ITweet }) {
  const isReply = !!tweet.replyParent;

  console.log(tweet);

  return (
    <div className="py-4">
      {isReply && tweet.replyParent && (
        <div className="flex items-stretch gap-4 px-4 mb-2">
          <div className="flex flex-col items-center">
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={tweet.replyParent?.user?.profile?.avatar_url || ""}
              />
              <AvatarFallback>
                {getUserInitials(tweet.replyParent?.user.username!)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 w-[2px] mt-2 bg-border"></div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-4">
              <div className="font-medium text-muted-foreground">
                @{tweet.replyParent?.user.username}
              </div>
              <div className="text-muted-foreground text-[0.6rem]">
                {formatRelative(tweet.replyParent?.createdAt!, new Date())}
              </div>
            </div>
            <div className="text-foreground/70 text-lg">
              {tweet.replyParent?.content}
            </div>

            <div className="flex gap-4 ">
              <LikeButton
                tweetId={tweet.replyParent?.id!}
                liked={tweet.replyParent?.liked}
                count={tweet.likeCount}
              />
              <button className="flex gap-1 text-muted-foreground items-center">
                <ChatBubbleIcon className="w-5 h-5" />
                <span>{formatNumber(tweet._count.replies)}</span>
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex flex-col gap-1 px-4">
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 shrink-0">
            <AvatarImage src={tweet.user.profile?.avatar_url || ""} />
            <AvatarFallback>
              {getUserInitials(tweet.user.username)}
            </AvatarFallback>
          </Avatar>
          <div className="font-medium text-muted-foreground">
            @{tweet.user.username}
          </div>
        </div>
        <div className="text-foreground/70 text-lg">{tweet.content}</div>
        <div className="text-muted-foreground text-[0.6rem]">
          {formatRelative(tweet.createdAt, new Date())}
        </div>
        <div className="flex gap-4">
          <LikeButton
            tweetId={tweet.id}
            liked={tweet.liked}
            count={tweet.likeCount}
          />
          <button className="flex gap-1 text-muted-foreground items-center">
            <ChatBubbleIcon className="w-5 h-5" />
            <span>{formatNumber(tweet._count.replies)}</span>
          </button>
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
        <HeartFilledIcon className="w-5 h-5" />
      ) : (
        <HeartIcon className="w-5 h-5" />
      )}
      <span>{formatNumber(_count)}</span>
    </button>
  );
}

export { TweetCard };
