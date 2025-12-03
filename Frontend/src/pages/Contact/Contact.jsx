import { useState } from 'react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Contact Form Data:', formData);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="contact-page">
        <div className="contact-success">
          <div className="success-icon">✓</div>
          <h2>Message Sent!</h2>
          <p>Thank you for reaching out, {formData.name}!</p>
          <p className="success-note">We'll get back to you within 24 hours.</p>
          <button 
            className="send-another-btn" 
            onClick={() => {
              setIsSubmitted(false);
              setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <div className="contact-hero">
        <div className="hero-content">
          <h1>Get in Touch</h1>
          <p>We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="contact-section">
        <div className="contact-container">
          {/* Contact Info */}
          <div className="contact-info">
            <h2>Contact Information</h2>
            <p className="info-subtitle">Reach out to us through any of these channels</p>

            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">📍</div>
                <div className="info-content">
                  <h4>Our Location</h4>
                  <p>123 Food Street, Koramangala</p>
                  <p>Bangalore, Karnataka 560034</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">📞</div>
                <div className="info-content">
                  <h4>Phone Number</h4>
                  <p>+91 98765 43210</p>
                  <p>+91 98765 43211</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">✉️</div>
                <div className="info-content">
                  <h4>Email Address</h4>
                  <p>hello@fooddelivery.com</p>
                  <p>support@fooddelivery.com</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">🕐</div>
                <div className="info-content">
                  <h4>Working Hours</h4>
                  <p>Mon - Fri: 10:00 AM - 11:00 PM</p>
                  <p>Sat - Sun: 9:00 AM - 12:00 AM</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="social-section">
              <h4>Follow Us</h4>
              <div className="social-links">
                <a href="#" className="social-link" aria-label="Facebook">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                  </svg>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                    <rect x="2" y="9" width="4" height="12"/>
                    <circle cx="4" cy="4" r="2"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-container">
            <h3>Send us a Message</h3>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject *</label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a subject</option>
                  <option value="general">General Inquiry</option>
                  <option value="order">Order Related</option>
                  <option value="feedback">Feedback</option>
                  <option value="complaint">Complaint</option>
                  <option value="partnership">Partnership</option>
                  <option value="careers">Careers</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Your Message *</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows="5"
                  required
                ></textarea>
              </div>

              <button type="submit" className="submit-btn">
                <span>Send Message</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="map-section">
        <h2>Find Us Here</h2>
        <div className="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.5965890960267!2d77.61649307507824!3d12.934533087375825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1452f1f1a8a9%3A0x9f9b9b9b9b9b9b9b!2sKoramangala%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1234567890!5m2!1sen!2sin"
            width="100%"
            height="400"
            style={{ border: 0, borderRadius: '20px' }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Restaurant Location"
          ></iframe>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-grid">
          <div className="faq-item">
            <h4>What are your delivery hours?</h4>
            <p>We deliver from 10:00 AM to 11:00 PM on weekdays and 9:00 AM to 12:00 AM on weekends.</p>
          </div>
          <div className="faq-item">
            <h4>How long does delivery take?</h4>
            <p>Typically 25-40 minutes depending on your location and order size.</p>
          </div>
          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major credit/debit cards, UPI, net banking, and cash on delivery.</p>
          </div>
          <div className="faq-item">
            <h4>How can I track my order?</h4>
            <p>You can track your order in real-time through the "My Orders" section after logging in.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

