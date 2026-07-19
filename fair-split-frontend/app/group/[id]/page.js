"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { Receipt, Users, Sparkles, IndianRupee, Pencil, Trash2, X } from "lucide-react";
import Card from "@/components/Card";
import BigButton from "@/components/BigButton";
import { getGroup, addExpense, updateExpense, deleteExpense } from "@/lib/api";

const AVATAR_EMOJIS = ["🦊", "🐼", "🐸", "🦁", "🐨", "🐷", "🦄", "🐵", "🐶", "🐱"];

export default function GroupPage() {
  const router = useRouter();
  const params = useParams();
  const groupId = params.id;

  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [splitAmong, setSplitAmong] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [editingExpenseId, setEditingExpenseId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadGroup = useCallback(async () => {
    try {
      const data = await getGroup(groupId);
      setGroup(data);
      if (!paidBy && data.members.length > 0) setPaidBy(data.members[0].id);
      if (splitAmong.length === 0) setSplitAmong(data.members.map((m) => m.id));
    } catch (err) {
      setError(err.message || "Couldn't load this group.");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupId]);

  useEffect(() => {
    loadGroup();
  }, [loadGroup]);

  const toggleSplitMember = (id) => {
    setSplitAmong((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setEditingExpenseId(null);
    if (group?.members.length > 0) {
      setPaidBy(group.members[0].id);
      setSplitAmong(group.members.map((m) => m.id));
    }
  };

  const handleSubmitExpense = async (e) => {
    e.preventDefault();
    setError("");

    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount.");
      return;
    }
    if (!paidBy) {
      setError("Who paid for this?");
      return;
    }
    if (splitAmong.length === 0) {
      setError("Pick at least one person to split it among.");
      return;
    }

    const payload = {
      description: description.trim() || "Expense",
      paidBy,
      amount: amt,
      splitAmong,
    };

    setSubmitting(true);
    try {
      if (editingExpenseId) {
        await updateExpense(groupId, editingExpenseId, payload);
      } else {
        await addExpense(groupId, payload);
      }
      resetForm();
      await loadGroup();
    } catch (err) {
      setError(err.message || "Couldn't save that expense.");
    } finally {
      setSubmitting(false);
    }
  };

  const startEditingExpense = (exp) => {
    setEditingExpenseId(exp.id);
    setDescription(exp.description === "Expense" ? "" : exp.description);
    setAmount(String(exp.amount));
    setPaidBy(exp.paidBy);
    setSplitAmong(exp.splitAmong);
    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEditing = () => {
    resetForm();
    setError("");
  };

  const handleDeleteExpense = async (expenseId) => {
    setError("");
    setDeletingId(expenseId);
    try {
      await deleteExpense(groupId, expenseId);
      if (editingExpenseId === expenseId) resetForm();
      await loadGroup();
    } catch (err) {
      setError(err.message || "Couldn't delete that expense.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="font-display text-2xl animate-pulse">Loading the trip... ✈️</p>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <Card className="text-center max-w-md">
          <p className="font-display text-xl mb-2">😕 Couldn't find that group</p>
          <p className="text-ink/60 mb-4">{error}</p>
          <BigButton onClick={() => router.push("/")} color="sunny">Start over</BigButton>
        </Card>
      </main>
    );
  }

  const idToEmoji = Object.fromEntries(
    group.members.map((m, i) => [m.id, AVATAR_EMOJIS[i % AVATAR_EMOJIS.length]])
  );

  return (
    <main className="min-h-screen px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold">{group.name} 🧳</h1>
          <div className="flex items-center justify-center gap-2 mt-2 text-ink/70 font-body">
            <Users size={18} />
            <span>{group.members.map((m) => m.name).join(", ")}</span>
          </div>
        </div>

        <Card className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-xl flex items-center gap-2">
              <Receipt size={22} /> {editingExpenseId ? "Edit expense" : "Add an expense"}
            </h2>
            {editingExpenseId && (
              <button
                type="button"
                onClick={cancelEditing}
                className="flex items-center gap-1 text-sm font-display font-bold text-ink/50 hover:text-coral transition-colors"
              >
                <X size={16} /> Cancel
              </button>
            )}
          </div>
          <form onSubmit={handleSubmitExpense} className="space-y-4">
            <div>
              <label className="font-display font-semibold block mb-1.5">What was it for?</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Hotel, dinner, cab..."
                className="w-full px-4 py-2.5 rounded-xl border-2 border-ink font-body bg-cream
                  focus:outline-none focus:ring-4 focus:ring-sunny/50"
              />
            </div>

            <div>
              <label className="font-display font-semibold block mb-1.5">Amount</label>
              <div className="relative">
                <IndianRupee size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/50" />
                <input
                  type="number"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="2000"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border-2 border-ink font-body bg-cream
                    focus:outline-none focus:ring-4 focus:ring-sunny/50"
                />
              </div>
            </div>

            <div>
              <label className="font-display font-semibold block mb-1.5">Who paid?</label>
              <div className="flex flex-wrap gap-2">
                {group.members.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => setPaidBy(m.id)}
                    className={`px-4 py-2 rounded-xl border-2 border-ink font-body font-bold transition-all
                      ${paidBy === m.id ? "bg-mint shadow-chunky-sm -translate-y-0.5" : "bg-white hover:bg-mint/20"}`}
                  >
                    {idToEmoji[m.id]} {m.name}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-display font-semibold block mb-1.5">Split among</label>
              <div className="flex flex-wrap gap-2">
                {group.members.map((m) => (
                  <button
                    type="button"
                    key={m.id}
                    onClick={() => toggleSplitMember(m.id)}
                    className={`px-4 py-2 rounded-xl border-2 border-ink font-body font-bold transition-all
                      ${splitAmong.includes(m.id) ? "bg-sky shadow-chunky-sm -translate-y-0.5" : "bg-white hover:bg-sky/20"}`}
                  >
                    {idToEmoji[m.id]} {m.name}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-coral font-bold text-sm bg-coral/10 rounded-xl px-3 py-2 border-2 border-coral/30">
                {error}
              </p>
            )}

            <BigButton type="submit" color="sunny" disabled={submitting} className="w-full">
              {submitting
                ? (editingExpenseId ? "Saving..." : "Adding...")
                : (editingExpenseId ? "Save changes" : "Add expense")}
            </BigButton>
          </form>
        </Card>

        {group.expenses.length > 0 && (
          <Card className="mb-6">
            <h2 className="font-display font-bold text-xl mb-3">Expenses so far</h2>
            <ul className="space-y-2">
              {group.expenses.map((exp) => {
                const payer = group.members.find((m) => m.id === exp.paidBy);
                const isBeingEdited = editingExpenseId === exp.id;
                const isDeleting = deletingId === exp.id;
                return (
                  <li
                    key={exp.id}
                    className={`flex items-center justify-between rounded-xl px-4 py-2.5 border-2 transition-colors
                      ${isBeingEdited ? "bg-sunny/30 border-ink" : "bg-cream border-ink/10"}`}
                  >
                    <span className="font-body">
                      {idToEmoji[exp.paidBy]} <strong>{payer?.name}</strong> paid for {exp.description}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold">₹{exp.amount}</span>
                      <button
                        type="button"
                        onClick={() => startEditingExpense(exp)}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg hover:bg-sky/30 transition-colors disabled:opacity-30"
                        aria-label="Edit expense"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteExpense(exp.id)}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg hover:bg-coral/30 transition-colors disabled:opacity-30"
                        aria-label="Delete expense"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>
        )}

        <div className="text-center">
          <BigButton
            color="coral"
            size="lg"
            onClick={() => router.push(`/group/${groupId}/settle`)}
            disabled={group.expenses.length === 0}
          >
            <span className="flex items-center gap-2">
              Settle Up <Sparkles size={22} />
            </span>
          </BigButton>
          {group.expenses.length === 0 && (
            <p className="text-ink/50 text-sm mt-2 font-body">Add at least one expense first</p>
          )}
        </div>
      </div>
    </main>
  );
}
