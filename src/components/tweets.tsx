"use client";

import { getTweets } from "@/lib/tweets";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserInitials } from "@/lib/utils";
import { formatRelative } from "date-fns";
import Link from "next/link";

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
      window.addEventListener("create-tweet", cb);
    }
    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener("create-tweet", cb);
      }
    };
  }, [userId]);

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
    <div className="flex gap-2 pt-4 pb-3">
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
      </div>
    </div>
  );
}

export { Tweets };
