import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";
import { Header } from "./header";
import { SessionProvider } from "./session-provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) redirect("/login");

  return (
    <SessionProvider user={user}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="max-w-2xl w-full mx-auto border-x flex-1">
          {children}
        </main>
      </div>
    </SessionProvider>
  );
}
