/* eslint-disable no-unused-vars */
import { useEffect, useState, useContext } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../axios/axios";
import { AuthContext } from "../providers/AuthProvider";

const BuyerDashboard = () => {
  const { user } = useContext(AuthContext);

  const [stats, setStats] = useState({ twoDollarTotal: 0, fiveDollarTotal: 0 });
  const [counts, setCounts] = useState({ twoDollarCount: 0, fiveDollarCount: 0 });
  const [rates, setRates] = useState({ twoDollarRate: 0, fiveDollarRate: 0 });
  const [previous, setPrevious] = useState({ two: 0, five: 0 });
  const [total, setTotal] = useState({ two: 0, five: 0 });
  const [selectedType, setSelectedType] = useState(null);
  const [availableCodes, setAvailableCodes] = useState([]);
  const [revealedCodes, setRevealedCodes] = useState([]);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [inputError, setInputError] = useState("");
  const [claimQuantity, setClaimQuantity] = useState("");

  const [redeemedStats, setRedeemedStats] = useState({
    twoDollar: { count: 0, amount: 0 },
    fiveDollar: { count: 0, amount: 0 },
  });

  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [redeemedCodes, setRedeemedCodes] = useState([]);
  const [redeemedTotal, setRedeemedTotal] = useState(0);
  const [redeemedPage, setRedeemedPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const duesRes = await axiosInstance.get("/gift-card/dues-specific", { headers: { Authorization: `Bearer ${token}` } });
      const countRes = await axiosInstance.get("/gift-card/stats");
      const fullDuesRes = await axiosInstance.get("/gift-card/full-dues", { headers: { Authorization: `Bearer ${token}` } });
      setStats(duesRes.data.dues);
      setCounts(countRes.data);
      setRates({ twoDollarRate: countRes.data.twoDollarRate, fiveDollarRate: countRes.data.fiveDollarRate });
      setPrevious(fullDuesRes.data.previous);
      setTotal(fullDuesRes.data.total);
    } catch {
      Swal.fire("Error", "Failed to load dashboard data", "error");
    }
  };

  const fetchRedeemedSummary = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get("/gift-card/redeemed-summary", { headers: { Authorization: `Bearer ${token}` } });
      setRedeemedStats(res.data);
    } catch (err) {
      console.error("Redeemed Summary Load Failed", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchRedeemedSummary();
    }
  }, [user]);

  const askClaimQuantity = (amount) => {
    setSelectedType(amount);
    setClaimQuantity("");
    setAvailableCodes([]);
    setRevealedCodes([]);
    setShowCodeModal(false);
    setInputError("");
  };

  const handleClaimQuantityBased = async () => {
    const quantity = parseInt(claimQuantity);
    if (!quantity || quantity < 1) {
      return setInputError("Enter a valid number");
    }
    setInputError("");

    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/gift-card/available/${selectedType}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.codes.length < quantity) {
        return setInputError(`Only ${res.data.codes.length} codes available`);
      }

      const selected = res.data.codes.slice(0, quantity);

      await axiosInstance.post(
        "/gift-card/claim",
        { codes: selected },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setAvailableCodes(selected);
      setRevealedCodes(Array(selected.length).fill(false));
      setShowCodeModal(true);
      await fetchDashboardData();
      await fetchRedeemedSummary();
    } catch {
      Swal.fire("Error", "Claim failed", "error");
    }
  };

  const revealAllCodes = () => setRevealedCodes(Array(availableCodes.length).fill(true));

  const copyAllCodes = () => {
    const revealed = availableCodes.filter((_, i) => revealedCodes[i]);
    if (revealed.length > 0) {
      navigator.clipboard.writeText(revealed.join(" "));
      Swal.fire("Copied All", "All revealed codes copied", "success");
    }
  };

  const resetAll = () => {
    setSelectedType(null);
    setClaimQuantity("");
    setAvailableCodes([]);
    setRevealedCodes([]);
    setShowCodeModal(false);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    Swal.fire("Copied", text, "success");
  };

  const fetchRedeemedCodes = async (type, page = 1, search = "") => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/gift-card/claimed-history?type=${type}&page=${page}&limit=10&search=${search}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
      {/* Claim Card Options */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div onClick={() => askClaimQuantity(2)} className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50">
          <h3 className="text-sm text-gray-500">$2 Cards</h3>
          <p className="text-3xl font-bold text-green-700">{counts.twoDollarCount}</p>
          <p className="text-sm mt-1 text-gray-400">৳ {rates.twoDollarRate}</p>
        </div>

        <div onClick={() => askClaimQuantity(5)} className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50">
          <h3 className="text-sm text-gray-500">$5 Cards</h3>
          <p className="text-3xl font-bold text-blue-700">{counts.fiveDollarCount}</p>
          <p className="text-sm mt-1 text-gray-400">৳ {rates.fiveDollarRate}</p>
        </div>
      </div>

      {/* Quantity Input */}
      {selectedType && !showCodeModal && (
        <div className="bg-white p-6 rounded-xl shadow-md border mt-4">
          <h2 className="text-lg font-semibold mb-3">Claim ${selectedType} Codes</h2>
          <input
            type="number"
            value={claimQuantity}
            onChange={(e) => setClaimQuantity(e.target.value)}
            className="w-full border p-2 rounded mb-2"
            placeholder="Enter quantity"
            min={1}
          />
          {inputError && <p className="text-red-500 text-sm mb-2">{inputError}</p>}
          <button onClick={handleClaimQuantityBased} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Claim Codes
          </button>
        </div>
      )}

      {/* Claimed Code Modal */}
      {showCodeModal && (
        <div className="bg-white p-6 rounded-xl shadow-md border mt-6">
          <h2 className="text-lg font-semibold mb-4">Your Claimed Codes</h2>
          <div className="flex justify-between mb-4">
            <div className="flex gap-4">
              <button onClick={revealAllCodes} className="text-sm text-blue-600 hover:underline">Reveal All</button>
              <button onClick={copyAllCodes} className="text-sm text-green-600 hover:underline">Copy All</button>
            </div>
            <button onClick={resetAll} className="text-sm text-red-600 hover:underline">Close</button>
          </div>
          <div className="grid gap-2 max-h-60 overflow-y-auto mb-4">
            {availableCodes.map((code, index) => (
              <div key={index} className="flex justify-between items-center border px-3 py-2 rounded-md">
                <p className="text-sm">{revealedCodes[index] ? code : "••••••••••••"}</p>
                <div className="flex gap-3">
                  {!revealedCodes[index] && (
                    <button onClick={() => {
                      const updated = [...revealedCodes];
                      updated[index] = true;
                      setRevealedCodes(updated);
                    }} className="text-xs text-blue-500 hover:underline">Reveal</button>
                  )}
                  {revealedCodes[index] && (
                    <button onClick={() => copyToClipboard(code)} className="text-xs text-green-600 hover:underline">Copy</button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={() => askClaimQuantity(selectedType)} className="bg-yellow-500 text-white px-6 py-2 rounded-md font-medium hover:bg-yellow-600 transition">
              Redeem Again
            </button>
          </div>
        </div>
      )}

      {/* Summary */}
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

      {/* Redeemed Cards Summary */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div onClick={() => openRedeemedModal(2)} className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50">
          <h3 className="text-sm text-gray-500">$2 Redeemed Cards</h3>
          <p className="text-3xl font-bold text-green-700">{redeemedStats.twoDollar.count}</p>
          <p className="text-sm mt-1 text-gray-400">৳ {redeemedStats.twoDollar.amount}</p>
        </div>
        <div onClick={() => openRedeemedModal(5)} className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50">
          <h3 className="text-sm text-gray-500">$5 Redeemed Cards</h3>
          <p className="text-3xl font-bold text-blue-700">{redeemedStats.fiveDollar.count}</p>
          <p className="text-sm mt-1 text-gray-400">৳ {redeemedStats.fiveDollar.amount}</p>
        </div>
      </div>

      {/* History Modal */}
      {showHistoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-start z-50 pt-20">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6 relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => { setShowHistoryModal(null); setRedeemedCodes([]); setSearchQuery(""); }} className="absolute top-2 right-2 text-red-500 text-xl font-bold">&times;</button>
            <h2 className="text-lg font-semibold mb-4">Redeemed ${showHistoryModal} Codes</h2>
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
                  className={`px-4 py-2 rounded border ${code.toLowerCase().includes(searchQuery.toLowerCase()) ? "bg-yellow-100 font-semibold" : "bg-gray-100"}`}
                >
                  {code}
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center">
              <button
                onClick={() => redeemedPage > 1 && fetchRedeemedCodes(showHistoryModal, redeemedPage - 1, searchQuery)}
                disabled={redeemedPage === 1}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>Page {redeemedPage} of {Math.ceil(redeemedTotal / 10)}</span>
              <button
                onClick={() => redeemedPage < Math.ceil(redeemedTotal / 10) && fetchRedeemedCodes(showHistoryModal, redeemedPage + 1, searchQuery)}
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