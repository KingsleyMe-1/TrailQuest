import { Target } from "lucide-react";
import { WEEKLY_GOALS } from "~/constants/dashboard";

function GoalBar({
  label,
  current,
  goal,
  unit,
  color,
}: {
  label: string;
  current: number;
  goal: number;
  unit: string;
  color: string;
}) {
  const pct = Math.min(Math.round((current / goal) * 100), 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold text-foreground">
          {current}{" "}
          <span className="text-muted-foreground font-normal">
            / {goal} {unit}
          </span>
        </span>
      </div>
      <div className="h-2 rounded-full bg-border overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-out ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function WeeklyGoals() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
          <Target className="w-3.5 h-3.5 text-primary" />
        </div>
        <div>
          <h3 className="text-sm font-bold">Weekly Goals</h3>
          <p className="text-[11px] text-muted-foreground">Mar 16 – 22</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {WEEKLY_GOALS.map((goal) => (
          <GoalBar
            key={goal.label}
            label={goal.label}
            current={goal.current}
            goal={goal.goal}
            unit={goal.unit}
            color={goal.color}
          />
        ))}
      </div>
    </div>
  );
}
