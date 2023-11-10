import { NewTweetForm } from "@/components/tweet-form";
import { Tweets } from "@/components/tweets";

export default function Page() {
  return (
    <div className="">
      <NewTweetForm />
      <Tweets />
    </div>
  );
}
