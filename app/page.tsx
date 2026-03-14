"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";
import { Difficulty, SudokuGameState } from "@/lib/types";

const GAME_STORAGE_KEY = "sudoky-active-game";

const labels: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard"
};

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [savedGame, setSavedGame] = useState<SudokuGameState | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      assertSupabaseEnv();
    } catch (err) {
      setError((err as Error).message);
      return;
    }

    supabase.auth.getSession().then(({ data }) => {
      const user = data.session?.user;
      if (!user) {
        router.replace("/login");
        return;
      }
      setEmail(user.email ?? "unknown");
    });

    const raw = localStorage.getItem(GAME_STORAGE_KEY);
    if (raw) {
      try {
        setSavedGame(JSON.parse(raw));
      } catch {
        localStorage.removeItem(GAME_STORAGE_KEY);
      }
    }
  }, [router]);

  if (error) {
    return (
      <main className="container">
        <p className="text-danger">{error}</p>
      </main>
    );
  }

  if (!email) {
    return (
      <main className="container">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="container">
      <NavBar email={email} />
      <section className="card">
        <h1>Sudoku</h1>
        <p className="text-muted">Choose a 9x9 difficulty level.</p>
        <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
          {(Object.keys(labels) as Difficulty[]).map((difficulty) => (
            <button key={difficulty} className="primary" onClick={() => router.push(`/game?difficulty=${difficulty}&new=1`)}>
              New {labels[difficulty]}
            </button>
          ))}
        </div>
      </section>

      {savedGame ? (
        <section className="card" style={{ marginTop: "1rem" }}>
          <h2>Saved game</h2>
          <p className="text-muted">
            Difficulty: {labels[savedGame.difficulty]} | Elapsed: {savedGame.elapsedSeconds}s | Paused: {savedGame.paused ? "yes" : "no"}
          </p>
          <button onClick={() => router.push(`/game?difficulty=${savedGame.difficulty}`)}>Resume game</button>
          <button
            style={{ marginLeft: "0.5rem" }}
            onClick={() => {
              localStorage.removeItem(GAME_STORAGE_KEY);
              setSavedGame(null);
            }}
          >
            Discard
          </button>
        </section>
      ) : null}
    </main>
  );
}
