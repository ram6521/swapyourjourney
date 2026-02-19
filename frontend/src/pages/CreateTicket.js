import React, { useState } from 'react';
import API from '../api';
import './CreateTicket.css';

function CreateTicket() {
  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    depTime: '',
    landmark: '',
    busType: '',
    seatNo: '',
    seatCategory: 'Seater',
    actualPrice: '',
    sellPrice: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    const selectedDate = new Date(form.date);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      setError('Cannot create ticket for past dates. Please select today or a future date.');
      return;
    }

    const actualPrice = parseFloat(form.actualPrice);
    const sellPrice = parseFloat(form.sellPrice);

    if (sellPrice >= actualPrice) {
      setError('Selling price must be less than the actual price.');
      return;
    }

    if (actualPrice - sellPrice < 1) {
      setError('Selling price must be at least ₹1 less than the actual price.');
      return;
    }

    setLoading(true);

    try {
      await API.post('/api/tickets/create', form);

      setMessage('Ticket created successfully!');
      setForm({
        from: '',
        to: '',
        date: '',
        depTime: '',
        landmark: '',
        busType: '',
        seatNo: '',
        seatCategory: 'Seater',
        actualPrice: '',
        sellPrice: ''
      });

      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title gradient-text">Create New Ticket</h1>
          <p className="page-subtitle">List your bus ticket for sale</p>
        </div>

        <div className="form-container">
          {message && <div className="alert alert-success">{message}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">From (Starting Point)</label>
                <input
                  type="text"
                  name="from"
                  className="input"
                  placeholder="e.g., Hyderabad"
                  value={form.from}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">To (Destination)</label>
                <input
                  type="text"
                  name="to"
                  className="input"
                  placeholder="e.g., Bangalore"
                  value={form.to}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Journey Date</label>
                <input
                  type="date"
                  name="date"
                  className="input"
                  value={form.date}
                  onChange={handleChange}
                  min={today}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Departure Time</label>
                <input
                  type="time"
                  name="depTime"
                  className="input"
                  value={form.depTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Landmark/Boarding Point</label>
                <input
                  type="text"
                  name="landmark"
                  className="input"
                  placeholder="e.g., Nampally Metro Station"
                  value={form.landmark}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Bus Operator</label>
                <input
                  type="text"
                  name="busType"
                  className="input"
                  placeholder="e.g., TSRTC, VRL, Orange"
                  value={form.busType}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Seat Number</label>
                <input
                  type="text"
                  name="seatNo"
                  className="input"
                  placeholder="e.g., 21A"
                  value={form.seatNo}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Seat Category</label>
                <select
                  name="seatCategory"
                  className="select"
                  value={form.seatCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="Seater">Seater</option>
                  <option value="Sleeper">Sleeper</option>
                </select>
              </div>
            </div>

            <div className="grid grid-2">
              <div className="form-group">
                <label className="form-label">Actual Price (₹)</label>
                <input
                  type="number"
                  name="actualPrice"
                  className="input"
                  min="1"
                  value={form.actualPrice}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Selling Price (₹)</label>
                <input
                  type="number"
                  name="sellPrice"
                  className="input"
                  min="1"
                  value={form.sellPrice}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
              {loading ? 'Creating...' : 'Create Ticket'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateTicket;
