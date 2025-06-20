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
  const [claimQuantity, setClaimQuantity] = useState("");
  const [inputError, setInputError] = useState("");
  const [availableCodes, setAvailableCodes] = useState([]);
  const [revealedCodes, setRevealedCodes] = useState([]);
  const [showCodeModal, setShowCodeModal] = useState(false);

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

  const handleClaim = async () => {
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setAvailableCodes(selected);
      setRevealedCodes(Array(selected.length).fill(false));
      setShowCodeModal(true);
      fetchData();
    } catch {
      Swal.fire("Error", "Claim failed", "error");
    }
  };

  const askClaimQuantity = (amount) => {
    setSelectedType(amount);
    setClaimQuantity("");
    setAvailableCodes([]);
    setRevealedCodes([]);
    setShowCodeModal(false);
  };

  const revealAllCodes = () => {
    setRevealedCodes(Array(availableCodes.length).fill(true));
  };

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => askClaimQuantity(2)}
          className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-sm text-gray-500">$2 Cards</h3>
          <p className="text-3xl font-bold text-green-700">{counts.twoDollarCount}</p>
          <p className="text-sm mt-1 text-gray-400">৳ {rates.twoDollarRate}</p>
        </div>

        <div
          onClick={() => askClaimQuantity(5)}
          className="bg-white rounded-xl shadow p-6 text-center cursor-pointer hover:bg-gray-50"
        >
          <h3 className="text-sm text-gray-500">$5 Cards</h3>
          <p className="text-3xl font-bold text-blue-700">{counts.fiveDollarCount}</p>
          <p className="text-sm mt-1 text-gray-400">৳ {rates.fiveDollarRate}</p>
        </div>
      </div>

      {selectedType && !showCodeModal && (
        <div className="bg-white p-6 rounded-xl shadow-md border mt-4">
          <h2 className="text-lg font-semibold mb-3">
            Claim ${selectedType} Codes
          </h2>

          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-1">How many codes?</label>
            <input
              type="number"
              value={claimQuantity}
              onChange={(e) => setClaimQuantity(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter quantity"
              min={1}
            />
            {inputError && <p className="text-red-500 text-sm mt-1">{inputError}</p>}
          </div>

          <button
            onClick={handleClaim}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Claim Codes
          </button>
        </div>
      )}

      {showCodeModal && (
        <div className="bg-white p-6 rounded-xl shadow-md border mt-6">
          <h2 className="text-lg font-semibold mb-4">Your Claimed Codes</h2>

          <div className="flex justify-between mb-4">
            <div className="flex gap-4">
              <button
                onClick={revealAllCodes}
                className="text-sm text-blue-600 hover:underline"
              >
                Reveal All
              </button>
              <button
                onClick={copyAllCodes}
                className="text-sm text-green-600 hover:underline"
              >
                Copy All
              </button>
            </div>
            <button
              onClick={resetAll}
              className="text-sm text-red-600 hover:underline"
            >
              Close
            </button>
          </div>

          <div className="grid gap-2 max-h-60 overflow-y-auto mb-4">
            {availableCodes.map((code, index) => (
              <div
                key={index}
                className="flex justify-between items-center border px-3 py-2 rounded-md"
              >
                <p className="text-sm">
                  {revealedCodes[index] ? code : "••••••••••••"}
                </p>
                <div className="flex gap-3">
                  {!revealedCodes[index] && (
                    <button
                      onClick={() => {
                        const updated = [...revealedCodes];
                        updated[index] = true;
                        setRevealedCodes(updated);
                      }}
                      className="text-xs text-blue-500 hover:underline"
                    >
                      Reveal
                    </button>
                  )}
                  {revealedCodes[index] && (
                    <button
                      onClick={() => copyToClipboard(code)}
                      className="text-xs text-green-600 hover:underline"
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
             onClick={() => askClaimQuantity(selectedType)}
              className="bg-yellow-500 text-white px-6 py-2 rounded-md font-medium hover:bg-yellow-600 transition"
            >
              Redeem Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DollarBuyPage;
