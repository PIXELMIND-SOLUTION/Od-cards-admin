import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrash, FaEye } from "react-icons/fa";
import { BsFileEarmarkExcelFill } from "react-icons/bs";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { Modal, Button } from "react-bootstrap";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [searchField, setSearchField] = useState("name");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/getallusers");
      const users = res.data.users || [];
      setCustomers(users);
      setFilteredCustomers(users);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the user permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/users/deleteuser/${id}`);
        Swal.fire("Deleted!", "User has been deleted.", "success");
        fetchCustomers();
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  };

  const handleViewUser = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/user/${id}`);
      setSelectedUser(res.data.user);
    } catch (error) {
      console.error("View user error:", error);
      Swal.fire("Error", "Failed to fetch user details", "error");
    }
  };

  useEffect(() => {
    const filtered = customers.filter((c) => {
      const value = c[searchField]?.toLowerCase() || "";
      return value.includes(searchText.toLowerCase());
    });
    setFilteredCustomers(filtered);
  }, [searchText, searchField, customers]);

  const handleExport = () => {
    const exportData = filteredCustomers.map((customer, index) => ({
      SNo: index + 1,
      ID: customer._id,
      Name: customer.name,
      Email: customer.email,
      Mobile: customer.mobile,
      Location: customer.location,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Set column widths
    worksheet['!cols'] = [
      { wch: 6 },   // SNo
      { wch: 30 },  // ID
      { wch: 20 },  // Name
      { wch: 30 },  // Email
      { wch: 15 },  // Mobile
      { wch: 20 },  // Location
    ];

    // Center-align all cells
    const range = XLSX.utils.decode_range(worksheet['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
        if (!worksheet[cellRef]) continue;

        worksheet[cellRef].s = {
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Customers");

    // Export the file
    XLSX.writeFile(workbook, "customers.xlsx", { cellStyles: true });
  };

  return (
    <div className="container-fluid">
      <h2 className="mb-4">Customer List</h2>

      <div className="row mb-3 align-items-center">
        <div className="col-md-3">
          <select
            className="form-select"
            value={searchField}
            onChange={(e) => setSearchField(e.target.value)}
          >
            <option value="name">Search by Name</option>
            <option value="email">Search by Email</option>
            <option value="mobile">Search by Mobile</option>
            <option value="location">Search by Location</option>
          </select>
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder={`Enter ${searchField}`}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>
        <div className="col-md-4 text-end">
          <button className="btn btn-success" onClick={handleExport}>
            <BsFileEarmarkExcelFill className="me-2" /> Excel
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading customers...</p>
      ) : filteredCustomers.length === 0 ? (
        <p>No customers found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="bg-primary text-white">
              <tr>
                <th style={{ minWidth: "50px" }}>SNO</th>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c, index) => (
                <tr key={c._id}>
                  <td>{index + 1}</td>
                  <td>{c._id}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.mobile}</td>
                  <td>{c.location}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-info me-2"
                      onClick={() => handleViewUser(c._id)}
                      title="View"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(c._id)}
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for viewing user */}
      <Modal
        show={!!selectedUser}
        onHide={() => setSelectedUser(null)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser ? (
            <div>
              <p><strong>ID:</strong> {selectedUser._id}</p>
              <p><strong>Name:</strong> {selectedUser.name}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Mobile:</strong> {selectedUser.mobile}</p>
              <p><strong>Location:</strong> {selectedUser.location}</p>
            </div>
          ) : (
            <p>No user data available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={() => setSelectedUser(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Customers;
