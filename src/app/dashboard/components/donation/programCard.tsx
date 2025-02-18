interface ProgramCardProps {
  programName: String;
  donation: number;
  balance: number;
  availableCoupons: number;
  date: String;
}
export default function ProgramCard({
  programName,
  donation,
  balance,
  availableCoupons,
  date,
}: ProgramCardProps) {
  return (
    <div className="border border-[#007847] bg-[#00784714] shadow-md rounded-md p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 mr-2">
      <div>
        <h3 className="text-lg font-semibold">{programName}</h3>
        <p className="text-sm text-gray-500">Donation of: {donation}</p>
        <p className="text-sm text-gray-500">Balance: {balance}</p>
      </div>
      <div className=" flex flex-col justify-between text-sm mt-2 sm:mt-0 h-full">
        <p className="flex justify-end">{date}</p>
        <p>Available Coupons: {availableCoupons}</p>
      </div>
    </div>
  );
}
