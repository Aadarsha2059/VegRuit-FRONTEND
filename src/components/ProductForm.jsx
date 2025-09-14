import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryAPI';
import { createProduct, updateProduct } from '../services/productAPI';
import toast from 'react-hot-toast';
import './ProductForm.css';

const ProductForm = ({ product, onSubmit, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    description: product?.description || '',
    category: product?.category?._id || '',
    price: product?.price || '',
    unit: product?.unit || 'kg',
    stock: product?.stock || '',
    minOrder: product?.minOrder || 1,
    maxOrder: product?.maxOrder || '',
    shopName: product?.shopName || '',
    location: product?.location || '',
    contactNumber: product?.contactNumber || '',
    isOrganic: product?.isOrganic || false,
    isFeatured: product?.isFeatured || false,
    isActive: product?.isActive !== undefined ? product.isActive : true,
    tags: product?.tags || [],
    nutritionInfo: {
      calories: product?.nutritionInfo?.calories || '',
      protein: product?.nutritionInfo?.protein || '',
      carbs: product?.nutritionInfo?.carbs || '',
      fiber: product?.nutritionInfo?.fiber || '',
      vitamins: product?.nutritionInfo?.vitamins || ''
    }
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(product?.images || []);
  const [categories, setCategories] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setCategoriesLoading(true);
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data.categories.filter(cat => cat.isActive));
      }
    } catch (error) {
      toast.error('Failed to load categories');
    } finally {
      setCategoriesLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Product name must be at least 2 characters';
    }
    
    if (!formData.category) {
      newErrors.category = 'Please select a category';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = 'Please enter valid stock quantity';
    }
    
    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber.replace(/\D/g, ''))) {
      newErrors.contactNumber = 'Please enter a valid 10-digit contact number';
    }
    
    if (images.length === 0 && imagePreviews.length === 0) {
      newErrors.images = 'Please add at least one product image';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setLoading(true);

    try {
      const submitData = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        if (key === 'nutritionInfo') {
          submitData.append('nutritionInfo', JSON.stringify(formData.nutritionInfo));
        } else if (key === 'tags') {
          submitData.append('tags', JSON.stringify(formData.tags));
        } else {
          submitData.append(key, formData[key]);
        }
      });

      // Add images
      images.forEach((image, index) => {
        submitData.append('images', image);
      });

      let response;
      if (product) {
        response = await updateProduct(product._id, submitData);
      } else {
        response = await createProduct(submitData);
      }

      if (response.success) {
        toast.success(`Product ${product ? 'updated' : 'created'} successfully!`);
        if (onSuccess) onSuccess(response.data.product);
        if (onSubmit) onSubmit(response.data.product);
      } else {
        toast.error(response.message || `Failed to ${product ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error('Product form error:', error);
      toast.error(`Failed to ${product ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('nutritionInfo.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        nutritionInfo: {
          ...formData.nutritionInfo,
          [field]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file count
    if (files.length + images.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate each file
    for (let file of files) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select only image files (JPG, PNG, GIF, WebP)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Each image should be less than 5MB');
        return;
      }
    }

    setImages([...images, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear image error
    if (errors.images) {
      setErrors({ ...errors, images: '' });
    }
  };

  const removeImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  return (
    <div className="product-form-overlay">
      <form onSubmit={handleSubmit} className="product-form">
        <div className="form-header">
          <h3>{product ? 'Edit Product' : 'Add New Product'}</h3>
          <button type="button" className="close-form-btn" onClick={onCancel}>✕</button>
        </div>

        <div className="form-body">
          {/* Basic Information */}
          <div className="form-section">
            <h4>Basic Information</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  placeholder="Enter product name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-message">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={loading || categoriesLoading}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                disabled={loading}
                placeholder="Describe your product..."
              />
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="form-section">
            <h4>Pricing & Stock</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price (NPR) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  disabled={loading}
                  placeholder="0.00"
                  className={errors.price ? 'error' : ''}
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="piece">Piece</option>
                  <option value="dozen">Dozen</option>
                  <option value="bundle">Bundle</option>
                  <option value="liter">Liter</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="stock">Stock Quantity *</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="0"
                  disabled={loading}
                  placeholder="0"
                  className={errors.stock ? 'error' : ''}
                />
                {errors.stock && <span className="error-message">{errors.stock}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="minOrder">Minimum Order</label>
                <input
                  type="number"
                  id="minOrder"
                  name="minOrder"
                  value={formData.minOrder}
                  onChange={handleChange}
                  min="1"
                  disabled={loading}
                  placeholder="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxOrder">Maximum Order</label>
                <input
                  type="number"
                  id="maxOrder"
                  name="maxOrder"
                  value={formData.maxOrder}
                  onChange={handleChange}
                  min="1"
                  disabled={loading}
                  placeholder="Leave empty for no limit"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h4>Product Images *</h4>
            <div className="form-group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                disabled={loading}
                className="image-input"
              />
              <div className="upload-help-text">
                <small>Choose up to 5 images (JPG, PNG, GIF, WebP). Max 5MB each.</small>
              </div>
              {errors.images && <span className="error-message">{errors.images}</span>}
              
              {imagePreviews.length > 0 && (
                <div className="image-previews">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="image-preview">
                      <img src={preview} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="remove-image-btn"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Contact & Location */}
          <div className="form-section">
            <h4>Contact & Location</h4>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="shopName">Shop Name</label>
                <input
                  type="text"
                  id="shopName"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="Your shop name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="contactNumber">Contact Number</label>
                <input
                  type="tel"
                  id="contactNumber"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="98XXXXXXXX"
                  className={errors.contactNumber ? 'error' : ''}
                />
                {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Farm/Shop Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                disabled={loading}
                placeholder="City, District"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="form-section">
            <h4>Tags</h4>
            <div className="form-group">
              <div className="tag-input-container">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  placeholder="Add tags (e.g., fresh, organic, local)"
                  disabled={loading}
                />
                <button type="button" onClick={addTag} disabled={loading}>Add</button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="tags-display">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>✕</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Options */}
          <div className="form-section">
            <h4>Product Options</h4>
            <div className="checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Organic Product
                <small>Certified organic or naturally grown</small>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Featured Product
                <small>Highlight this product on homepage</small>
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  disabled={loading}
                />
                <span className="checkmark"></span>
                Active Product
                <small>Product is available for purchase</small>
              </label>
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="form-section">
            <h4>Nutrition Information (Optional)</h4>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="calories">Calories (per 100g)</label>
                <input
                  type="number"
                  id="calories"
                  name="nutritionInfo.calories"
                  value={formData.nutritionInfo.calories}
                  onChange={handleChange}
                  min="0"
                  disabled={loading}
                  placeholder="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="protein">Protein (g)</label>
                <input
                  type="number"
                  id="protein"
                  name="nutritionInfo.protein"
                  value={formData.nutritionInfo.protein}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  disabled={loading}
                  placeholder="0.0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="carbs">Carbs (g)</label>
                <input
                  type="number"
                  id="carbs"
                  name="nutritionInfo.carbs"
                  value={formData.nutritionInfo.carbs}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  disabled={loading}
                  placeholder="0.0"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="fiber">Fiber (g)</label>
                <input
                  type="number"
                  id="fiber"
                  name="nutritionInfo.fiber"
                  value={formData.nutritionInfo.fiber}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                  disabled={loading}
                  placeholder="0.0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="vitamins">Key Vitamins</label>
                <input
                  type="text"
                  id="vitamins"
                  name="nutritionInfo.vitamins"
                  value={formData.nutritionInfo.vitamins}
                  onChange={handleChange}
                  disabled={loading}
                  placeholder="e.g., Vitamin C, Vitamin A"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="btn btn-outline" 
            onClick={onCancel} 
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading || !formData.name.trim() || !formData.category}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                {product ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              product ? 'Update Product' : 'Create Product'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
