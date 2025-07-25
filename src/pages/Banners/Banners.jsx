import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Swal from 'sweetalert2';

function Scroller() {
  const [marquees, setMarquees] = useState([]);
  const [newText, setNewText] = useState('');
  const [newIcon, setNewIcon] = useState('fa-envelope');
  const [editId, setEditId] = useState(null);

  const fetchMarquees = () => {
    axios.get('https://od-cards-backend-z494.onrender.com/api/marquees/getall')
      .then(res => setMarquees(res.data.marquees))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchMarquees();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { text: newText, icon: newIcon };

    const request = editId
      ? axios.put(`https://od-cards-backend-z494.onrender.com/api/marquees/update/${editId}`, payload)
      : axios.post('https://od-cards-backend-z494.onrender.com/api/marquees/add', payload);

    request.then(() => {
      fetchMarquees();
      setNewText('');
      setNewIcon('fa-envelope');
      setEditId(null);

      Swal.fire({
        icon: 'success',
        title: editId ? 'Updated Successfully' : 'Added Successfully',
        timer: 1500,
        showConfirmButton: false,
      });
    }).catch(err => {
      console.error(err);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Something went wrong. Please try again.',
      });
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`https://od-cards-backend-z494.onrender.com/api/marquees/delete/${id}`)
          .then(() => {
            fetchMarquees();
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: 'The item has been deleted.',
              timer: 1500,
              showConfirmButton: false
            });
          })
          .catch(err => {
            console.error(err);
            Swal.fire({
              icon: 'error',
              title: 'Failed to delete!',
              text: 'An error occurred while deleting.',
            });
          });
      }
    });
  };

  const handleEdit = (item) => {
    setNewText(item.text);
    setNewIcon(item.icon);
    setEditId(item._id);
  };

  return (
    <div className="container">
      <h3 className="mb-4">Manage Scroller (Marquee) Items</h3>

      <form onSubmit={handleSubmit} className="mb-4 row g-2 align-items-center">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Enter marquee text"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            required
          />
        </div>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Icon class (e.g. fa-envelope)"
            value={newIcon}
            onChange={(e) => setNewIcon(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary w-100">
            {editId ? 'Update' : 'Add'} <FaPlus className="ms-2" />
          </button>
        </div>
      </form>

      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>SNO</th>
            <th>Text</th>
            <th>Icon</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {marquees.map((item, index) => (
            <tr key={item._id}>
              <td>{index + 1}</td>
              <td>{item.text}</td>
              <td><i className={`fa-solid ${item.icon}`}></i> {item.icon}</td>
              <td>
                <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(item)}><FaEdit /></button>
                <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item._id)}><FaTrash /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Scroller;
