"use client";

import { getTweets } from "@/lib/tweets";
import React, { useEffect, useState } from "react";
import { useToast } from "./ui/use-toast";
import { Button } from "@/components/ui/button";
import { TweetCard } from "./tweet-card";

type ITweets = Awaited<ReturnType<typeof getTweets>>;

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

export { Tweets };
