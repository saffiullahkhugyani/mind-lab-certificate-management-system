// SummaryCard.jsx
interface SummaryCardProps {
  label: String;
  value: String;
}

export default function SummaryCard({ label, value }: SummaryCardProps) {
  return (
    <div className="bg-gray-100 shadow-md rounded-sm p-4 text-center">
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
    </div>
  );
}
