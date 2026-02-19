import React, { useState, useEffect } from 'react';
import API from '../api';   // ✅ changed here
import './TicketList.css';

function MyPurchases() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await API.get('/api/tickets/purchases');  // ✅ changed
      setTickets(res.data);
    } catch (err) {
      console.error('Error fetching purchases:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title gradient-text">My Purchases</h1>
          <p className="page-subtitle">Your booked tickets</p>
        </div>

        {tickets.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎟️</div>
            <h3>No purchases yet</h3>
            <p>Book your first ticket to get started</p>
          </div>
        ) : (
          <div className="tickets-grid">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="ticket-card">
                <div className="ticket-badge">
                  <span className="badge badge-success">Booked</span>
                </div>

                <div className="ticket-route">
                  <div className="route-point">
                    <div className="route-icon">📍</div>
                    <div className="route-name">{ticket.from}</div>
                  </div>
                  <div className="route-arrow">→</div>
                  <div className="route-point">
                    <div className="route-icon">📍</div>
                    <div className="route-name">{ticket.to}</div>
                  </div>
                </div>

                <div className="ticket-details">
                  <div className="detail-row">
                    <span className="detail-label">📅 Date</span>
                    <span className="detail-value">
                      {new Date(ticket.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🕐 Departure</span>
                    <span className="detail-value">{ticket.depTime}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">🚌 Bus</span>
                    <span className="detail-value">{ticket.busType}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💺 Seat</span>
                    <span className="detail-value">
                      {ticket.seatNo} ({ticket.seatCategory})
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">📌 Landmark</span>
                    <span className="detail-value">{ticket.landmark}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">💰 Paid</span>
                    <span className="detail-value text-success">
                      ₹{ticket.sellPrice}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">👤 Seller</span>
                    <span className="detail-value">
                      {ticket.seller?.name || ticket.sellerName}
                    </span>
                  </div>
                  {ticket.bookedAt && (
                    <div className="detail-row">
                      <span className="detail-label">📅 Booked On</span>
                      <span className="detail-value">
                        {new Date(ticket.bookedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="alert alert-info">
                  Contact seller at: {ticket.seller?.email || 'Contact through platform'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyPurchases;
