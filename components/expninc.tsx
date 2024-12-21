import { Card, CardContent } from "./ui/card";

export default function Expninc({
  thisMonthExpense,
  thisMonthEarning,
}: {
  thisMonthExpense: number;
  thisMonthEarning: number;
}) {
  return (
    <div className="flex items-center justify-center gap-4 h-56">
      <Card className="apple-card flex-1">
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold mb-2">Expenses</h2>
          <p className="text-2xl font-black text-red-500">
            ${thisMonthExpense.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      <Card className="apple-card flex-1">
        <CardContent className="p-6">
          <h2 className="text-sm font-semibold mb-2">Income</h2>
          <p className="text-2xl font-black text-green-500">
            ${thisMonthEarning.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
