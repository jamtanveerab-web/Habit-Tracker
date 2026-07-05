import React, { useState } from "react";
import { getMonthWeeks, fmtDate, MONTH_NAMES } from "../utils/dateHelpers.js";

export default function MonthPanel({ habits, today }) {
  const [viewMonth, setViewMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const y = viewMonth.getFullYear();
  const m = viewMonth.getMonth();
  const isCurrent = y === today.getFullYear() && m === today.getMonth();
  const weeks = getMonthWeeks(y, m);

  const monthTotals = weeks.map(() => ({ done: 0, total: 0 }));
  let grandDone = 0;
  let grandTotal = 0;

  const rows = habits.map((h) => {
    let habitMonthDone = 0;
    let habitMonthTotal = 0;
    const cells = weeks.map((week, wi) => {
      const inMonthDays = week.filter((d) => d.inMonth && d.date <= today);
      const done = inMonthDays.filter((d) => h.records && h.records[fmtDate(d.date)]).length;
      const total = inMonthDays.length;
      habitMonthDone += done;
      habitMonthTotal += total;
      monthTotals[wi].done += done;
      monthTotals[wi].total += total;
      const pct = total ? Math.round((done / total) * 100) : null;
      return pct;
    });
    grandDone += habitMonthDone;
    grandTotal += habitMonthTotal;
    const monthPct = habitMonthTotal ? Math.round((habitMonthDone / habitMonthTotal) * 100) : null;
    return { habit: h, cells, monthPct };
  });

  const totalCells = monthTotals.map((t) => (t.total ? Math.round((t.done / t.total) * 100) : null));
  const grandPct = grandTotal ? Math.round((grandDone / grandTotal) * 100) : null;

  const pctClass = (p) => (p === null ? "" : p >= 70 ? "pct-good" : p < 40 ? "pct-bad" : "");

  return (
    <>
      <div className="section-title">
        <span className="tag">Monthly</span>
        <h2>Progress by week</h2>
        <div className="rule"></div>
      </div>
      <div className="card">
        <div className="month-nav">
          <button
            aria-label="Previous month"
            onClick={() => setViewMonth(new Date(y, m - 1, 1))}
          >
            ‹
          </button>
          <div style={{ textAlign: "center" }}>
            <div className="label">
              {MONTH_NAMES[m]} {y}
            </div>
            {!isCurrent && (
              <button
                className="jump"
                onClick={() => setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))}
              >
                jump to current month
              </button>
            )}
          </div>
          <button aria-label="Next month" onClick={() => setViewMonth(new Date(y, m + 1, 1))}>
            ›
          </button>
        </div>

        <div className="month-table-scroll">
          {habits.length === 0 ? (
            <div className="empty">Add a habit to see monthly progress.</div>
          ) : (
            <table className="month-table">
              <thead>
                <tr>
                  <th>Habit</th>
                  {weeks.map((_, i) => (
                    <th key={i}>W{i + 1}</th>
                  ))}
                  <th>Month</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ habit, cells, monthPct }) => (
                  <tr key={habit._id}>
                    <td>{habit.name}</td>
                    {cells.map((pct, i) => (
                      <td className={"pct " + pctClass(pct)} key={i}>
                        {pct === null ? "—" : pct + "%"}
                      </td>
                    ))}
                    <td className={"pct " + pctClass(monthPct)}>{monthPct === null ? "—" : monthPct + "%"}</td>
                  </tr>
                ))}
                <tr className="month-total-row">
                  <td>All habits</td>
                  {totalCells.map((p, i) => (
                    <td className="pct" key={i}>
                      {p === null ? "—" : p + "%"}
                    </td>
                  ))}
                  <td className="pct">{grandPct === null ? "—" : grandPct + "%"}</td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
