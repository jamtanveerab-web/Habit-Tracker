import React from "react";
import { habitStartDate, currentStreak, parseDateStr } from "../utils/dateHelpers.js";

export default function OverviewGrid({ habits, today }) {
  if (habits.length === 0) {
    return (
      <div className="card">
        <div className="overview-grid">
          <div className="empty" style={{ padding: "8px 0" }}>
            Add a habit to see its all-time progress here.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="overview-grid">
        {habits.map((h) => {
          const start = parseDateStr(habitStartDate(h));
          const daysTracked = Math.max(1, Math.round((today - start) / 86400000) + 1);
          const totalDone = Object.values(h.records || {}).filter(Boolean).length;
          const pct = Math.round((totalDone / daysTracked) * 100);
          const cls = pct >= 70 ? "pct-good" : pct < 40 ? "pct-bad" : "";
          const streak = currentStreak(h, today);

          return (
            <div className="overview-card" key={h._id}>
              <div className="overview-name">{h.name}</div>
              <div className={"overview-pct " + cls}>{pct}%</div>
              <div className="overview-label">all-time completion</div>
              <div className="overview-bar">
                <div className="overview-bar-fill" style={{ width: Math.min(100, pct) + "%" }}></div>
              </div>
              <div className="overview-stats">
                <span>
                  {streak > 0 && <span className="streak-flame">● </span>}
                  <b>{streak}</b> {streak === 1 ? "day" : "days"} streak
                </span>
                <span>
                  <b>{totalDone}</b>/{daysTracked} days
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
