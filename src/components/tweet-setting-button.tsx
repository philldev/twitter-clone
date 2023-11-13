"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon, DropdownMenuIcon } from "@radix-ui/react-icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteTweet } from "@/lib/tweets";
import { useToast } from "./ui/use-toast";
import { useSession } from "@/app/(app)/session-provider";
import { useState } from "react";

export function TweetSettingButton({
  tweetId,
  ownerId,
}: {
  tweetId: string;
  ownerId: string;
}) {
  const { user } = useSession();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <DotsHorizontalIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {user.uid === ownerId && <DeleteTweet tweetId={tweetId} />}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function DeleteTweet({ tweetId }: { tweetId: string }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    try {
      setLoading(true);

      await deleteTweet({
        tweetId,
      });
      setLoading(false);

      window.dispatchEvent(
        new CustomEvent("delete-tweet", {
          detail: {
            id: tweetId,
          },
        }),
      );
    } catch (error) {
      console.log(error);

      toast({
        title: "Error",
        description: "Something went wrong!",
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setOpen(true);
          }}
          className="text-destructive"
        >
          Delete Tweet
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Tweet?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={handleClick}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
