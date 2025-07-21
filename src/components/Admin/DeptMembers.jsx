// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Loader, Search } from "lucide-react";

// const SERVER_URL = process.env.REACT_APP_SERVER_URL;

// function DeptMembers() {
//   const [members, setMembers] = useState([]);
//   const [filteredMembers, setFilteredMembers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [departmentFilter, setDepartmentFilter] = useState("");

//   // Fetch all department join submissions
//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const res = await axios.get(`${SERVER_URL}/api/joinDepartment`);
//         setMembers(res.data);
//         setFilteredMembers(res.data);
//       } catch (err) {
//         console.error("Failed to fetch department members", err);
//         setError("Something went wrong. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMembers();
//   }, []);

//   // Delete a member
//   const handleDelete = async (id) => {
//     const confirm = window.confirm("Are you sure you want to delete this entry?");
//     if (!confirm) return;

//     try {
//       await axios.delete(`${SERVER_URL}/api/joinDepartment/${id}`);
//       setMembers((prev) => prev.filter((member) => member._id !== id));
//       setFilteredMembers((prev) => prev.filter((member) => member._id !== id));
//     } catch (err) {
//       console.error("Delete failed", err);
//       alert("Failed to delete. Please try again.");
//     }
//   };

//   // Filter members
//   useEffect(() => {
//     const filtered = members.filter((member) => {
//       const matchName = member.fullName.toLowerCase().includes(searchTerm.toLowerCase());
//       const matchDept = departmentFilter ? member.department === departmentFilter : true;
//       return matchName && matchDept;
//     });
//     setFilteredMembers(filtered);
//   }, [searchTerm, departmentFilter, members]);

//  const departments = [
//   "Secretary’s Office",
//   "Class Sabbath School",
//   "Treasury Department",
//   "Deaconry Department",
//   "Audit Department",
//   "Sabbath School Department",
//   "Personal Ministry",
//   "Children Ministry",
//   "Public Campus Ministries",
//   "Interest Coordination",
//   "Church Development Committee",
//   "Stewardship Department",
//   "Social, Health & Temperance Department",
//   "Publishing Department",
//   "Music Department",
//   "Transport & Public Address Department",
//   "Communication & Publicity Department",
//   "Prayer and Fellowship Department",
//   "Master Guide Department",
//   "Medical Missionary Department",
//   "Voice of Prophecy Department",
//   "Charity Department",
//   "Adventist Muslim Relations Department",
//   "ALO & AMO Department",
//   "EUSDA Chaplaincy Office"
// ];


//   return (
//     <div className="p-6 max-w-6xl mx-auto ">
//       <h1 className="text-3xl font-bold text-center text-green-700 mb-6">
//         🙋‍♂️ Department Members
//       </h1>

//       {/* Search and filter */}
//       <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
//         <div className="flex items-center w-full sm:w-1/2 border border-gray-300 rounded px-2">
//           <Search className="text-gray-400" size={20} />
//           <input
//             type="text"
//             placeholder="Search by name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full p-2 outline-none"
//           />
//         </div>

//         <select
//           value={departmentFilter}
//           onChange={(e) => setDepartmentFilter(e.target.value)}
//           className="border border-gray-300 p-2 rounded w-full sm:w-1/3"
//         >
//           <option value="">All Departments</option>
//           {departments.map((dept) => (
//             <option key={dept} value={dept}>
//               {dept}
//             </option>
//           ))}
//         </select>
//       </div>

//       {loading ? (
//         <div className="flex items-center justify-center h-64 gap-3">
//           <Loader className="animate-spin text-green-600" size={40} />
//           <span className="text-gray-500 text-lg">Loading members...</span>
//         </div>
//       ) : error ? (
//         <p className="text-center text-red-500">{error}</p>
//       ) : filteredMembers.length === 0 ? (
//         <p className="text-center text-gray-600">No matching department members found.</p>
//       ) : (
//         <div className="overflow-x-auto shadow-md rounded-lg">
//           <table className="min-w-full bg-white border border-gray-200">
//             <thead className="bg-green-600 text-white">
//               <tr>
//                 <th className="py-3 px-4 text-left">Full Name</th>
//                 <th className="py-3 px-4 text-left">Email</th>
//                 <th className="py-3 px-4 text-left">Phone</th>
//                 <th className="py-3 px-4 text-left">Department</th>
//                 <th className="py-3 px-4 text-left">Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredMembers.map((member) => (
//                 <tr key={member._id} className="border-b hover:bg-gray-50">
//                   <td className="py-3 px-4">{member.fullName}</td>
//                   <td className="py-3 px-4">{member.email}</td>
//                   <td className="py-3 px-4">{member.phoneNumber}</td>
//                   <td className="py-3 px-4">{member.department}</td>
//                   <td className="py-3 px-4">
//                     <button
//                       onClick={() => handleDelete(member._id)}
//                       className="text-sm text-red-600 hover:underline"
//                     >
//                       Delete
//                     </button>
//                     {/* Optional: Edit button can be added here */}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// export default DeptMembers;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader, Search, FileDown } from "lucide-react";
import { CSVLink } from "react-csv";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function DeptMembers() {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");

  // Fetch data
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${SERVER_URL}/api/joinDepartment`);
        setMembers(res.data);
        setFilteredMembers(res.data);
      } catch (err) {
        console.error("Failed to fetch department members", err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // Delete member
  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this entry?");
    if (!confirm) return;
    try {
      await axios.delete(`${SERVER_URL}/api/joinDepartment/${id}`);
      setMembers((prev) => prev.filter((m) => m._id !== id));
      setFilteredMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err) {
      alert("Failed to delete. Please try again.");
    }
  };

  // Filter members
  useEffect(() => {
    const filtered = members.filter((m) => {
      const nameMatch = m.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      const deptMatch = departmentFilter ? m.department === departmentFilter : true;
      return nameMatch && deptMatch;
    });
    setFilteredMembers(filtered);
  }, [searchTerm, departmentFilter, members]);

  const departments = [
    "Secretary’s Office", "Class Sabbath School", "Treasury Department", "Deaconry Department",
    "Audit Department", "Sabbath School Department", "Personal Ministry", "Children Ministry",
    "Public Campus Ministries", "Interest Coordination", "Church Development Committee",
    "Stewardship Department", "Social, Health & Temperance Department", "Publishing Department",
    "Music Department", "Transport & Public Address Department", "Communication & Publicity Department",
    "Prayer and Fellowship Department", "Master Guide Department", "Medical Missionary Department",
    "Voice of Prophecy Department", "Charity Department", "Adventist Muslim Relations Department",
    "ALO & AMO Department", "EUSDA Chaplaincy Office"
  ];

  const csvHeaders = [
    { label: "Full Name", key: "fullName" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phoneNumber" },
    { label: "Department", key: "department" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold text-green-700">🙋‍♂️ Department Members</h1>

        <CSVLink
          headers={csvHeaders}
          data={filteredMembers}
          filename="eusda_department_members.csv"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          <FileDown size={18} />
          Export CSV
        </CSVLink>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div className="flex items-center w-full sm:w-1/2 border border-gray-300 rounded px-2">
          <Search className="text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 outline-none"
          />
        </div>

        <select
          value={departmentFilter}
          onChange={(e) => setDepartmentFilter(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-1/3"
        >
          <option value="">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64 gap-3">
          <Loader className="animate-spin text-green-600" size={40} />
          <span className="text-gray-500 text-lg">Loading members...</span>
        </div>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : filteredMembers.length === 0 ? (
        <p className="text-center text-gray-600">No matching department members found.</p>
      ) : (
        <div className="overflow-x-auto shadow-md rounded-lg">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Full Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">Department</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{member.fullName}</td>
                  <td className="py-3 px-4">{member.email}</td>
                  <td className="py-3 px-4">{member.phoneNumber}</td>
                  <td className="py-3 px-4">{member.department}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleDelete(member._id)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DeptMembers;
