// SummaryCard.jsx
interface SummaryCardProps {
  label: string;
  value: string;
  className?: string; // Optional prop for custom classes
}

export default function SummaryCard({
  label,
  value,
  className,
}: SummaryCardProps) {
  return (
    <div className={`shadow-md rounded-sm p-4 text-center ${className}`}>
      <p className="font-bold text-md">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
