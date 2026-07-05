import React from "react";
import { startOfWeek, addDays, fmtDate, sameDay, WEEKDAY_LABELS } from "../utils/dateHelpers.js";

export default function DailyProgress({ habits, today }) {
  const weekStart = startOfWeek(today);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="card daily-card">
      <div className="daily-bars">
        {habits.length === 0 ? (
          <div className="empty" style={{ padding: "8px 0" }}>
            Add a habit to see daily progress.
          </div>
        ) : (
          days.map((d, i) => {
            const ds = fmtDate(d);
            const isFuture = d > today;
            const done = habits.filter((h) => h.records && h.records[ds]).length;
            const pct = isFuture ? 0 : Math.round((done / habits.length) * 100);
            const isToday = sameDay(d, today);
            return (
              <div className={"daily-col" + (isToday ? " today" : "")} key={ds}>
                <div className="daily-pct">{isFuture ? "–" : pct + "%"}</div>
                <div className="daily-track">
                  <div className="daily-fill" style={{ height: (isFuture ? 0 : pct) + "%" }}></div>
                </div>
                <div className="daily-day">{WEEKDAY_LABELS[i]}</div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
