// /* eslint-disable no-unused-vars */
// import { useEffect, useState } from "react";
// import Swal from "sweetalert2";
// import axiosInstance from "../axios/axios";

// const AdminDashboard = () => {
//   const [buyerEmails, setBuyerEmails] = useState([]);
//   const [selectedEmail, setSelectedEmail] = useState("");
//   const [twoDollarReduce, setTwoDollarReduce] = useState("");
//   const [fiveDollarReduce, setFiveDollarReduce] = useState("");

//   useEffect(() => {
//     const fetchEmails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         const res = await axiosInstance.get("/gift-card/buyer-emails", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setBuyerEmails(res.data.buyers);
//       } catch (err) {
//         Swal.fire("Error", "Failed to fetch buyer emails", "error");
//       }
//     };

//     fetchEmails();
//   }, []);

//   const handleSubmit = async () => {
//     if (!selectedEmail) {
//       return Swal.fire("Error", "Please select a buyer email", "warning");
//     }

//     try {
//       const token = localStorage.getItem("token");
//       await axiosInstance.post(
//         "/gift-card/reduce-dues",
//         {
//           email: selectedEmail,
//           twoDollarReduce: Number(twoDollarReduce) || 0,
//           fiveDollarReduce: Number(fiveDollarReduce) || 0,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       Swal.fire("Success", "Dues reduced successfully", "success");

//       // reset
//       setSelectedEmail("");
//       setTwoDollarReduce("");
//       setFiveDollarReduce("");
//     } catch {
//       Swal.fire("Error", "Failed to reduce dues", "error");
//     }
//   };

//   return (
//     <div className="mt-6 p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl">
//       <h2 className="text-xl font-semibold mb-4">Admin Dues Reduction Panel</h2>

//       <div className="mb-4">
//         <label className="block text-sm font-medium text-gray-700 mb-1">Select Buyer</label>
//         <select
//           value={selectedEmail}
//           onChange={(e) => setSelectedEmail(e.target.value)}
//           className="w-full px-3 py-2 border rounded"
//         >
//           <option value="">-- Choose an Email --</option>
//           {buyerEmails.map((b, idx) => (
//             <option key={idx} value={b.email}>{b.email}</option>
//           ))}
//         </select>
//       </div>

//       <div className="mb-4">
//         <label className="block text-sm">Reduce $2 Amount</label>
//         <input
//           type="number"
//           value={twoDollarReduce}
//           onChange={(e) => setTwoDollarReduce(e.target.value)}
//           className="w-full px-3 py-2 border rounded"
//         />
//       </div>

//       <div className="mb-6">
//         <label className="block text-sm">Reduce $5 Amount</label>
//         <input
//           type="number"
//           value={fiveDollarReduce}
//           onChange={(e) => setFiveDollarReduce(e.target.value)}
//           className="w-full px-3 py-2 border rounded"
//         />
//       </div>

//       <button
//         onClick={handleSubmit}
//         className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition"
//       >
//         Submit
//       </button>
//     </div>
//   );
// };

// export default AdminDashboard;




/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axiosInstance from "../axios/axios";

const AdminDashboard = () => {
  const [buyerEmails, setBuyerEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState("");
  const [twoDollarReduce, setTwoDollarReduce] = useState("");
  const [fiveDollarReduce, setFiveDollarReduce] = useState("");
  const [duesDetails, setDuesDetails] = useState(null);

  useEffect(() => {
    const fetchEmails = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get("/gift-card/buyer-emails", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBuyerEmails(res.data.buyers);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch buyer emails", "error");
      }
    };

    fetchEmails();
  }, []);

  useEffect(() => {
    const fetchDues = async () => {
      if (!selectedEmail) return;
      try {
        const token = localStorage.getItem("token");
        const res = await axiosInstance.get(`/gift-card/dues-specific/${selectedEmail}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDuesDetails(res.data.dues);
      } catch (err) {
        Swal.fire("Error", "Failed to fetch dues info", "error");
      }
    };

    fetchDues();
  }, [selectedEmail]);

  const handleSubmit = async () => {
    if (!selectedEmail) {
      return Swal.fire("Error", "Please select a buyer email", "warning");
    }

    try {
      const token = localStorage.getItem("token");
      await axiosInstance.post(
        "/gift-card/reduce-dues",
        {
          email: selectedEmail,
          twoDollarReduce: Number(twoDollarReduce) || 0,
          fiveDollarReduce: Number(fiveDollarReduce) || 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire("Success", "Dues reduced successfully", "success");
      setTwoDollarReduce("");
      setFiveDollarReduce("");

      // Refresh dues info
      const res = await axiosInstance.get(`/gift-card/dues-specific/${selectedEmail}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDuesDetails(res.data.dues);
    } catch {
      Swal.fire("Error", "Failed to reduce dues", "error");
    }
  };

  return (
    <div className="mt-6 p-6 max-w-xl mx-auto bg-white shadow-md rounded-xl">
      <h2 className="text-xl font-semibold mb-4">Admin Dues Reduction Panel</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Buyer</label>
        <select
          value={selectedEmail}
          onChange={(e) => setSelectedEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        >
          <option value="">-- Choose an Email --</option>
          {buyerEmails.map((b, idx) => (
            <option key={idx} value={b.email}>{b.email}</option>
          ))}
        </select>
      </div>

      {duesDetails && (
        <div className="mb-6 p-4 border rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Buyer Gift Card Redeem Details</h4>
          <p>2$ Redeemed: ৳ {duesDetails.twoDollarTotal || 0}</p>
          <p>5$ Redeemed: ৳ {duesDetails.fiveDollarTotal || 0}</p>
          <p>Total Dues: ৳ {(duesDetails.twoDollarTotal || 0) + (duesDetails.fiveDollarTotal || 0)}</p>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm">Reduce $2 Amount</label>
        <input
          type="number"
          value={twoDollarReduce}
          onChange={(e) => setTwoDollarReduce(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm">Reduce $5 Amount</label>
        <input
          type="number"
          value={fiveDollarReduce}
          onChange={(e) => setFiveDollarReduce(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="bg-green-700 text-white px-6 py-2 rounded hover:bg-green-800 transition"
      >
        Submit
      </button>
    </div>
  );
};

export default AdminDashboard;
