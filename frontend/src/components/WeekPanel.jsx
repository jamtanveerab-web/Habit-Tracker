import React, { useState } from "react";
import { startOfWeek, addDays, fmtDate, sameDay, WEEKDAY_LABELS } from "../utils/dateHelpers.js";

export default function WeekPanel({ habits, today, onToggle, onRemove, onAdd }) {
  const [newName, setNewName] = useState("");
  const [newGoal, setNewGoal] = useState(5);
  const [adding, setAdding] = useState(false);

  const weekStart = startOfWeek(today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekLabel = `Week of ${days[0].toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  const handleAdd = async () => {
    const name = newName.trim();
    if (!name) return;
    setAdding(true);
    try {
      await onAdd(name, Math.max(1, Math.min(7, Number(newGoal) || 5)));
      setNewName("");
      setNewGoal(5);
    } finally {
      setAdding(false);
    }
  };

  return (
    <>
      <div className="section-title">
        <span className="tag">Weekly</span>
        <h2>{weekLabel}</h2>
        <div className="rule"></div>
      </div>

      <div className="card">
        {habits.length === 0 ? (
          <div className="empty">No habits yet — add your first one below.</div>
        ) : (
          <>
            <div className="habit-head-row">
              <span className="first">Habit</span>
              {WEEKDAY_LABELS.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
              <span></span>
            </div>
            {habits.map((h) => {
              const weekDone = days.filter((d) => h.records && h.records[fmtDate(d)]).length;
              const barPct = Math.min(100, Math.round((weekDone / h.goal) * 100));
              const barCls = weekDone >= h.goal ? "full" : barPct < 50 ? "short" : "";
              return (
                <div className="habit-row" key={h._id}>
                  <div className="habit-name-wrap">
                    <div className="habit-name">{h.name}</div>
                    <div className="habit-goal-line">
                      <span className="habit-goal">
                        {weekDone}/{h.goal}
                      </span>
                      <div className="mini-bar">
                        <div className={"mini-bar-fill " + barCls} style={{ width: barPct + "%" }}></div>
                      </div>
                    </div>
                  </div>
                  {days.map((d) => {
                    const ds = fmtDate(d);
                    const done = !!(h.records && h.records[ds]);
                    const isToday = sameDay(d, today);
                    return (
                      <div
                        key={ds}
                        className={"stamp" + (done ? " done" : "") + (isToday ? " today" : "")}
                        onClick={() => onToggle(h._id, ds)}
                        title={ds}
                      ></div>
                    );
                  })}
                  <button className="remove-btn" title="Remove habit" onClick={() => onRemove(h._id)}>
                    ×
                  </button>
                </div>
              );
            })}
          </>
        )}
      </div>

      <div className="card" style={{ marginTop: 14 }}>
        <div className="add-row">
          <input
            type="text"
            name="hname"
            placeholder="New habit, e.g. 'No sugar'"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <input
            type="number"
            name="hgoal"
            min="1"
            max="7"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            title="Goal — days per week"
          />
          <button onClick={handleAdd} disabled={adding}>
            {adding ? "Adding…" : "+ Add habit"}
          </button>
        </div>
      </div>
    </>
  );
}
