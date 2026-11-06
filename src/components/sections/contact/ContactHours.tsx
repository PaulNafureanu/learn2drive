import { Clock3 } from "lucide-react";
import type { OpeningHours } from "../../../pages/types";

type Props = {
  hours?: OpeningHours[] | null;
};

const DAYS = [
  { key: "Luni", label: "Luni" },
  { key: "Marți", label: "Marți" },
  { key: "Miercuri", label: "Miercuri" },
  { key: "Joi", label: "Joi" },
  { key: "Vineri", label: "Vineri" },
  { key: "Sâmbătă", label: "Sâmbătă" },
  { key: "Duminică", label: "Duminică" },
];

export default function ContactHours({ hours }: Props) {
  if (!hours?.length) return null;

  const orderedHours = DAYS.flatMap((day) => {
    const entry = hours.find((item) => item.day === day.key);

    return entry ? [{ ...entry, label: day.label }] : [];
  });

  if (!orderedHours.length) return null;

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <Clock3 size={20} className="text-blue-600" aria-hidden="true" />

        <h4 className="font-semibold text-[#171717]">Program</h4>
      </div>

      <dl className="space-y-2 pl-8">
        {orderedHours.map((entry) => (
          <div key={entry._key} className="flex items-baseline justify-between gap-4 text-sm">
            <dt className="text-neutral-600">{entry.label}</dt>

            <dd className="text-right font-medium text-[#171717]">
              {entry.closed
                ? "Închis"
                : entry.opens && entry.closes
                  ? `${entry.opens} – ${entry.closes}`
                  : "Nespecificat"}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
