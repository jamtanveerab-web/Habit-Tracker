import React from "react";
import { startOfWeek, addDays, fmtDate } from "../utils/dateHelpers.js";

export default function YearHeatmap({ habits, today }) {
  const start = addDays(today, -364);
  const gridStart = startOfWeek(start);
  const totalDays = Math.ceil((today - gridStart) / 86400000) + 1;
  const weeksCount = Math.ceil(totalDays / 7);

  const cells = [];
  for (let w = 0; w < weeksCount; w++) {
    for (let d = 0; d < 7; d++) {
      const date = addDays(gridStart, w * 7 + d);
      if (date > today) {
        cells.push({ key: `${w}-${d}`, bg: "transparent", title: "" });
        continue;
      }
      const ds = fmtDate(date);
      const done = habits.filter((h) => h.records && h.records[ds]).length;
      const ratio = habits.length ? done / habits.length : 0;
      let bg = "var(--surface-2)";
      if (ratio > 0 && ratio <= 0.25) bg = "#3A3419";
      else if (ratio > 0.25 && ratio <= 0.5) bg = "#6B5A20";
      else if (ratio > 0.5 && ratio < 0.99) bg = "#9A7E27";
      else if (ratio >= 0.99) bg = "var(--accent)";
      cells.push({ key: ds, bg, title: `${ds}: ${done}/${habits.length}` });
    }
  }

  return (
    <>
      <div className="section-title">
        <span className="tag">Yearly</span>
        <h2>{today.getFullYear()} at a glance</h2>
        <div className="rule"></div>
      </div>
      <div className="card">
        <div className="heatmap-wrap">
          <div className="heatmap" style={{ gridTemplateColumns: `repeat(${weeksCount},13px)` }}>
            {cells.map((c) => (
              <div className="cell" key={c.key} style={{ background: c.bg }} title={c.title}></div>
            ))}
          </div>
          <div className="heatmap-legend">
            <span>less</span>
            <span className="cell" style={{ background: "var(--surface-2)" }}></span>
            <span className="cell" style={{ background: "#3A3419" }}></span>
            <span className="cell" style={{ background: "#6B5A20" }}></span>
            <span className="cell" style={{ background: "#9A7E27" }}></span>
            <span className="cell" style={{ background: "var(--accent)" }}></span>
            <span>more</span>
          </div>
        </div>
      </div>
    </>
  );
}
