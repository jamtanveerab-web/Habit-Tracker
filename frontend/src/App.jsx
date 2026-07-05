import React, { useEffect, useState } from "react";
import OverviewGrid from "./components/OverviewGrid.jsx";
import DailyProgress from "./components/DailyProgress.jsx";
import WeekPanel from "./components/WeekPanel.jsx";
import MonthPanel from "./components/MonthPanel.jsx";
import YearHeatmap from "./components/YearHeatmap.jsx";
import { getHabits, createHabit, toggleDate, deleteHabit } from "./api/habits.js";

export default function App() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [apiOnline, setApiOnline] = useState(false);
  const today = new Date();

  const loadHabits = async () => {
    try {
      const data = await getHabits();
      setHabits(data);
      setApiOnline(true);
      setError("");
    } catch (err) {
      setApiOnline(false);
      setError("Can't reach the API. Make sure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHabits();
  }, []);

  const handleAdd = async (name, goal) => {
    try {
      const created = await createHabit(name, goal);
      setHabits((hs) => [...hs, created]);
    } catch (err) {
      setError("Couldn't add habit. Please try again.");
    }
  };

  const handleToggle = async (id, date) => {
    // optimistic update
    setHabits((hs) =>
      hs.map((h) =>
        h._id === id
          ? { ...h, records: { ...h.records, [date]: !h.records[date] } }
          : h
      )
    );
    try {
      await toggleDate(id, date);
    } catch (err) {
      setError("Couldn't save that change. Reloading habits.");
      loadHabits();
    }
  };

  const handleRemove = async (id) => {
    const prev = habits;
    setHabits((hs) => hs.filter((h) => h._id !== id));
    try {
      await deleteHabit(id);
    } catch (err) {
      setError("Couldn't delete habit. Restoring list.");
      setHabits(prev);
    }
  };

  return (
    <div className="wrap">
      <div className="masthead">
        <div className="spine">
          <div className="bar"></div>
          <div>
            <h1>Ledger</h1>
            <div className="sub">A year of habits, kept week by week</div>
            <div className="api-status">
              <span className={"api-dot" + (apiOnline ? " ok" : "")}></span>
              {apiOnline ? "Connected to MongoDB via API" : "API offline"}
            </div>
          </div>
        </div>
        <div className="today-chip">
          {today.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <div className="empty">Loading habits…</div>
      ) : (
        <>
          <div className="section-title">
            <span className="tag">Overview</span>
            <h2>Every habit's progress</h2>
            <div className="rule"></div>
          </div>
          <OverviewGrid habits={habits} today={today} />

          <div className="section-title">
            <span className="tag">Daily</span>
            <h2>Today's progress</h2>
            <div className="rule"></div>
          </div>
          <DailyProgress habits={habits} today={today} />

          <WeekPanel habits={habits} today={today} onToggle={handleToggle} onRemove={handleRemove} onAdd={handleAdd} />

          <MonthPanel habits={habits} today={today} />

          <YearHeatmap habits={habits} today={today} />
        </>
      )}

      <div className="foot-note">Ledger — Data persists in MongoDB, built for consistency, not perfection</div>
    </div>
  );
}
