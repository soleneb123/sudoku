"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      assertSupabaseEnv();
    } catch (err) {
      setError((err as Error).message);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.replace("/");
      }
    });
  }, [router]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      assertSupabaseEnv();
      if (mode === "login") {
        const { error: loginError } = await supabase.auth.signInWithPassword({ email, password });
        if (loginError) throw loginError;
      } else {
        const { error: signupError } = await supabase.auth.signUp({ email, password });
        if (signupError) throw signupError;
      }
      router.replace("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container" style={{ maxWidth: 420, paddingTop: "8vh" }}>
      <section className="card">
        <h1>Sudoky</h1>
        <p className="text-muted">Email and password are required.</p>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.8rem" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ padding: "0.7rem", borderRadius: 10, border: "1px solid #d1d5db" }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ padding: "0.7rem", borderRadius: 10, border: "1px solid #d1d5db" }}
          />
          <button className="primary" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <button style={{ marginTop: "0.8rem" }} onClick={() => setMode(mode === "login" ? "signup" : "login")}>
          Switch to {mode === "login" ? "Sign up" : "Log in"}
        </button>

        {error ? <p className="text-danger">{error}</p> : null}
      </section>
    </main>
  );
}
