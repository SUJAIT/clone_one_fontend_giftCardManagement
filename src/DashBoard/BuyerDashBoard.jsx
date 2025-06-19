/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../axios/axios";
import { AuthContext } from "../providers/AuthProvider";

const BuyerDashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({
    twoDollarTotal: 0,
    fiveDollarTotal: 0,
  });

  const [counts, setCounts] = useState({
    twoDollarCount: 0,
    fiveDollarCount: 0,
  });

  const [previous, setPrevious] = useState({ two: 0, five: 0 });
  const [total, setTotal] = useState({ two: 0, five: 0 });

  const [selectedType, setSelectedType] = useState(null);
  const [availableCodes, setAvailableCodes] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState([]);

  const allSelected = availableCodes.length > 0 && selectedCodes.length === availableCodes.length;

  // ✅ Separate reusable fetch function
  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const duesRes = await axiosInstance.get("/gift-card/dues-specific", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const countRes = await axiosInstance.get("/gift-card/stats");

      const fullDuesRes = await axiosInstance.get("/gift-card/full-dues", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStats(duesRes.data.dues);
      setCounts(countRes.data);
      setPrevious(fullDuesRes.data.previous);
      setTotal(fullDuesRes.data.total);
    } catch (error) {
      Swal.fire("Error", "Failed to load dashboard data", "error");
    }
  };

  useEffect(() => {
    if (user) fetchDashboardData();
  }, [user]);

  const fetchAvailableCodes = async (amount) => {
    try {
      setSelectedType(amount);
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/gift-card/available/${amount}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAvailableCodes(res.data.codes);
      setSelectedCodes([]);
    } catch (err) {
      Swal.fire("Error", "Failed to load codes", "error");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire("Copied", text, "success");
  };

  const handleClaim = async () => {
    if (selectedCodes.length === 0) {
      return Swal.fire("Select at least one code", "", "warning");
    }

    try {
      const token = localStorage.getItem("token");

      await axiosInstance.post(
        "/gift-card/claim",
        { codes: selectedCodes },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Claimed!", "Codes claimed successfully", "success");

      // ✅ Clear and refetch data
      setSelectedType(null);
      setAvailableCodes([]);
      setSelectedCodes([]);
      await fetchDashboardData(); // ✅ Reload stats
    } catch (err) {
      Swal.fire("Error", "Claim failed", "error");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => fetchAvailableCodes(2)}
          className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-sm text-gray-500">$2 Cards</h3>
          <p className="text-3xl font-bold text-green-700">{counts.twoDollarCount}</p>
          <p className="text-sm mt-1 text-gray-400">৳ {stats.twoDollarTotal}</p>
        </div>

        <div
          onClick={() => fetchAvailableCodes(5)}
          className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-sm text-gray-500">$5 Cards</h3>
          <p className="text-3xl font-bold text-blue-700">{counts.fiveDollarCount}</p>
          <p className="text-sm mt-1 text-gray-400">৳ {stats.fiveDollarTotal}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-lg font-semibold mb-4">Total Gift Card Claimed Calculation</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm text-gray-500">Previous Dues</h4>
            <p className="text-lg font-bold text-red-600">৳ {previous.two + previous.five}</p>
          </div>
          <div>
            <h4 className="text-sm text-gray-500">Total Dues</h4>
            <p className="text-lg font-bold text-yellow-600">৳ {total.two + total.five}</p>
          </div>
        </div>
      </div>

      {selectedType && (
        <div className="bg-white p-6 rounded-xl shadow-md border mt-4">
          <h2 className="text-lg font-semibold mb-3">
            Claim ${selectedType} Codes
          </h2>

          <div className="flex justify-end mb-2">
            <button
              onClick={() =>
                allSelected
                  ? setSelectedCodes([])
                  : setSelectedCodes([...availableCodes])
              }
              className="text-sm text-blue-600 hover:underline"
            >
              {allSelected ? "Unselect All" : "Select All"}
            </button>
          </div>

          <div className="grid gap-2 max-h-60 overflow-y-auto mb-4">
            {availableCodes.map((code, index) => (
              <div
                key={index}
                className="flex justify-between items-center border px-3 py-2 rounded-md"
              >
                <input
                  type="checkbox"
                  checked={selectedCodes.includes(code)}
                  onChange={() => {
                    setSelectedCodes((prev) =>
                      prev.includes(code)
                        ? prev.filter((c) => c !== code)
                        : [...prev, code]
                    );
                  }}
                />
                <p className="text-sm">{code}</p>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="text-xs text-blue-500 hover:underline"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => {
                navigator.clipboard.writeText(selectedCodes.join(" "));
                Swal.fire("Copied All!", "", "success");
              }}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm"
            >
              Copy All Selected
            </button>

            <button
              onClick={handleClaim}
              className="bg-green-700 text-white px-6 py-2 rounded-md font-medium hover:bg-green-800 transition"
            >
              Submit Claim
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
