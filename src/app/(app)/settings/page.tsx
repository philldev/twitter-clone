import { getCurrentUser } from "@/lib/session";
import { ChangePasswordForm } from "./change-password-form";
import { UserForm } from "./user-form";
import { getUser } from "@/lib/user";

export default async function Page() {
  const currentUser = await getCurrentUser();
  const user = await getUser(currentUser?.uid!);

  return (
    <div className="py-4 px-4 flex flex-col gap-4">
      <div className="font-medium">Account Settings</div>
      <UserForm
        defaultValues={{
          username: user?.username!,
        }}
      />
      <ChangePasswordForm />
    </div>
  );
}
