"use client";

import { getReplies, likeTweet } from "@/lib/tweets";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatNumber, getUserInitials } from "@/lib/utils";
import { formatRelative } from "date-fns";
import Link from "next/link";
import {
  ChatBubbleIcon,
  HeartFilledIcon,
  HeartIcon,
} from "@radix-ui/react-icons";
import { useSession } from "@/app/(app)/session-provider";
import { useRouter } from "next/navigation";

type IReplies = Awaited<ReturnType<typeof getReplies>>;
type IReply = IReplies[number];

function Replies({ tweetId }: { tweetId: string }) {
  const { toast } = useToast();
  const [tweets, setTweets] = useState<IReplies>([]);
  const [loading, setLoading] = useState(true);
  const [cursorId, setCursorId] = useState<string>();
  const [enableFetchMore, setEnableFetchMore] = useState(false);

  const fetchTweets = async (
    tweetId: string,
    cursorId?: string,
    loadMore?: boolean,
  ) => {
    setLoading(true);
    try {
      const data = await getReplies({
        tweetId: tweetId,
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
    fetchTweets(tweetId, cursorId, true);
  };

  useEffect(() => {
    fetchTweets(tweetId);
  }, [tweetId]);

  useEffect(() => {
    const cb = () => {
      fetchTweets(tweetId);
    };
    if (typeof window !== undefined) {
      window.addEventListener("create-tweet", cb);
    }
    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener("create-tweet", cb);
      }
    };
  }, [tweetId]);

  return (
    <div className="py-4">
      {loading && (
        <div className="flext text-muted-foreground">Loading tweets...</div>
      )}
      {tweets.length === 0 && !loading && (
        <div className="flext text-muted-foreground">No tweets yet!</div>
      )}
      <div>
        {tweets.map((t) => (
          <ReplyCard key={t.id} tweet={t} />
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

function ReplyCard({ tweet }: { tweet: IReply }) {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push(`/tweet/${tweet.id}`);
      }}
      className="flex cursor-pointer gap-2 pt-4 pb-3"
    >
      <Link href={`/profile/${tweet.user.username}`}>
        <Avatar className="w-8 h-8 shrink-0">
          <AvatarImage src={tweet.user.profile?.avatar_url || ""} />
          <AvatarFallback>
            {getUserInitials(tweet.user.username)}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex text-xs items-center justify-between gap-4">
          <Link
            href={`/profile/${tweet.user.username}`}
            className="font-medium text-muted-foreground"
          >
            @{tweet.user.username}
          </Link>
          <div className="text-muted-foreground text-[0.6rem]">
            {formatRelative(tweet.createdAt, new Date())}
          </div>
        </div>
        <div className="text-foreground/70 text-sm">{tweet.content}</div>
        <div className="flex gap-4">
          <LikeButton
            tweetId={tweet.id}
            liked={tweet.liked}
            count={tweet.likeCount}
          />

          <button className="flex gap-1 text-[0.8rem] text-muted-foreground items-center">
            <ChatBubbleIcon />
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
      className="flex gap-1 text-[0.8rem] text-muted-foreground items-center"
    >
      {_liked ? <HeartFilledIcon /> : <HeartIcon className="" />}
      <span>{formatNumber(_count)}</span>
    </button>
  );
}

export { Replies };
