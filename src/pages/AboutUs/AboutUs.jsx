import React, { useState, useEffect } from 'react';
import { Tab, Nav, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEdit, FaTrash, FaPlus, FaSave, FaTimes } from 'react-icons/fa';

const AboutUs = () => {
  // State for active tab
  const [activeTab, setActiveTab] = useState('about');

  // About Us state
  const [aboutData, setAboutData] = useState({
    description: '',
    image: null
  });
  const [aboutPreview, setAboutPreview] = useState(null);
  const [existingAboutImage, setExistingAboutImage] = useState(null);
  const [isEditingAbout, setIsEditingAbout] = useState(false);
  const [currentAboutId, setCurrentAboutId] = useState(null);

  // Card Categories state
  const [cards, setCards] = useState([]);
  const [cardForm, setCardForm] = useState({
    title: '',
    description: '',
    count: '',
    image: null
  });
  const [cardPreview, setCardPreview] = useState(null);
  const [isEditingCard, setIsEditingCard] = useState(false);
  const [currentCardId, setCurrentCardId] = useState(null);

  // Loading states
  const [loadingAbout, setLoadingAbout] = useState(true);
  const [loadingCards, setLoadingCards] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchAboutData();
    fetchCardData();
  }, []);

  // Fetch About Us data
  const fetchAboutData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/aboutus/about');
      if (response.data.length > 0) {
        const aboutItem = response.data[0];
        setAboutData({
          description: aboutItem.description,
          image: null
        });
        setExistingAboutImage(aboutItem.image);
        setIsEditingAbout(true);
        setCurrentAboutId(aboutItem._id);
      }
      setLoadingAbout(false);
    } catch (error) {
      console.error('Error fetching about data:', error);
      setLoadingAbout(false);
    }
  };

  // Fetch Card Categories data
  const fetchCardData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/aboutcard/getallcards');
      setCards(response.data);
      setLoadingCards(false);
    } catch (error) {
      console.error('Error fetching cards:', error);
      setLoadingCards(false);
    }
  };

  // Handle About Us form changes
  const handleAboutChange = (e) => {
    const { name, value } = e.target;
    setAboutData(prev => ({ ...prev, [name]: value }));
  };

  const handleAboutImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAboutData(prev => ({ ...prev, image: file }));
      setAboutPreview(URL.createObjectURL(file));
      setExistingAboutImage(null);
    }
  };

  // Handle Card Category form changes
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    setCardForm(prev => ({ ...prev, [name]: value }));
  };

  const handleCardImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCardForm(prev => ({ ...prev, image: file }));
      setCardPreview(URL.createObjectURL(file));
    }
  };

  // Submit About Us form
  const submitAboutForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('description', aboutData.description);
    if (aboutData.image) {
      data.append('image', aboutData.image);
    }

    try {
      if (isEditingAbout && currentAboutId) {
        // Update existing - Fixed the endpoint to include the ID parameter
        await axios.put(`http://localhost:5000/api/aboutus/updateabout/${currentAboutId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Success!', 'About Us updated successfully.', 'success');
      } else {
        // Create new
        await axios.post('http://localhost:5000/api/aboutus/create-about', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Success!', 'About Us created successfully.', 'success');
      }
      fetchAboutData();
    } catch (error) {
      console.error('Error saving about:', error);
      Swal.fire('Error!', 'Failed to save About Us.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit Card Category form
  const submitCardForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = new FormData();
    data.append('title', cardForm.title);
    data.append('description', cardForm.description);
    data.append('count', cardForm.count);
    if (cardForm.image) {
      data.append('image', cardForm.image);
    }

    try {
      if (isEditingCard && currentCardId) {
        // Update existing
        await axios.put(`http://localhost:5000/api/aboutcard/updatecard/${currentCardId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Success!', 'Card Category updated successfully.', 'success');
      } else {
        // Create new
        await axios.post('http://localhost:5000/api/aboutcard/create-card', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Success!', 'Card Category created successfully.', 'success');
      }
      resetCardForm();
      fetchCardData();
    } catch (error) {
      console.error('Error saving card:', error);
      Swal.fire('Error!', 'Failed to save Card Category.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Edit Card Category
  const editCard = (card) => {
    setCardForm({
      title: card.title,
      description: card.description,
      count: card.count,
      image: null
    });
    setCardPreview(null);
    setCurrentCardId(card._id);
    setIsEditingCard(true);
  };

  // Delete Card Category
  const deleteCard = async (id) => {
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
        await axios.delete(`http://localhost:5000/api/aboutcard/deletecard/${id}`);
        Swal.fire('Deleted!', 'Card Category has been deleted.', 'success');
        fetchCardData();
      } catch (error) {
        Swal.fire('Error!', 'Failed to delete Card Category.', 'error');
      }
    }
  };

  // Reset Card Category form
  const resetCardForm = () => {
    setCardForm({
      title: '',
      description: '',
      count: '',
      image: null
    });
    setCardPreview(null);
    setIsEditingCard(false);
    setCurrentCardId(null);
  };

  return (
    <div className="container-fluid py-3">
      <h4 className="mb-4">Content Management</h4>
      
      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Row>
          <Col sm={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="about">About Us</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="cards">Card Categories</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              {/* About Us Tab */}
              <Tab.Pane eventKey="about">
                <div className="card shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">About Us Content</h5>
                  </div>
                  <div className="card-body">
                    {loadingAbout ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={submitAboutForm}>
                        <div className="mb-3">
                          <label htmlFor="aboutDescription" className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            id="aboutDescription"
                            name="description"
                            rows="5"
                            value={aboutData.description}
                            onChange={handleAboutChange}
                            required
                          />
                        </div>

                        <div className="mb-3">
                          <label htmlFor="aboutImage" className="form-label">Image</label>
                          <input
                            type="file"
                            className="form-control"
                            id="aboutImage"
                            name="image"
                            accept="image/*"
                            onChange={handleAboutImageChange}
                          />
                          {existingAboutImage && !aboutPreview && (
                            <div className="mt-2">
                              <p className="text-muted mb-1">Current Image:</p>
                              <img 
                                src={`http://localhost:5000${existingAboutImage}`} 
                                alt="Current" 
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                                className="img-thumbnail"
                              />
                            </div>
                          )}
                          {aboutPreview && (
                            <div className="mt-2">
                              <p className="text-muted mb-1">New Image:</p>
                              <img 
                                src={aboutPreview} 
                                alt="Preview" 
                                style={{ maxWidth: '200px', maxHeight: '200px' }}
                                className="img-thumbnail"
                              />
                            </div>
                          )}
                        </div>

                        <div className="d-flex justify-content-end gap-2">
                          <button 
                            type="submit" 
                            className="btn btn-primary"
                            disabled={submitting}
                          >
                            {submitting ? 'Saving...' : 'Save'}
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              </Tab.Pane>

              {/* Card Categories Tab */}
              <Tab.Pane eventKey="cards">
                <div className="card shadow-sm mb-4">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">
                      {isEditingCard ? 'Edit Card Category' : 'Add New Card Category'}
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={submitCardForm}>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="cardTitle" className="form-label">Title</label>
                          <input
                            type="text"
                            className="form-control"
                            id="cardTitle"
                            name="title"
                            value={cardForm.title}
                            onChange={handleCardChange}
                            required
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="cardCount" className="form-label">Count</label>
                          <input
                            type="number"
                            className="form-control"
                            id="cardCount"
                            name="count"
                            value={cardForm.count}
                            onChange={handleCardChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="cardDescription" className="form-label">Description</label>
                        <textarea
                          className="form-control"
                          id="cardDescription"
                          name="description"
                          rows="3"
                          value={cardForm.description}
                          onChange={handleCardChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="cardImage" className="form-label">Image</label>
                        <input
                          type="file"
                          className="form-control"
                          id="cardImage"
                          name="image"
                          accept="image/*"
                          onChange={handleCardImageChange}
                          required={!isEditingCard}
                        />
                        {cardPreview && (
                          <div className="mt-2">
                            <img 
                              src={cardPreview} 
                              alt="Preview" 
                              style={{ maxWidth: '200px', maxHeight: '200px' }}
                              className="img-thumbnail"
                            />
                          </div>
                        )}
                      </div>

                      <div className="d-flex justify-content-end gap-2">
                        {isEditingCard && (
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={resetCardForm}
                          >
                            <FaTimes className="me-1" /> Cancel
                          </button>
                        )}
                        <button 
                          type="submit" 
                          className="btn btn-primary"
                          disabled={submitting}
                        >
                          <FaSave className="me-1" /> {submitting ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card shadow-sm">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">Card Categories List</h5>
                  </div>
                  <div className="card-body">
                    {loadingCards ? (
                      <div className="d-flex justify-content-center align-items-center" style={{ height: '200px' }}>
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Title</th>
                              <th>Description</th>
                              <th>Count</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cards.map((card) => (
                              <tr key={card._id}>
                                <td>
                                  {card.image && (
                                    <img 
                                      src={`http://localhost:5000${card.image}`} 
                                      alt={card.title} 
                                      style={{ width: '60px', height: 'auto' }}
                                      className="img-thumbnail"
                                    />
                                  )}
                                </td>
                                <td>{card.title}</td>
                                <td>{card.description}</td>
                                <td>{card.count}</td>
                                <td>
                                  <div className="d-flex gap-2">
                                    <button 
                                      onClick={() => editCard(card)}
                                      className="btn btn-sm btn-outline-warning"
                                    >
                                      <FaEdit />
                                    </button>
                                    <button 
                                      onClick={() => deleteCard(card._id)}
                                      className="btn btn-sm btn-outline-danger"
                                    >
                                      <FaTrash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
};

export default AboutUs;