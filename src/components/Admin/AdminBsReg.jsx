import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { Download, Trash2, Filter, Users } from "lucide-react";

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function AdminBsReg() {
  const [registrations, setRegistrations] = useState([]);
  const [filterRegion, setFilterRegion] = useState("All");
  const [filterGroup, setFilterGroup] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const fetchRegistrations = async () => {
    try {
      const res = await axios.get(`${SERVER_URL}/api/bs`);
      setRegistrations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this registration?")) return;
    try {
      await axios.delete(`${SERVER_URL}/api/bs/${id}`);
      fetchRegistrations();
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // ✅ Filter Logic
  const filteredData = registrations.filter((reg) => {
    const matchesRegion = filterRegion === "All" || reg.region === filterRegion;
    const matchesGroup = filterGroup === "" || reg.groupName.toLowerCase().includes(filterGroup.toLowerCase());
    return matchesRegion && matchesGroup;
  });

  // ✅ Export PDF Logic (Based on Filters)
  const exportPDF = () => {
    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text(`BS Registration List - ${filterRegion}`, 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 28);
    doc.text(`Total Records: ${filteredData.length}`, 14, 34);

    // Table
    const tableColumn = ["Name", "Phone", "Gender", "Region", "Group", "Residence"];
    const tableRows = [];

    filteredData.forEach((reg) => {
      const rowData = [
        reg.fullName,
        reg.phoneNumber,
        reg.gender,
        reg.region,
        reg.groupName,
        reg.catchmentArea,
      ];
      tableRows.push(rowData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [22, 101, 52] }, // Green-800 color
    });

    doc.save(`BS_Registrations_${filterRegion}.pdf`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-3xl font-bold text-green-900 flex items-center gap-2">
             <Users /> BS Registrations
           </h1>
           <p className="text-gray-600">Total Registered: {registrations.length}</p>
        </div>

        {/* Filters & Export */}
        <div className="flex flex-wrap gap-3 items-center bg-white p-3 rounded-lg shadow-sm">
          <div className="flex items-center gap-2 text-gray-600">
             <Filter size={18} />
             <span className="font-bold">Filter:</span>
          </div>
          
          <select 
            value={filterRegion} 
            onChange={(e) => setFilterRegion(e.target.value)} 
            className="p-2 border rounded focus:ring-green-500 focus:ring-2 outline-none text-sm"
          >
            <option value="All">All Regions</option>
            <option value="In Campus">In Campus</option>
            <option value="Diaspora">Diaspora</option>
            <option value="Njokerio">Njokerio</option>
            <option value="Ahero">Ahero</option>
          </select>

          <input 
            type="text" 
            placeholder="Search Group Name..." 
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="p-2 border rounded focus:ring-green-500 focus:ring-2 outline-none text-sm"
          />

          <button 
            onClick={exportPDF}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition font-bold shadow"
          >
            <Download size={18} /> PDF
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-green-800 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6">Name</th>
              <th className="py-3 px-6">Phone</th>
              <th className="py-3 px-6">Year</th>
              <th className="py-3 px-6">Region</th>
              <th className="py-3 px-6">Group</th>
              <th className="py-3 px-6">Residence</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {loading ? (
                <tr><td colSpan="7" className="text-center py-10">Loading...</td></tr>
            ) : filteredData.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-10">No records found matching filters.</td></tr>
            ) : (
                filteredData.map((reg) => (
                <tr key={reg._id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 font-medium text-gray-800">{reg.fullName}</td>
                    <td className="py-3 px-6">{reg.phoneNumber}</td>
                    <td className="py-3 px-6">{reg.yearOfStudy}</td>
                    <td className="py-3 px-6"><span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-bold">{reg.region}</span></td>
                    <td className="py-3 px-6 font-bold">{reg.groupName}</td>
                    <td className="py-3 px-6">{reg.catchmentArea}</td>
                    <td className="py-3 px-6 text-center">
                        <button onClick={() => handleDelete(reg._id)} className="text-red-500 hover:text-red-700 transform hover:scale-110 transition">
                            <Trash2 size={18} />
                        </button>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminBsReg;