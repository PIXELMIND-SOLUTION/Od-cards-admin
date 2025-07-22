import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from "react-icons/fa";

const API_URL = "http://localhost:5000/api/admin";

const Faqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [faqImage, setFaqImage] = useState(null);
  const [newFaqs, setNewFaqs] = useState([{ question: "", answer: "" }]);
  const [editingFaq, setEditingFaq] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      const res = await axios.get(`${API_URL}/getallfaqs`);
      setFaqs(res.data.data);
      setFaqImage(res.data.faqImage || null);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch FAQs", error);
      setLoading(false);
    }
  };

  const handleFaqChange = (index, field, value) => {
    const updatedFaqs = [...newFaqs];
    updatedFaqs[index][field] = value;
    setNewFaqs(updatedFaqs);
  };

  const addMoreFaq = () => {
    setNewFaqs([...newFaqs, { question: "", answer: "" }]);
  };

  const removeFaqInput = (index) => {
    const updated = [...newFaqs];
    updated.splice(index, 1);
    setNewFaqs(updated);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("faqs", JSON.stringify(newFaqs));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.post(`${API_URL}/createfaq`, formData);
      Swal.fire("Success", "FAQs created successfully", "success");
      setNewFaqs([{ question: "", answer: "" }]);
      setImageFile(null);
      fetchFAQs();
    } catch (error) {
      console.error("Error creating FAQ", error);
      Swal.fire("Error", "Failed to create FAQ", "error");
    }
  };

  const handleEdit = (faq) => {
    setEditingFaq(faq);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API_URL}/updatefaq/${editingFaq._id}`, {
        question: editingFaq.question,
        answer: editingFaq.answer,
      });
      Swal.fire("Updated", "FAQ updated successfully", "success");
      setEditingFaq(null);
      fetchFAQs();
    } catch (error) {
      console.error("Update failed", error);
      Swal.fire("Error", "Failed to update FAQ", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You will not be able to recover this FAQ!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/deletefaq/${id}`);
        Swal.fire("Deleted!", "FAQ has been deleted.", "success");
        fetchFAQs();
      } catch (error) {
        console.error("Delete failed", error);
        Swal.fire("Error", "Failed to delete FAQ", "error");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      await axios.delete(`${API_URL}/faq-image`);
      Swal.fire("Deleted", "FAQ image removed", "success");
      fetchFAQs();
    } catch (error) {
      Swal.fire("Error", "Failed to delete image", "error");
    }
  };

  return (
    <div className="container py-4">
      <h2>Manage FAQs</h2>

      {/* Display Image */}
      {faqImage && (
        <div className="mb-3">
          <img src={`http://localhost:5000${faqImage}`} alt="FAQ Visual" style={{ maxWidth: "200px" }} />
          <button className="btn btn-sm btn-danger ms-3" onClick={handleDeleteImage}>
            Delete Image
          </button>
        </div>
      )}

      {/* Image Upload */}
      <div className="mb-3">
        <label className="form-label">Upload FAQ Image:</label>
        <input
          type="file"
          className="form-control"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
      </div>

      {/* Add FAQs */}
      <h5>Add New FAQs</h5>
      {newFaqs.map((faq, index) => (
        <div className="mb-3" key={index}>
          <input
            type="text"
            placeholder="Question"
            className="form-control mb-2"
            value={faq.question}
            onChange={(e) => handleFaqChange(index, "question", e.target.value)}
          />
          <textarea
            placeholder="Answer"
            className="form-control mb-2"
            rows={2}
            value={faq.answer}
            onChange={(e) => handleFaqChange(index, "answer", e.target.value)}
          ></textarea>
          {index > 0 && (
            <button
              className="btn btn-sm btn-danger mb-2"
              onClick={() => removeFaqInput(index)}
            >
              <FaTrash /> Remove
            </button>
          )}
        </div>
      ))}
      <button className="btn btn-secondary me-2" onClick={addMoreFaq}>
        <FaPlus /> Add More
      </button>
      <button className="btn btn-primary" onClick={handleSubmit}>
        <FaSave /> Submit FAQs
      </button>

      <hr />

      {/* Existing FAQs */}
      <h5>All FAQs</h5>
      {loading ? (
        <p>Loading...</p>
      ) : (
        faqs.map((faq) => (
          <div key={faq._id} className="border p-3 mb-2">
            {editingFaq && editingFaq._id === faq._id ? (
              <>
                <input
                  type="text"
                  className="form-control mb-2"
                  value={editingFaq.question}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, question: e.target.value })
                  }
                />
                <textarea
                  className="form-control mb-2"
                  value={editingFaq.answer}
                  onChange={(e) =>
                    setEditingFaq({ ...editingFaq, answer: e.target.value })
                  }
                />
                <button className="btn btn-success me-2" onClick={handleUpdate}>
                  <FaSave /> Save
                </button>
                <button className="btn btn-secondary" onClick={() => setEditingFaq(null)}>
                  <FaTimes /> Cancel
                </button>
              </>
            ) : (
              <>
                <h6>{faq.question}</h6>
                <p>{faq.answer}</p>
                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(faq)}>
                  <FaEdit /> 
                </button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(faq._id)}>
                  <FaTrash /> 
                </button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default Faqs;
