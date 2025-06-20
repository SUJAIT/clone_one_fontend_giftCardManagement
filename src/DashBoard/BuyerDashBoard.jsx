
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

  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [redeemedCodes, setRedeemedCodes] = useState([]);
  const [redeemedTotal, setRedeemedTotal] = useState(0);
  const [redeemedPage, setRedeemedPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

// adding ++++=
const [redeemedStats, setRedeemedStats] = useState({
  twoDollar: { count: 0, amount: 0 },
  fiveDollar: { count: 0, amount: 0 },
});

const fetchRedeemedSummary = async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axiosInstance.get("/gift-card/redeemed-summary", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setRedeemedStats(res.data);
  } catch (err) {
    console.error("Redeemed Summary Load Failed", err);
  }
};

useEffect(() => {
  if (user) {
    fetchDashboardData();
    fetchRedeemedSummary(); // ✅ new add
  }
}, [user]);

// adding ----=


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
//old
  // const handleClaim = async () => {
  //   if (selectedCodes.length === 0) {
  //     return Swal.fire("Select at least one code", "", "warning");
  //   }

    

  //   try {
  //     const token = localStorage.getItem("token");

  //     await axiosInstance.post(
  //       "/gift-card/claim",
  //       { codes: selectedCodes },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     Swal.fire("Claimed!", "Codes claimed successfully", "success");

  //     setSelectedType(null);
  //     setAvailableCodes([]);
  //     setSelectedCodes([]);
  //     await fetchDashboardData();
  //   } catch (err) {
  //     Swal.fire("Error", "Claim failed", "error");
  //   }
  // };


  const handleClaim = async () => {
  if (selectedCodes.length === 0) {
    return Swal.fire("Select at least one code", "", "warning");
  }

  try {
    const token = localStorage.getItem("token");

    // 🔁 Post request to claim codes
    await axiosInstance.post(
      "/gift-card/claim",
      { codes: selectedCodes },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    Swal.fire("Claimed!", "Codes claimed successfully", "success");

    // ✅ Clear selected data
    setSelectedType(null);
    setAvailableCodes([]);
    setSelectedCodes([]);

    // ✅ Now reload everything AFTER claim
    await fetchDashboardData();
    await fetchRedeemedSummary();

    if (showHistoryModal) {
      await fetchRedeemedCodes(showHistoryModal, 1, searchQuery);
    }

  } catch (err) {
    Swal.fire("Error", "Claim failed", "error");
  }
};



  const fetchRedeemedCodes = async (type, page = 1, search = "") => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(
        `/gift-card/claimed-history?type=${type}&page=${page}&limit=10&search=${search}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRedeemedCodes(res.data.codes);
      setRedeemedTotal(res.data.total);
      setRedeemedPage(page);
    } catch (err) {
      console.error(err);
    }
  };

  const openRedeemedModal = (type) => {
    setShowHistoryModal(type);
    setSearchQuery("");
    fetchRedeemedCodes(type, 1, "");
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

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div
          onClick={() => openRedeemedModal(2)}
          className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-sm text-gray-500">$2 Redeemed Cards</h3>
        <p className="text-3xl font-bold text-green-700">{redeemedStats.twoDollar.count}</p>
<p className="text-sm mt-1 text-gray-400">৳ {redeemedStats.twoDollar.amount}</p>
        </div>

        <div
          onClick={() => openRedeemedModal(5)}
          className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-sm text-gray-500">$5 Redeemed Cards</h3>
          <p className="text-3xl font-bold text-blue-700">{redeemedStats.fiveDollar.count}</p>
<p className="text-sm mt-1 text-gray-400">৳ {redeemedStats.fiveDollar.amount}</p>
        </div>
      </div>

      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50 pt-20">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => {
                setShowHistoryModal(null);
                setRedeemedCodes([]);
                setSearchQuery("");
              }}
              className="absolute top-2 right-2 text-red-500 text-xl font-bold"
            >
              &times;
            </button>

            <h2 className="text-lg font-semibold mb-4">
              Redeemed ${showHistoryModal} Codes
            </h2>

            <input
              type="text"
              placeholder="Search code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                fetchRedeemedCodes(showHistoryModal, 1, e.target.value);
              }}
              className="border p-2 rounded w-full mb-4"
            />

            <div className="grid gap-2 mb-4">
              {redeemedCodes.map((code, index) => (
                <div
                  key={index}
                  className={`px-4 py-2 rounded border ${
                    code.toLowerCase().includes(searchQuery.toLowerCase())
                      ? "bg-yellow-100 font-semibold"
                      : "bg-gray-100"
                  }`}
                >
                  {code}
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  redeemedPage > 1 &&
                  fetchRedeemedCodes(showHistoryModal, redeemedPage - 1, searchQuery)
                }
                disabled={redeemedPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                Page {redeemedPage} of {Math.ceil(redeemedTotal / 10)}
              </span>
              <button
                onClick={() =>
                  redeemedPage < Math.ceil(redeemedTotal / 10) &&
                  fetchRedeemedCodes(showHistoryModal, redeemedPage + 1, searchQuery)
                }
                disabled={redeemedPage >= Math.ceil(redeemedTotal / 10)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerDashboard;
