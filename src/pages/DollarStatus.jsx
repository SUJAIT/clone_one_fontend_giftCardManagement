import { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const DollarStatus = () => {
  const [twoDollarCount, setTwoDollarCount] = useState(0);
  const [fiveDollarCount, setFiveDollarCount] = useState(0);

  const chartData = [
    { name: "$2 Total Value", value: twoDollarCount * 206 },
    { name: "$5 Total Value", value: fiveDollarCount * 525 },
  ];

  const COLORS = ["#0088FE", "#00C49F"];

  useEffect(() => {
    const fetchCounts = async () => {
      try {
const res = await axios.get("http://localhost:5000/gift-card/stats");
        setTwoDollarCount(res.data.twoDollarCount);
        setFiveDollarCount(res.data.fiveDollarCount);
      } catch (error) {
        console.error("Failed to fetch gift card stats", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Top Boxes */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h3 className="text-sm text-gray-500">$2 Cards</h3>
          <p className="text-3xl font-bold text-green-700">{twoDollarCount}</p>
        </div>
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <h3 className="text-sm text-gray-500">$5 Cards</h3>
          <p className="text-3xl font-bold text-blue-700">{fiveDollarCount}</p>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-center">Total Value Chart</h3>
        <div className="w-full h-64">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DollarStatus;
