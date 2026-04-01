import {
  Award,
  CheckCircle2,
} from "lucide-react";
import { DASHBOARD_BADGES } from "~/constants/dashboard";

export default function BadgesCard() {
  return (
    <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
            <Award className="w-3.5 h-3.5 text-primary" />
          </div>
          <h3 className="text-sm font-bold">Badges</h3>
        </div>
        <span className="text-[11px] text-muted-foreground">{DASHBOARD_BADGES.length} earned</span>
      </div>

      <div className="flex flex-col gap-2">
        {DASHBOARD_BADGES.map((b) => {
          const BIcon = b.icon;
          return (
            <div
              key={b.label}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border ${b.color} hover:opacity-80 transition-opacity`}
            >
              <BIcon className="w-4 h-4 shrink-0" />
              <span className="text-xs font-semibold">{b.label}</span>
              <CheckCircle2 className="w-3.5 h-3.5 ml-auto opacity-60" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
