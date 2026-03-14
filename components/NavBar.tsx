"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Props = {
  email: string;
};

export default function NavBar({ email }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  return (
    <header className="nav">
      <div className="nav-left">
        <Link href="/">Home</Link>
        <Link href="/leaderboard">Leaderboard</Link>
      </div>
      <div className="nav-right">
        <span>{email}</span>
        <button onClick={handleLogout}>Log out</button>
      </div>
    </header>
  );
}
