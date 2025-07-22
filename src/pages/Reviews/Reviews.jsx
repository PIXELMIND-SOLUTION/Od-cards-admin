import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaStar } from 'react-icons/fa';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    rating: 5,
    comment: '',
    image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentReviewId, setCurrentReviewId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/reviews/allreviews');
      setReviews(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('rating', formData.rating);
    data.append('comment', formData.comment);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (isEditing && currentReviewId) {
        await axios.put(`http://localhost:5000/api/reviews/updatereview/${currentReviewId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Success!', 'Review updated successfully.', 'success');
      } else {
        await axios.post('http://localhost:5000/api/reviews/create-review', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Success!', 'Review created successfully.', 'success');
      }
      resetForm();
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      Swal.fire('Error!', 'Failed to save review.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const editReview = (review) => {
    setFormData({
      name: review.name,
      rating: review.rating,
      comment: review.comment,
      image: null
    });
    setPreviewImage(null);
    setCurrentReviewId(review._id);
    setIsEditing(true);
  };

  const deleteReview = async (id) => {
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
        await axios.delete(`http://localhost:5000/api/reviews/deletereview/${id}`);
        Swal.fire('Deleted!', 'Review has been deleted.', 'success');
        fetchReviews();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete review.', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      rating: 5,
      comment: '',
      image: null
    });
    setPreviewImage(null);
    setIsEditing(false);
    setCurrentReviewId(null);
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar 
          key={i} 
          className={i <= rating ? 'text-warning' : 'text-secondary'} 
        />
      );
    }
    return stars;
  };

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                {isEditing ? 'Edit Review' : 'Add Review'}
              </h4>
              {isEditing && (
                <button 
                  className="btn btn-sm btn-outline-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="rating" className="form-label">Rating</label>
                  <select
                    className="form-select"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    required
                  >
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">Comment</label>
                  <textarea
                    className="form-control"
                    id="comment"
                    name="comment"
                    rows="3"
                    value={formData.comment}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="image" className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!isEditing}
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img 
                        src={previewImage} 
                        alt="Preview" 
                        style={{ maxWidth: '150px', maxHeight: '150px' }}
                        className="img-thumbnail"
                      />
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-end">
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Save Review'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-white">
              <h4 className="mb-0">Customer Reviews</h4>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <div className="row">
                  {reviews.map((review) => (
                    <div key={review._id} className="col-12 mb-3">
                      <div className="card h-100">
                        <div className="card-body">
                          <div className="d-flex align-items-center mb-3">
                            {review.image && (
                              <img 
                                src={`http://localhost:5000${review.image}`} 
                                alt={review.name} 
                                className="rounded-circle me-3"
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                              />
                            )}
                            <div>
                              <h5 className="mb-1">{review.name}</h5>
                              <div className="d-flex">
                                {renderStars(review.rating)}
                                <span className="ms-2 text-muted">{review.rating.toFixed(1)}</span>
                              </div>
                            </div>
                          </div>
                          <p className="card-text">{review.comment}</p>
                          <small className="text-muted">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                        <div className="card-footer bg-white d-flex justify-content-end gap-2">
                          <button 
                            onClick={() => editReview(review)}
                            className="btn btn-sm btn-outline-warning"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={() => deleteReview(review._id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
