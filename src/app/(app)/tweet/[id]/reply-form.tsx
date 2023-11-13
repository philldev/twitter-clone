"use client";

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
import { createReply } from "@/lib/tweets";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/lib/utils";

const formSchema = z.object({
  content: z
    .string()
    .min(1, "Tweet must be at least 1 characters.")
    .max(255, "Tweet cannot be longer than 255 characters."),
});

function ReplyForm({
  defaultValues,
  avatarUrl,
  username,
  tweetId,
}: {
  defaultValues?: z.infer<typeof formSchema>;
  avatarUrl: string;
  username: string;
  tweetId: string;
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
      await createReply({
        tweetId: tweetId,
        content: values.content,
      });

      router.refresh();

      window.dispatchEvent(new CustomEvent("create-tweet"));

      toast({
        title: "Success",
        description: "Tweet created!",
      });

      form.reset();
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
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 border-b pb-4"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex gap-4 py-4">
              <Avatar className="w-8 h-8 shrink-0">
                <AvatarImage src={avatarUrl || ""} />
                <AvatarFallback>{getUserInitials(username)}</AvatarFallback>
              </Avatar>
              <FormControl>
                <Textarea
                  className="resize-none flex p-0 h-12 shadow-none focus:outline-none focus-visible:ring-0 rounded-none border-none"
                  placeholder="Post a reply."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end px-4">
          <Button disabled={form.formState.isSubmitting} type="submit">
            {form.formState.isSubmitting ? "Tweetinggg..." : "Reply"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export { ReplyForm };
