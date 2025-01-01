interface ProgramCardProps {
  programName: String;
  donation: String;
  balance: String;
  couponsUsed: String;
  couponsRemaining: String;
  date: String;
}
export default function ProgramCard({
  programName,
  donation,
  balance,
  couponsUsed,
  couponsRemaining,
  date,
}: ProgramCardProps) {
  return (
    <div className="bg-gray-100 shadow-md rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center mt-4 mr-2">
      <div>
        <h3 className="text-lg font-semibold">{programName}</h3>
        <p className="text-sm text-gray-500">Donation of: {donation}</p>
        <p className="text-sm text-gray-500">Balance: {balance}</p>
      </div>
      <div className="text-sm text-gray-500 mt-2 sm:mt-0">
        <p>Coupons Used: {couponsUsed}</p>
        <p>Coupons Remaining: {couponsRemaining}</p>
        <p>{date}</p>
      </div>
    </div>
  );
}
