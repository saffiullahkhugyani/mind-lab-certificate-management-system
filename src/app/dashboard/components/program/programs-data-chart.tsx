import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

type CouponData = {
  month: string;
  coupons: number;
};

const CouponChart = () => {
  // Sample data: Total coupons issued per month
  const data: CouponData[] = [
    { month: "February", coupons: 50 },
    { month: "March", coupons: 85 },
    { month: "April", coupons: 72 },
  ];

  return (
    <div className="w-full p-4">
      <h2 className="text-lg font-semibold mb-4">Program progress</h2>
      <BarChart
        width={800}
        height={300}
        data={data}
        layout="vertical" // Keeps Y-Axis as months
        barSize={10}
        className="bg-white"
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />

        {/* X-Axis → Number of Coupons (1 to 100) */}
        <XAxis
          type="number"
          domain={[0, 100]}
          tickCount={11}
          tickFormatter={(tick) => `${tick}`}
          label={{ value: "Number of Coupons", position: "bottom", offset: 10 }}
        />

        {/* Y-Axis → Months */}
        <YAxis
          type="category"
          dataKey="month"
          width={100}
          tickLine={false}
          axisLine={false}
        />

        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="bg-white p-2 border border-gray-200 rounded shadow">
                  <p className="text-sm font-bold">
                    {payload[0]?.payload.month}
                  </p>
                  <p className="text-sm">{`Coupons: ${payload[0]?.payload.coupons}`}</p>
                </div>
              );
            }
            return null;
          }}
        />

        {/* Bars showing number of coupons per month */}
        <Bar
          dataKey="coupons"
          fill="#90CAF9"
          radius={[2, 2, 2, 2]}
          background={{ fill: "#eee" }}
        />
      </BarChart>
    </div>
  );
};

export default CouponChart;
