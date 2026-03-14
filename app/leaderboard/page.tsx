"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import { assertSupabaseEnv, supabase } from "@/lib/supabase";
import { ScoreRow } from "@/lib/types";
import { getOrCreateUsername } from "@/lib/profile";
import { formatSeconds } from "@/lib/sudoku";

export default function LeaderboardPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState<string | null>(null);
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
      try {
        const { data: sessionData } = await supabase.auth.getSession();
        const user = sessionData.session?.user;
        if (!user) {
          router.replace("/login");
          return;
        }
        const username = await getOrCreateUsername(user);
        setDisplayName(username);

        const { data, error: fetchError } = await supabase
          .from("scores")
          .select("id,username,difficulty,completion_seconds,points,created_at")
          .order("points", { ascending: false })
          .order("completion_seconds", { ascending: true })
          .limit(50);

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        setScores((data as ScoreRow[]) ?? []);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    load();
  }, [router]);

  if (!displayName) {
    return (
      <main className="container">
        <p>{error ?? "Loading..."}</p>
      </main>
    );
  }

  return (
    <main className="container">
      <NavBar displayName={displayName} />
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
                <td>{score.username}</td>
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
