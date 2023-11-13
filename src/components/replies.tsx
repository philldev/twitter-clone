"use client";

import { getReplies } from "@/lib/tweets";
import { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "@/components/ui/button";
import { TweetCard } from "./tweet-card";

type IReplies = Awaited<ReturnType<typeof getReplies>>;

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
      window.addEventListener("fetch-tweet", cb);
    }
    return () => {
      if (typeof window !== undefined) {
        window.removeEventListener("fetch-tweet", cb);
      }
    };
  }, [tweetId]);

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
    <div className="py-4">
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

export { Replies };
