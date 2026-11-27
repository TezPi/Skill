# Pillar 2 errata (verified 2026-10-28)

`PILLAR.md`, `theme.ts` and `research-report.vi.md` are kept as delivered. Corrections below take precedence over them. Re-run the check with `python3 scripts/verify_motion_math.py` (numerical bezier sampling + spring simulation).

| Item | Source says | Correct | Impact |
|---|---|---|---|
| Symmetric peak-velocity formula (report §2.2) | `V_peak = 1.5 / (1.5 − I)` | `V_peak = 1 / (1 − I)` | Typo only. Every tabled value (33% → 1.50x, 75% → 4.00x, 80% → 5.00x, 90% → 10.00x) already follows the correct formula. |
| `ease-in-out-sine` peak velocity | 1.56x | 1.72x at t = 0.50 | Still the gentlest symmetric curve; choice unchanged. |
| Spring settle times (8 presets) | e.g. Snappy 353 ms | These are the decay-envelope bound `ln(100/√(1−ζ²)) / (ζ·ωn)`; simulated 1% settle is ~7–25% shorter (Snappy ≈ 328 ms, Critically Damped ≈ 470 ms) | Keep the stated frame budgets: they are conservative and never cut a settle short. |
| Arc "bow %" (§2.4) | e.g. 31.4% | Max perpendicular distance from the straight diagonal in the unit square, i.e. `max|x(t) − y(t)| / √2` | Definition only; all five arc values verified. |

Verified exactly (±3%): the other 16 cubic-bezier tokens (V_peak, t_peak, Y range incl. +9.8% / −9.8% / ±10.5% back curves), the five arc midpoints, all eight spring damping ratios and overshoot percentages, and the Influence % → `cubic-bezier(Out/100, 0, 1 − In/100, 1)` conversion. `theme.ts` typechecks under `tsc --strict`.
