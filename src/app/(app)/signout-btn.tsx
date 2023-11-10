"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignoutButton() {
  return (
    <Button
      onClick={() => {
        signOut();
      }}
      variant="ghost"
      className="justify-start"
    >
      Sign out
    </Button>
  );
}
