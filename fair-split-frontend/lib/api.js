const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data.error || `Request failed with status ${res.status}`;
    throw new Error(message);
  }
  return data;
}

export async function createGroup(name, members) {
  const res = await fetch(`${API_URL}/api/groups`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, members }),
  });
  return handleResponse(res);
}

export async function getGroup(groupId) {
  const res = await fetch(`${API_URL}/api/groups/${groupId}`, { cache: "no-store" });
  return handleResponse(res);
}

export async function addExpense(groupId, expense) {
  const res = await fetch(`${API_URL}/api/groups/${groupId}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return handleResponse(res);
}

export async function deleteExpense(groupId, expenseId) {
  const res = await fetch(`${API_URL}/api/groups/${groupId}/expenses/${expenseId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }
  return true;
}

export async function updateExpense(groupId, expenseId, expense) {
  const res = await fetch(`${API_URL}/api/groups/${groupId}/expenses/${expenseId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(expense),
  });
  return handleResponse(res);
}

export async function settleGroup(groupId) {
  const res = await fetch(`${API_URL}/api/groups/${groupId}/settle`, { cache: "no-store" });
  return handleResponse(res);
}
