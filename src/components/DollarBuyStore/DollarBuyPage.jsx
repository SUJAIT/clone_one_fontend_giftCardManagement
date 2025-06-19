/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../../axios/axios";

const DollarBuyPage = () => {
  const [stats, setStats] = useState({
    twoDollarTotal: 0,
    fiveDollarTotal: 0,
  });

  const [counts, setCounts] = useState({
    twoDollarCount: 0,
    fiveDollarCount: 0,
  });

  const [rates, setRates] = useState({
    twoDollarRate: 0,
    fiveDollarRate: 0,
  });

  const [selectedType, setSelectedType] = useState(null);
  const [availableCodes, setAvailableCodes] = useState([]);
  const [selectedCodes, setSelectedCodes] = useState([]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");

      const duesRes = await axiosInstance.get("/gift-card/dues-specific", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const countRes = await axiosInstance.get("/gift-card/stats");

      setStats(duesRes.data.dues);
      setCounts({
        twoDollarCount: countRes.data.twoDollarCount,
        fiveDollarCount: countRes.data.fiveDollarCount,
      });

      setRates({
        twoDollarRate: countRes.data.twoDollarRate,
        fiveDollarRate: countRes.data.fiveDollarRate,
      });
    } catch {
      Swal.fire("Error", "Failed to load dashboard data", "error");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchAvailableCodes = async (amount) => {
    try {
      setSelectedType(amount);
      const token = localStorage.getItem("token");

      const res = await axiosInstance.get(`/gift-card/available/${amount}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAvailableCodes(res.data.codes);
      setSelectedCodes([]);
    } catch {
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
      setSelectedType(null);
      fetchData();
    } catch {
      Swal.fire("Error", "Claim failed", "error");
    }
  };

  const toggleSelectAll = () => {
    if (selectedCodes.length === availableCodes.length) {
      setSelectedCodes([]);
    } else {
      setSelectedCodes([...availableCodes]);
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
          <p className="text-sm mt-1 text-gray-400">৳ {rates.twoDollarRate}</p>
        </div>

        <div
          onClick={() => fetchAvailableCodes(5)}
          className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-sm text-gray-500">$5 Cards</h3>
          <p className="text-3xl font-bold text-blue-700">{counts.fiveDollarCount}</p>
          <p className="text-sm mt-1 text-gray-400">৳ {rates.fiveDollarRate}</p>
        </div>
      </div>

      {selectedType && (
        <div className="bg-white p-6 rounded-xl shadow-md border mt-4">
          <h2 className="text-lg font-semibold mb-3">
            Claim ${selectedType} Codes
          </h2>

          <div className="flex justify-end mb-2">
            <button
              onClick={toggleSelectAll}
              className="bg-blue-100 text-blue-700 px-3 py-1 rounded text-sm hover:bg-blue-200"
            >
              {selectedCodes.length === availableCodes.length
                ? "Unselect All"
                : "Select All"}
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
                Swal.fire("Copied Selected!", "", "success");
              }}
              className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 text-sm"
            >
              Copy Selected
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

export default DollarBuyPage;
