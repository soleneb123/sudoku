"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LegacyGameRedirectInner() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const qs = params.toString();
    router.replace(qs ? `/?${qs}` : "/");
  }, [params, router]);

  return (
    <main className="container">
      <p>Redirecting...</p>
    </main>
  );
}

export default function LegacyGameRedirectPage() {
  return (
    <Suspense fallback={<main className="container"><p>Redirecting...</p></main>}>
      <LegacyGameRedirectInner />
    </Suspense>
  );
}
