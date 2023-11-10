"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { followUser } from "@/lib/user";
import { useToast } from "@/components/ui/use-toast";

function FollowButton({
  isFollowing,
  userId,
}: {
  userId: string;
  isFollowing: boolean;
}) {
  const [_isFollowing, setIsFollowing] = useState(isFollowing);
  const { toast } = useToast();

  const handleFollow = async () => {
    setIsFollowing((p) => !p);
    try {
      await followUser(userId);
    } catch (error) {
      let msg = "";
      if (error instanceof Error) {
        msg = error.message;
      } else {
        msg = "Something went wrong!";
      }
      toast({
        title: "Error",
        description: msg,
      });
    }
  };

  return (
    <Button
      variant={_isFollowing ? "outline" : "default"}
      onClick={handleFollow}
    >
      {_isFollowing ? "Following" : "Follow"}
    </Button>
  );
}

export { FollowButton };
