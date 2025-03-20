import { Geist_Mono } from "next/font/google";
import { ArrowUp } from "lucide-react";

const mono = Geist_Mono({ subsets: ["latin"] });

export default function Expninc({
  thisMonthExpense,
  thisMonthEarning,
}: {
  thisMonthExpense: number;
  thisMonthEarning: number;
}) {
  const total = thisMonthEarning - thisMonthExpense;

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 h-60 from-black/5 to-white bg-gradient-to-bl ${mono.className}`}>
      <p className="text-md text-black/60 tracking-tight">Total balance</p>
      <h2
        className={`text-5xl font-semibold transition-all ${
          total < 0 && "text-red-500"
        }`}>
        ${Math.abs(total)}
      </h2>
    </div>
  );
}
