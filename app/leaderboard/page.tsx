"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";
import { ScoreRow } from "@/lib/types";
import { formatSeconds } from "@/lib/sudoku";

export default function LeaderboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [scores, setScores] = useState<ScoreRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      assertSupabaseEnv();
    } catch (err) {
      setError((err as Error).message);
      return;
    }

    const load = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      const user = sessionData.session?.user;
      if (!user) {
        router.replace("/login");
        return;
      }
      setEmail(user.email ?? "unknown");

      const { data, error: fetchError } = await supabase
        .from("scores")
        .select("id,user_email,difficulty,completion_seconds,points,created_at")
        .order("points", { ascending: false })
        .order("completion_seconds", { ascending: true })
        .limit(50);

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setScores((data as ScoreRow[]) ?? []);
    };

    load();
  }, [router]);

  if (!email) {
    return (
      <main className="container">
        <p>{error ?? "Loading..."}</p>
      </main>
    );
  }

  return (
    <main className="container">
      <NavBar email={email} />
      <section className="card">
        <h1>Leaderboard</h1>
        <p className="text-muted">Ranking by points, then faster completion time.</p>
        {error ? <p className="text-danger">{error}</p> : null}
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>#</th>
              <th>Player</th>
              <th>Difficulty</th>
              <th>Time</th>
              <th>Points</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {scores.map((score, index) => (
              <tr key={score.id}>
                <td>{index + 1}</td>
                <td>{score.user_email}</td>
                <td>{score.difficulty}</td>
                <td>{formatSeconds(score.completion_seconds)}</td>
                <td>{score.points}</td>
                <td>{new Date(score.created_at).toLocaleString()}</td>
              </tr>
            ))}
            {!scores.length ? (
              <tr>
                <td colSpan={6} className="text-muted">
                  No completed games yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </section>
    </main>
  );
}
