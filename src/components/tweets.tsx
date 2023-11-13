"use client";

import { getTweets, likeTweet } from "@/lib/tweets";
import React, { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNumber, getUserInitials } from "@/lib/utils";
import { formatRelative } from "date-fns";
import Link from "next/link";
import {
  ChatBubbleIcon,
  DotFilledIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { useSession } from "@/app/(app)/session-provider";
import { TweetSettingButton } from "./tweet-setting-button";

type ITweets = Awaited<ReturnType<typeof getTweets>>;
type ITweet = ITweets[number];

function Tweets({ userId }: { userId?: string }) {
  const { toast } = useToast();
  const [tweets, setTweets] = useState<ITweets>([]);
  const [loading, setLoading] = useState(true);
  const [cursorId, setCursorId] = useState<string>();
  const [enableFetchMore, setEnableFetchMore] = useState(false);

  const fetchTweets = async (
    userId?: string,
    cursorId?: string,
    loadMore?: boolean,
  ) => {
    setLoading(true);
    try {
      const data = await getTweets({
        userId,
        cursorId,
      });

      if (data.length) {
        setEnableFetchMore(true);
        setCursorId(data.at(-1)?.id);
        if (loadMore) {
          setTweets((prev) => [...prev, ...data]);
        } else {
          setTweets(data);
        }
      } else {
        if (loadMore)
          toast({
            title: "Opps",
            description: "No more tweets to load :(",
          });
        setEnableFetchMore(false);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Error loading tweets!",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchMore = () => {
    fetchTweets(userId, cursorId, true);
  };

  useEffect(() => {
    fetchTweets(userId);
  }, [userId]);

  useEffect(() => {
    const cb = () => {
      fetchTweets(userId);
    };
    if (typeof window !== undefined) {
      window.addEventListener("fetch-tweets", cb);
    }
    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener("fetch-tweets", cb);
      }
    };
  }, [userId]);

  useEffect(() => {
    const cb = (e: Event) => {
      if (e instanceof CustomEvent) {
        if (e.detail.id) {
          setTweets((p) => p.filter((i) => i.id !== e.detail.id));
        }
      }
    };

    if (typeof window !== undefined) {
      window.addEventListener("delete-tweet", cb);
    }

    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener("delete-tweet", cb);
      }
    };
  }, []);

  return (
    <div className="px-4 py-4">
      {loading && (
        <div className="flext text-muted-foreground">Loading tweets...</div>
      )}
      {tweets.length === 0 && !loading && (
        <div className="flext text-muted-foreground">No tweets yet!</div>
      )}
      <div>
        {tweets.map((t) => (
          <TweetCard key={t.id} tweet={t} />
        ))}
      </div>
      {tweets.length > 8 && (
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full"
            onClick={fetchMore}
            disabled={loading || !enableFetchMore}
          >
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

function TweetCard({ tweet }: { tweet: ITweet }) {
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

export { Tweets };
