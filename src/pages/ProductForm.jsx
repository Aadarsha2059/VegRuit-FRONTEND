import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import '../styles/ProductForm.css';

const ProductForm = ({ product, categories = [], onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price || '',
    category: product?.category?._id || '',
    stock: product?.stock || '',
    unit: product?.unit || 'kg',
    status: product?.status || 'active',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    // If editing a product, ensure its category is set
    if (product && product.category) {
      setFormData(prev => ({ ...prev, category: product.category._id || product.category }));
    }
  }, [product]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be a positive number';
    if (!formData.category) newErrors.category = 'Please select a category';
    if (formData.stock === '' || formData.stock < 0) newErrors.stock = 'Stock must be 0 or more';
    if (!formData.unit) newErrors.unit = 'Unit is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill all required fields correctly.');
      return;
    }

    setSubmitting(true);
    try {
      // We will submit the raw form data, assuming the parent handler uses FormData
      await onSubmit(formData);
    } catch (error) {
      toast.error(error.message || 'Failed to save product.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="product-form-overlay">
      <form onSubmit={handleSubmit} className="product-form" noValidate>
        <div className="form-header">
          <h4>{product ? 'Edit Product' : 'Add New Product'}</h4>
          <button type="button" className="close-form-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="form-body">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              disabled={submitting || categories.length === 0}
              className={errors.category ? 'error' : ''}
            >
              <option value="" disabled>-- Select a Category --</option>
              {categories.length > 0 ? (
                categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))
              ) : (
                <option disabled>Please create a category first</option>
              )}
            </select>
            {errors.category && <span className="error-message">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="name">Product Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={submitting}
              className={errors.name ? 'error' : ''}
              placeholder="e.g., Organic Fuji Apples"
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              disabled={submitting}
              className={errors.description ? 'error' : ''}
              placeholder="Describe your product, its quality, and origin."
            />
            {errors.description && <span className="error-message">{errors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price">Price (Rs.) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                disabled={submitting}
                className={errors.price ? 'error' : ''}
                placeholder="e.g., 150"
              />
              {errors.price && <span className="error-message">{errors.price}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="unit">Unit *</label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                disabled={submitting}
                className={errors.unit ? 'error' : ''}
              >
                <option value="kg">per kg</option>
                <option value="gram">per gram</option>
                <option value="piece">per piece</option>
                <option value="dozen">per dozen</option>
                <option value="bunch">per bunch</option>
                <option value="litre">per litre</option>
              </select>
              {errors.unit && <span className="error-message">{errors.unit}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="stock">Stock Quantity *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                min="0"
                disabled={submitting}
                className={errors.stock ? 'error' : ''}
                placeholder="e.g., 50"
              />
              {errors.stock && <span className="error-message">{errors.stock}</span>}
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" value={formData.status} onChange={handleChange} disabled={submitting}>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Image upload can be added here */}

        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
