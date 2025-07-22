import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FaEdit, FaTrash, FaPlus, FaImages, FaSpinner, FaEye } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";

const Banners = () => {
  const [banners, setBanners] = useState([]);
  const [form, setForm] = useState({
    title: "",
    name: "",
    content: "",
    images: [],
    imagePreviews: []
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/banners/getallbanners");
      setBanners(Array.isArray(data.banners) ? data.banners : []);
    } catch (err) {
      console.error("Error fetching banners", err);
      Swal.fire("Error", "Failed to fetch banners", "error");
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBannerDetails = async (id) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/banners/banner/${id}`);
      setSelectedBanner(data.banner);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching banner details", err);
      Swal.fire("Error", "Failed to fetch banner details", "error");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    
    setForm(prev => ({
      ...prev,
      images: files,
      imagePreviews: previews
    }));
    
    setIsUploading(true);
    setTimeout(() => setIsUploading(false), 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("name", form.name);
    formData.append("content", form.content);
    
    if (form.images.length > 0) {
      for (let file of form.images) {
        formData.append("images", file);
      }
    }

    try {
      if (editingId) {
        await axios.put(
          `http://localhost:5000/api/banners/updatebanner/${editingId}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        Swal.fire("Updated!", "Banner updated successfully.", "success");
      } else {
        await axios.post(
          "http://localhost:5000/api/banners/create", 
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          }
        );
        Swal.fire("Created!", "Banner created successfully.", "success");
      }

      await fetchBanners();
      resetForm();
      setShowForm(false);
    } catch (err) {
      console.error("Error submitting banner", err);
      Swal.fire("Error", err.response?.data?.message || "Something went wrong!", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (banner) => {
    setForm({
      title: banner.title || "",
      name: banner.name || "",
      content: banner.content || "",
      images: [],
      imagePreviews: banner.images?.map(img => 
        `http://localhost:5000/uploads/banners/${img}`
      ) || []
    });
    setEditingId(banner._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (confirm.isConfirmed) {
      try {
        setIsLoading(true);
        await axios.delete(`http://localhost:5000/api/banners/deletebanner/${id}`);
        await fetchBanners();
        Swal.fire("Deleted!", "Banner has been deleted.", "success");
      } catch (err) {
        console.error("Delete error:", err);
        Swal.fire("Error", "Could not delete banner.", "error");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const resetForm = () => {
    form.imagePreviews.forEach(preview => URL.revokeObjectURL(preview));
    
    setForm({ 
      title: "", 
      name: "", 
      content: "", 
      images: [],
      imagePreviews: [] 
    });
    setEditingId(null);
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Banners Management</h2>
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
          disabled={isLoading}
        >
          <FaPlus className="me-2" /> {showForm ? "Hide Form" : "Add New Banner"}
        </button>
      </div>

      {showForm && (
        <div className="card shadow mb-4">
          <div className="card-header py-3">
            <h6 className="m-0 font-weight-bold text-primary">
              {editingId ? "Edit Banner" : "Create New Banner"}
            </h6>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    name="title"
                    value={form.title}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea
                  className="form-control"
                  name="content"
                  rows="4"
                  value={form.content}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">
                  <FaImages className="me-2" />
                  Images {editingId && "(Leave empty to keep existing images)"}
                </label>
                <input
                  type="file"
                  className="form-control"
                  multiple
                  onChange={handleFileChange}
                  disabled={isLoading}
                  accept="image/*"
                />
                {isUploading && (
                  <div className="mt-2 text-primary">
                    <FaSpinner className="fa-spin me-2" />
                    Processing images...
                  </div>
                )}
              </div>

              {(form.imagePreviews.length > 0 || (editingId && form.images.length === 0)) && (
                <div className="mb-4">
                  <h6 className="mb-3">Image Previews:</h6>
                  <div className="row">
                    {form.imagePreviews.map((preview, index) => (
                      <div key={index} className="col-md-3 mb-3">
                        <div className="card">
                          <img
                            src={preview}
                            className="card-img-top"
                            alt={`Preview ${index + 1}`}
                            style={{ height: "120px", objectFit: "cover" }}
                          />
                          <div className="card-body p-2 text-center">
                            <small className="text-muted">Image {index + 1}</small>
                          </div>
                        </div>
                      </div>
                    ))}
                    {editingId && form.images.length === 0 && form.imagePreviews.length === 0 && (
                      <div className="col-12">
                        <p className="text-muted">Existing images will be preserved</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isLoading || isUploading}
                >
                  {isLoading ? (
                    <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  ) : editingId ? (
                    "Update Banner"
                  ) : (
                    "Create Banner"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="row">
        {isLoading ? (
          <div className="col-12 text-center my-5">
            <FaSpinner className="fa-spin fa-2x text-primary" />
            <p className="mt-3">Loading banners...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="col-12">
            <div className="card shadow">
              <div className="card-body text-center py-5">
                <h4 className="text-muted">No banners found</h4>
                <p>Click the "Add New Banner" button to create your first banner</p>
              </div>
            </div>
          </div>
        ) : (
          banners.map((banner) => (
            <div key={banner._id} className="col-lg-6 mb-4">
              <div className="card h-100 shadow-sm">
                <div className="card-header py-3 d-flex justify-content-between align-items-center">
                  <h6 className="m-0 font-weight-bold">{banner.title}</h6>
                  <div>
                    <button 
                      className="btn btn-sm btn-outline-info me-2" 
                      onClick={() => fetchBannerDetails(banner._id)}
                      disabled={isLoading}
                    >
                      <FaEye />
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-warning me-2" 
                      onClick={() => handleEdit(banner)}
                      disabled={isLoading}
                    >
                      <FaEdit />
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-danger" 
                      onClick={() => handleDelete(banner._id)}
                      disabled={isLoading}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-5 mb-3 mb-md-0">
                      {banner.images?.[0] && (
                        <img
                          src={`http://localhost:5000/uploads/banners/${banner.images[0]}`}
                          className="img-fluid rounded"
                          alt={banner.title}
                          style={{ height: "200px", width: "100%", objectFit: "cover" }}
                        />
                      )}
                    </div>
                    <div className="col-md-7">
                      <h5 className="card-title">{banner.name}</h5>
                      <p className="card-text text-muted">{banner.content}</p>
                      {banner.images?.length > 1 && (
                        <div className="mt-2">
                          <small className="text-muted">
                            <FaImages className="me-1" />
                            {banner.images.length} images available
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Banner Details Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Banner Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedBanner ? (
            <div className="row">
              <div className="col-md-6">
                <h4>{selectedBanner.title}</h4>
                <h5 className="text-muted">{selectedBanner.name}</h5>
                <p className="mt-3">{selectedBanner.content}</p>
                <div className="mt-4">
                  <p>
                    <strong>Created:</strong> {new Date(selectedBanner.createdAt).toLocaleString()}
                  </p>
                  {selectedBanner.updatedAt !== selectedBanner.createdAt && (
                    <p>
                      <strong>Updated:</strong> {new Date(selectedBanner.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <h5>Images:</h5>
                <div className="row">
                  {selectedBanner.images.map((image, index) => (
                    <div key={index} className="col-6 mb-3">
                      <div className="card">
                        <img
                          src={`http://localhost:5000/uploads/banners/${image}`}
                          className="card-img-top"
                          alt={`Banner Image ${index + 1}`}
                          style={{ height: "150px", objectFit: "cover" }}
                        />
                        <div className="card-body p-2 text-center">
                          <small className="text-muted">Image {index + 1}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <FaSpinner className="fa-spin fa-2x text-primary" />
              <p className="mt-3">Loading banner details...</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-danger" onClick={() => setShowModal(false)}>
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Banners;