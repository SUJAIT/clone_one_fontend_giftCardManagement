/* eslint-disable no-unused-vars */
import { useState } from "react";
import Swal from "sweetalert2";

import axiosInstance from "../../axios/axios";

const FiveDollarInput = () => {
  const [codes, setCodes] = useState([""]);

  console.log(codes)
  const handleInputChange = (index, value) => {
    const parts = value.trim().split(/\s+/);

    if (parts.length > 1) {
      const newCodes = [...codes.slice(0, index), ...parts, ...codes.slice(index + 1)];
      setCodes(newCodes);
    } else {
      const updated = [...codes];
      updated[index] = value;
      setCodes(updated);
    }
  };

  const addNewField = () => {
    setCodes([...codes, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cleanedCodes = codes.map((code) => code.trim()).filter((code) => code.length > 0);

    if (cleanedCodes.length === 0) {
      Swal.fire("Oops!", "Please enter at least one code.", "error");
      return;
    }

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, submit it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosInstance.post("/gift-card/upload", {
            codes: cleanedCodes,
            amount: 5,
          });
          Swal.fire("Submitted!", "Your codes have been uploaded.", "success");
          setCodes([]);
        } catch (error) {
          Swal.fire("Error", error.response?.data?.message || "Upload failed.", "error");
        }
      }
    });
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-6 bg-white rounded-xl shadow-md mt-6">
      <h2 className="text-xl font-semibold text-green-800 mb-4">
        5$ Apple Gift Card Code Upload
      </h2>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {codes.map((code, index) => (
          <input
            key={index}
            type="text"
            placeholder={`Enter code #${index + 1}`}
            value={code}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-700"
          />
        ))}

        <div className="flex justify-between items-center">
          <button
            type="button"
            onClick={addNewField}
            className="bg-green-700 text-white px-4 py-2 rounded-md font-medium hover:bg-green-800 transition"
          >
            + Add Another Code
          </button>

          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md font-semibold hover:opacity-90 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default FiveDollarInput;