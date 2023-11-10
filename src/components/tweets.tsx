"use client";

import { getTweets } from "@/lib/tweets";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { getUserInitials } from "@/lib/utils";
import { formatRelative } from "date-fns";

type ITweets = Awaited<ReturnType<typeof getTweets>>;
type ITweet = ITweets[number];

function Tweets({ userId }: { userId?: string }) {
  console.log({ userId });
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

      console.log({ data });

      if (data.length) {
        setEnableFetchMore(true);
        setCursorId(data.at(-1)?.id);
        if (loadMore) {
          setTweets((prev) => [...prev, ...data]);
        } else {
          setTweets(data);
        }
      } else {
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
    fetchTweets(userId, cursorId);
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
    <div className="p-4">
      <div>
        {tweets.map((t) => (
          <TweetCard key={t.id} tweet={t} />
        ))}
      </div>
      {tweets.length > 9 && (
        <div className="pt-4">
          <Button onClick={fetchMore} disabled={loading || !enableFetchMore}>
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}

function TweetCard({ tweet }: { tweet: ITweet }) {
  return (
    <div className="flex gap-2 py-3">
      <Avatar className="shrink-0">
        <AvatarImage src={tweet.user.profile?.avatar_url || ""} />
        <AvatarFallback>{getUserInitials(tweet.user.username)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex text-xs items-center justify-between gap-4">
          <div className="font-bold">@{tweet.user.username}</div>
          <div className="text-muted-foreground">
            {formatRelative(tweet.createdAt, new Date())}
          </div>
        </div>
        <div className="text-foreground/70 text-sm">{tweet.content}</div>
      </div>
    </div>
  );
}

export { Tweets };
