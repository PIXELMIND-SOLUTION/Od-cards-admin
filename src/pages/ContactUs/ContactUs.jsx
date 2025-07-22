import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaTrash, FaEye } from 'react-icons/fa';

const ContactUs = () => {
  const [contactData, setContactData] = useState({
    phone: '',
    email: '',
    address: ''
  });
  const [loadingContact, setLoadingContact] = useState(true);
  const [currentContactId, setCurrentContactId] = useState(null);

  const [submissions, setSubmissions] = useState([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 10;

  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchContactData();
    fetchSubmissions();
  }, []);

  const fetchContactData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contactus/get');
      if (response.data.data.length > 0) {
        const contact = response.data.data[0];
        setContactData({
          phone: contact.phone,
          email: contact.email,
          address: contact.address
        });
        setCurrentContactId(contact._id);
      }
      setLoadingContact(false);
    } catch (error) {
      console.error('Error fetching contact data:', error);
      setLoadingContact(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/contactus/submissions');
      setSubmissions(response.data.data);
      setLoadingSubmissions(false);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      setLoadingSubmissions(false);
    }
  };

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData(prev => ({ ...prev, [name]: value }));
  };

  const submitContactForm = async (e) => {
    e.preventDefault();
    try {
      if (currentContactId) {
        await axios.put(`http://localhost:5000/api/contactus/update/${currentContactId}`, contactData);
        Swal.fire('Success!', 'Contact information updated successfully.', 'success');
      } else {
        await axios.post('http://localhost:5000/api/contactus/create', contactData);
        Swal.fire('Success!', 'Contact information created successfully.', 'success');
      }
      fetchContactData();
    } catch (error) {
      console.error('Error saving contact:', error);
      Swal.fire('Error!', 'Failed to save contact information.', 'error');
    }
  };

  const deleteSubmission = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/contactus/submissions/${id}`);
        Swal.fire('Deleted!', 'Submission has been deleted.', 'success');
        fetchSubmissions();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete submission.', 'error');
      }
    }
  };

  const indexOfLast = currentPage * submissionsPerPage;
  const indexOfFirst = indexOfLast - submissionsPerPage;
  const currentSubmissions = submissions.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(submissions.length / submissionsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getPageNumbers = () => {
    const pages = [];
    const delta = 1;

    const left = currentPage - delta;
    const right = currentPage + delta;

    const range = [];
    const total = totalPages;

    for (let i = 1; i <= total; i++) {
      if (i === 1 || i === total || (i >= left && i <= right)) {
        range.push(i);
      }
    }

    let prev = 0;
    for (let i of range) {
      if (prev && i - prev > 1) {
        pages.push('...');
      }
      pages.push(i);
      prev = i;
    }

    return pages;
  };

  const openModal = (submission) => {
    setSelectedSubmission(submission);
    const modal = new window.bootstrap.Modal(document.getElementById('messageModal'));
    modal.show();
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h4 className="mb-0">Contact Information</h4>
            </div>
            <div className="card-body">
              {loadingContact ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={submitContactForm}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={contactData.email}
                      onChange={handleContactChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="phone" className="form-label">Phone</label>
                    <input
                      type="tel"
                      className="form-control"
                      id="phone"
                      name="phone"
                      value={contactData.phone}
                      onChange={handleContactChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address</label>
                    <textarea
                      className="form-control"
                      id="address"
                      name="address"
                      rows="3"
                      value={contactData.address}
                      onChange={handleContactChange}
                      required
                    />
                  </div>

                  <div className="d-flex justify-content-end">
                    <button type="submit" className="btn btn-primary">Save Contact Info</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4" />
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h4 className="mb-0">Contact Form Submissions</h4>
            </div>
            <div className="card-body">
              {loadingSubmissions ? (
                <div className="d-flex justify-content-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th>Message</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentSubmissions.map((submission) => (
                          <tr key={submission._id}>
                            <td>{submission.name}</td>
                            <td>{submission.email}</td>
                            <td>{submission.number}</td>
                            <td>
                              {submission.message.length > 20
                                ? submission.message.substring(0, 20) + '...'
                                : submission.message}
                            </td>
                            <td>{submission.formattedDate}</td>
                            <td>{submission.formattedTime}</td>
                            <td>
                              <button
                                className="btn btn-sm btn-outline-info me-2"
                                onClick={() => openModal(submission)}
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => deleteSubmission(submission._id)}
                                className="btn btn-sm btn-outline-danger"
                              >
                                <FaTrash />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Custom Pagination */}
                  <nav className="mt-3">
                    <ul className="pagination justify-content-center mb-0">
                      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => goToPage(currentPage - 1)}>Prev</button>
                      </li>

                      {getPageNumbers().map((page, index) =>
                        page === '...' ? (
                          <li className="page-item disabled" key={index}>
                            <span className="page-link">...</span>
                          </li>
                        ) : (
                          <li className={`page-item ${page === currentPage ? 'active' : ''}`} key={index}>
                            <button className="page-link" onClick={() => goToPage(page)}>{page}</button>
                          </li>
                        )
                      )}

                      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button className="page-link" onClick={() => goToPage(currentPage + 1)}>Next</button>
                      </li>
                    </ul>
                  </nav>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="messageModal" tabIndex="-1" aria-labelledby="messageModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="messageModalLabel">Submission Details</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              {selectedSubmission && (
                <>
                  <p><strong>Name:</strong> {selectedSubmission.name}</p>
                  <p><strong>Email:</strong> {selectedSubmission.email}</p>
                  <p><strong>Phone:</strong> {selectedSubmission.number}</p>
                  <p><strong>Date:</strong> {selectedSubmission.formattedDate}</p>
                  <p><strong>Time:</strong> {selectedSubmission.formattedTime}</p>
                  <p><strong>Message:</strong><br /> {selectedSubmission.message}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
