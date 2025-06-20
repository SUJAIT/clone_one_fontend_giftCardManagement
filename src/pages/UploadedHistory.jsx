/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axiosInstance from "../axios/axios";

const AdminUploadHistory = () => {
  const [codes, setCodes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedAmount, setSelectedAmount] = useState(2);

  const fetchCodes = async (amount = selectedAmount, pageNum = 1, searchText = search) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axiosInstance.get(`/gift-card/uploaded-history?amount=${amount}&page=${pageNum}&limit=10&search=${searchText}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCodes(res.data.codes);
      setTotal(res.data.total);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch uploaded history", err);
    }
  };

  useEffect(() => {
    fetchCodes(selectedAmount, 1, "");
  }, [selectedAmount]);

  const handleAmountChange = (amount) => {
    setSelectedAmount(amount);
    setSearch("");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Uploaded ${selectedAmount} Codes</h2>

      <div className="flex gap-4 mb-4">
        <button
          onClick={() => handleAmountChange(2)}
          className={`px-4 py-2 rounded ${selectedAmount === 2 ? "bg-green-500 text-white" : "bg-gray-200"}`}
        >
          $2 Cards
        </button>
        <button
          onClick={() => handleAmountChange(5)}
          className={`px-4 py-2 rounded ${selectedAmount === 5 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          $5 Cards
        </button>
      </div>

      <input
        type="text"
        placeholder="Search code..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          fetchCodes(selectedAmount, 1, e.target.value);
        }}
        className="border p-2 rounded w-full mb-4"
      />

      {codes.length === 0 ? (
        <p className="text-gray-600">No codes found.</p>
      ) : (
        <ul className="mb-4 space-y-2">
          {codes.map((code, idx) => (
            <li key={idx} className="border rounded px-3 py-2 text-sm bg-gray-100">
              {code}
            </li>
          ))}
        </ul>
      )}

      <div className="flex justify-between items-center">
        <button
          onClick={() => page > 1 && fetchCodes(selectedAmount, page - 1, search)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {page} of {Math.max(1, Math.ceil(total / 10))}</span>
        <button
          onClick={() => page < Math.ceil(total / 10) && fetchCodes(selectedAmount, page + 1, search)}
          disabled={page >= Math.ceil(total / 10)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AdminUploadHistory;
