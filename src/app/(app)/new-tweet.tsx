"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { createTweet } from "@/lib/tweets";
import { useState } from "react";

function NewTweet() {
  const [open, setOpen] = useState(false);
  return (
    <div className="fixed p-4 bg-background bottom-0 border-t inset-x-0 w-full">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button className="w-full">New Tweet</Button>
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetHeader>
            <SheetTitle>New Tweet</SheetTitle>
          </SheetHeader>
          <NewTweetForm
            onSuccess={() => {
              setOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>
    </div>
  );
}

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Tweet must be at least 1 characters.")
    .max(255, "Tweet cannot be longer than 255 characters."),
});

function NewTweetForm({
  defaultValues,
  onSuccess,
}: {
  defaultValues?: z.infer<typeof formSchema>;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues ?? {
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await createTweet(values.content);

      router.refresh();
      onSuccess();

      window.dispatchEvent(new CustomEvent("create-tweet"));

      toast({
        title: "Success",
        description: "Tweet created!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong!",
      });
    }
    return;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  className="resize-none flex h-36"
                  placeholder="Whats on your mind...??"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Tweetinggg..." : "Tweet"}
        </Button>
      </form>
    </Form>
  );
}

export { NewTweet };
