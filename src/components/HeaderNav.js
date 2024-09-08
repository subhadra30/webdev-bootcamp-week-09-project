import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import { NoUser } from "./NoUser";

export default function HeaderNav() {
  return (
    <div>
      <header className="header">
        <div className="heading">
          <h3>MeetHub</h3>
          <h4>Click..Connect..Converse..</h4>
        </div>
        <nav className="nav-bar">
          <Link href="/">Home</Link>
          <SignedOut>
            <SignInButton />
            {/* <SignInPage />
            // <SignUpPage /> */}
          </SignedOut>
          <SignedIn>
            <Link href="/posts">Posts</Link>
            <UserButton />
          </SignedIn>
        </nav>
      </header>
    </div>
  );
}
