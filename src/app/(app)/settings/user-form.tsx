"use client";

import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { updateUsername } from "@/lib/user";

const formSchema = z.object({
  username: z.string().min(1, "Username must be at least 1 characters."),
});

export function UserForm({
  defaultValues,
}: {
  defaultValues?: z.infer<typeof formSchema>;
}) {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await updateUsername({
        ...values,
      });

      router.refresh();

      toast({
        title: "Success",
        description: "Username updated!",
      });
    } catch (error) {
      console.log(error);
      let msg = "Something went wrong!";
      if (error instanceof Error) {
        msg = error.message;
      }
      toast({
        title: "Error",
        description: msg,
      });
    }
    return;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={form.formState.isSubmitting} type="submit">
          {form.formState.isSubmitting ? "Updating..." : "Update username"}
        </Button>
      </form>
    </Form>
  );
}
