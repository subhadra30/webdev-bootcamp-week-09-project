import { SignInButton } from "@clerk/nextjs";
import SignInPage from "@/app/sign-in/[[...sign-in]]/page";
import SignUpPage from "@/app/sign-up/[[...sign-up]]/page";
export function NoUser() {
  return (
    <div>
      <p>Please Sign in</p>
      <SignInButton />
    </div>
  );
}
