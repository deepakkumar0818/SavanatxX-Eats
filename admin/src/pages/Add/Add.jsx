import React, { useEffect } from "react";
import "./Add.css";
import { assets } from "../../assets/assets";
import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Add = ({url}) => {
  const [image, setImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    category: "Salad",
    price: "",
  });

  const handleSubmit = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  };

  const OnSubmitHandler = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const form = new FormData();
    form.append("name", data.name);
    form.append("description", data.description);
    form.append("category", data.category);
    form.append("price", Number(data.price));
    form.append("image", image);

    try {
      const response = await axios.post(`${url}/api/food/add`, form);
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          category: "Salad",
          price: "",
        });
        setImage(false);
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Failed to add item");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="add-page">
      <div className="page-header">
        <div className="header-left">
          <h1>Add New Item</h1>
          <p>Add a new dish to your menu</p>
        </div>
      </div>

      <div className="add-form-card">
        <form onSubmit={OnSubmitHandler}>
          {/* Image Upload */}
          <div className="form-section">
            <h3>Product Image</h3>
            <div className="image-upload-area">
              <label htmlFor="image" className="upload-label">
                {image ? (
                  <img src={URL.createObjectURL(image)} alt="Preview" className="preview-img" />
                ) : (
                  <div className="upload-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>Click to upload image</span>
                    <span className="upload-hint">PNG, JPG up to 5MB</span>
                  </div>
                )}
              </label>
              <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
                required
                accept="image/*"
              />
              {image && (
                <button type="button" className="change-image-btn" onClick={() => setImage(false)}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="form-section">
            <h3>Product Details</h3>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Product Name</label>
                <input
                  onChange={handleSubmit}
                  value={data.name}
                  type="text"
                  name="name"
                  placeholder="Enter product name"
                  required
                />
              </div>

              <div className="form-group full-width">
                <label>Description</label>
                <textarea
                  onChange={handleSubmit}
                  value={data.description}
                  name="description"
                  placeholder="Write a brief description about the dish..."
                  rows="4"
                  required
                ></textarea>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select onChange={handleSubmit} name="category" value={data.category}>
                  <option value="Salad">Salad</option>
                  <option value="Rolls">Rolls</option>
                  <option value="Desserts">Desserts</option>
                  <option value="Sandwich">Sandwich</option>
                  <option value="Cake">Cake</option>
                  <option value="Pure veg">Pure veg</option>
                  <option value="Pasta">Pasta</option>
                  <option value="Noodles">Noodles</option>
                </select>
              </div>

              <div className="form-group">
                <label>Price (₹)</label>
                <input
                  onChange={handleSubmit}
                  value={data.price}
                  type="number"
                  name="price"
                  placeholder="Enter price"
                  required
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => {
              setData({ name: "", description: "", category: "Salad", price: "" });
              setImage(false);
            }}>
              Clear Form
            </button>
            <button type="submit" className="btn-submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Adding...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Add Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
