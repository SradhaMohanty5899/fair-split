"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, PartyPopper } from "lucide-react";
import Card from "@/components/Card";
import BigButton from "@/components/BigButton";
import { createGroup } from "@/lib/api";

export default function HomePage() {
  const router = useRouter();
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState(["", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const updateMember = (index, value) => {
    const next = [...members];
    next[index] = value;
    setMembers(next);
  };

  const addMemberField = () => setMembers([...members, ""]);
  const removeMemberField = (index) => {
    if (members.length <= 2) return;
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanedMembers = members.map((m) => m.trim()).filter(Boolean);
    if (!groupName.trim()) {
      setError("Give your trip a name! 🏖️");
      return;
    }
    if (cleanedMembers.length < 2) {
      setError("Add at least 2 people to split with.");
      return;
    }

    setLoading(true);
    try {
      const group = await createGroup(groupName.trim(), cleanedMembers);
      router.push(`/group/${group.id}`);
    } catch (err) {
      setError(err.message || "Something went wrong. Is the backend running?");
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="text-center mb-8">
          <div className="text-6xl mb-2 animate-float">🤑</div>
          <h1 className="font-display text-4xl md:text-5xl font-extrabold text-ink">
            Fair Split
          </h1>
          <p className="font-body text-ink/70 mt-2 text-lg">
            Split the bill. Skip the awkward math.
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="font-display font-bold text-lg block mb-2">
                What's the trip called?
              </label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Goa Trip 🏝️"
                className="w-full px-4 py-3 rounded-xl border-2 border-ink font-body text-lg
                  focus:outline-none focus:ring-4 focus:ring-sunny/50 bg-cream"
              />
            </div>

            <div>
              <label className="font-display font-bold text-lg block mb-2">
                Who's splitting the bill?
              </label>
              <div className="space-y-2">
                {members.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <input
                      type="text"
                      value={m}
                      onChange={(e) => updateMember(i, e.target.value)}
                      placeholder={`Friend ${i + 1}`}
                      className="flex-1 px-4 py-2.5 rounded-xl border-2 border-ink font-body
                        focus:outline-none focus:ring-4 focus:ring-sky/40 bg-cream"
                    />
                    {members.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeMemberField(i)}
                        className="p-2.5 rounded-xl border-2 border-ink bg-white hover:bg-coral/20 transition-colors"
                        aria-label="Remove member"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addMemberField}
                className="mt-3 flex items-center gap-1.5 font-display font-bold text-sm text-grape hover:text-grape/70 transition-colors"
              >
                <Plus size={18} /> Add another person
              </button>
            </div>

            {error && (
              <p className="text-coral font-bold text-sm bg-coral/10 rounded-xl px-3 py-2 border-2 border-coral/30">
                {error}
              </p>
            )}

            <BigButton type="submit" color="mint" size="lg" className="w-full" disabled={loading}>
              <span className="flex items-center justify-center gap-2">
                {loading ? "Creating..." : "Start Splitting"}
                <PartyPopper size={22} />
              </span>
            </BigButton>
          </form>
        </Card>
      </div>
    </main>
  );
}
