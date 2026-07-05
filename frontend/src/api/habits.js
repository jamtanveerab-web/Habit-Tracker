const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function handle(res) {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.message || `Request failed: ${res.status}`);
  }
  return res.json();
}

export function getHabits() {
  return fetch(`${API_URL}/habits`).then(handle);
}

export function createHabit(name, goal) {
  return fetch(`${API_URL}/habits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, goal }),
  }).then(handle);
}

export function toggleDate(id, date) {
  return fetch(`${API_URL}/habits/${id}/toggle`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ date }),
  }).then(handle);
}

export function updateGoal(id, goal) {
  return fetch(`${API_URL}/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ goal }),
  }).then(handle);
}

export function deleteHabit(id) {
  return fetch(`${API_URL}/habits/${id}`, { method: "DELETE" }).then(handle);
}
