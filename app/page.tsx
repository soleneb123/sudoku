"use client";

import { Suspense } from "react";
import SudokuGame from "@/components/SudokuGame";

export default function HomePage() {
  return (
    <Suspense fallback={<main className="container"><p>Loading...</p></main>}>
      <SudokuGame basePath="/" />
    </Suspense>
  );
}
