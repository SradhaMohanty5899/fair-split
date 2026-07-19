"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowRight, PartyPopper, RotateCcw, TrendingUp, TrendingDown } from "lucide-react";
import Card from "@/components/Card";
import BigButton from "@/components/BigButton";
import { settleGroup } from "@/lib/api";

export default function SettlePage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id;

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const data = await settleGroup(groupId);
        if (cancelled) return;
        setResult(data);
        setLoading(false);

        if (data.transactions?.length > 0) {
          const confetti = (await import("canvas-confetti")).default;
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ["#FF6B6B", "#FFD166", "#06D6A0", "#4CC9F0", "#7B61FF"],
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Couldn't settle this group.");
          setLoading(false);
        }
      }
    }
    run();
    return () => { cancelled = true; };
  }, [groupId]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-display text-2xl animate-pulse">Crunching the numbers... 🧮</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="text-center max-w-md">
          <p className="font-display text-xl mb-2">😕 Something went wrong</p>
          <p className="text-ink/60 mb-4">{error}</p>
          <BigButton onClick={() => router.push("/")} color="sunny">Start over</BigButton>
        </Card>
      </main>
    );
  }

  const { balances, transactions, transactionCount } = result;

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2 animate-pop">🎉</div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold">All settled up!</h1>
          <p className="font-body text-ink/70 mt-2 text-lg">
            Just <strong>{transactionCount}</strong> {transactionCount === 1 ? "payment" : "payments"} needed
          </p>
        </div>

        {transactions.length === 0 ? (
          <Card className="text-center">
            <p className="font-display text-xl">Everyone's already even. 🙌</p>
          </Card>
        ) : (
          <div className="space-y-3 mb-8">
            {transactions.map((t, i) => (
              <Card key={i} className="animate-pop" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 font-display font-bold text-lg">
                    <span className="bg-coral/20 rounded-full px-3 py-1">{t.from}</span>
                    <ArrowRight className="text-ink/40" size={20} />
                    <span className="bg-mint/30 rounded-full px-3 py-1">{t.to}</span>
                  </div>
                  <span className="font-display font-extrabold text-xl text-grape">
                    ₹{t.amount}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Card className="mb-8">
          <h2 className="font-display font-bold text-lg mb-3">Final balances</h2>
          <ul className="space-y-2">
            {Object.entries(balances).map(([name, amt]) => (
              <li key={name} className="flex items-center justify-between font-body">
                <span className="font-semibold">{name}</span>
                <span
                  className={`flex items-center gap-1 font-bold ${
                    amt > 0 ? "text-mint" : amt < 0 ? "text-coral" : "text-ink/50"
                  }`}
                >
                  {amt > 0 && <TrendingUp size={16} />}
                  {amt < 0 && <TrendingDown size={16} />}
                  {amt === 0 ? "settled" : `₹${Math.abs(amt).toFixed(2)} ${amt > 0 ? "back" : "owed"}`}
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="text-center flex flex-col items-center gap-3">
          <BigButton color="sky" onClick={() => router.push(`/group/${groupId}`)}>
            ← Back to expenses
          </BigButton>
          <BigButton color="grape" onClick={() => router.push("/")}>
            <span className="flex items-center gap-2">
              <RotateCcw size={18} /> Start a new trip
            </span>
          </BigButton>
        </div>
      </div>
    </main>
  );
}
