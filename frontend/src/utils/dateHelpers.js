export function pad2(n) {
  return String(n).padStart(2, "0");
}

export function fmtDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function parseDateStr(s) {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function startOfWeek(date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function sameDay(a, b) {
  return fmtDate(a) === fmtDate(b);
}

export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

export function getMonthWeeks(year, month) {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  let ws = startOfWeek(first);
  const weeks = [];
  while (ws <= last) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = addDays(ws, i);
      days.push({ date: d, inMonth: d.getMonth() === month });
    }
    weeks.push(days);
    ws = addDays(ws, 7);
  }
  return weeks;
}

export function habitStartDate(habit) {
  const keys = Object.keys(habit.records || {});
  const earliestRecord = keys.length ? keys.reduce((a, b) => (a < b ? a : b)) : null;
  const created = habit.createdAt ? fmtDate(new Date(habit.createdAt)) : earliestRecord || fmtDate(new Date());
  const candidates = [created];
  if (earliestRecord) candidates.push(earliestRecord);
  return candidates.reduce((a, b) => (a < b ? a : b));
}

export function currentStreak(habit, today) {
  let streak = 0;
  let d = new Date(today);
  while (habit.records && habit.records[fmtDate(d)]) {
    streak++;
    d = addDays(d, -1);
  }
  return streak;
}
