import React, { useState, useEffect } from 'react';
import { getCategories } from '../services/categoryAPI';
import { createProduct, updateProduct } from '../services/productAPI';
import toast from 'react-hot-toast';

const ProductForm = ({ product = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    unit: 'kg',
    stock: '',
    category: '',
    minOrderQuantity: '',
    maxOrderQuantity: '',
    tags: [],
    harvestDate: '',
    expiryDate: '',
    farmLocation: '',
    isOrganic: false,
    isFeatured: false,
    isActive: true,
    nutritionInfo: {
      calories: '',
      protein: '',
      carbs: '',
      fat: '',
      fiber: '',
      vitamins: ''
    }
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

  // Populate form if editing existing product
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        originalPrice: product.originalPrice || '',
        unit: product.unit || 'kg',
        stock: product.stock || '',
        category: product.category?._id || product.category || '',
        minOrderQuantity: product.minOrderQuantity || '',
        maxOrderQuantity: product.maxOrderQuantity || '',
        tags: product.tags || [],
        harvestDate: product.harvestDate ? product.harvestDate.split('T')[0] : '',
        expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : '',
        farmLocation: product.farmLocation || '',
        isOrganic: product.isOrganic || false,
        isFeatured: product.isFeatured || false,
        isActive: product.isActive !== undefined ? product.isActive : true,
        nutritionInfo: product.nutritionInfo || {
          calories: '',
          protein: '',
          carbs: '',
          fat: '',
          fiber: '',
          vitamins: ''
        }
      });

      // Set existing image previews
      if (product.images && product.images.length > 0) {
        const previews = product.images.map(img => 
          img.startsWith('http') ? img : `http://localhost:5000${img}`
        );
        setImagePreviews(previews);
      }
    }
  }, [product]);

  const loadCategories = async () => {
    try {
      const response = await getCategories();
      if (response.success) {
        setCategories(response.data?.categories || response.categories || []);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('nutrition.')) {
      const nutritionField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        nutritionInfo: {
          ...prev.nutritionInfo,
          [nutritionField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }

    // Validate file types
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    
    if (invalidFiles.length > 0) {
      toast.error('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    // Validate file sizes (5MB max)
    const oversizedFiles = files.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error('Each image must be less than 5MB');
      return;
    }

    setImages(prev => [...prev, ...files]);

    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreviews(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || formData.price <= 0) newErrors.price = 'Valid price is required';
    if (!formData.stock || formData.stock < 0) newErrors.stock = 'Valid stock quantity is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.unit) newErrors.unit = 'Unit is required';

    if (formData.originalPrice && formData.originalPrice <= formData.price) {
      newErrors.originalPrice = 'Original price must be higher than current price';
    }

    if (formData.minOrderQuantity && formData.maxOrderQuantity && 
        parseInt(formData.minOrderQuantity) > parseInt(formData.maxOrderQuantity)) {
      newErrors.maxOrderQuantity = 'Max quantity must be greater than min quantity';
    }

    if (!product && images.length === 0) {
      newErrors.images = 'At least one product image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const productData = {
        ...formData,
        images: images,
        tags: formData.tags,
        nutritionInfo: formData.nutritionInfo
      };

      let response;
      if (product) {
        response = await updateProduct(product._id, productData);
      } else {
        response = await createProduct(productData);
      }

      if (response.success) {
        toast.success(product ? 'Product updated successfully!' : 'Product created successfully!');
        if (onSubmit) onSubmit(response.data?.product || response.product);
      }
    } catch (error) {
      console.error('Error submitting product:', error);
      toast.error(error.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="product-form">
      <form onSubmit={handleSubmit} className="product-form-container">
        <div className="form-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
        </div>

        <div className="form-grid">
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="name">Product Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name ? 'error' : ''}
                placeholder="Enter product name"
              />
              {errors.name && <span className="error-text">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={errors.description ? 'error' : ''}
                placeholder="Describe your product"
                rows="4"
              />
              {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={errors.category ? 'error' : ''}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && <span className="error-text">{errors.category}</span>}
            </div>
          </div>

          {/* Pricing & Stock */}
          <div className="form-section">
            <h3>Pricing & Stock</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Current Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={errors.price ? 'error' : ''}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.price && <span className="error-text">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="originalPrice">Original Price</label>
                <input
                  type="number"
                  id="originalPrice"
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleInputChange}
                  className={errors.originalPrice ? 'error' : ''}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.originalPrice && <span className="error-text">{errors.originalPrice}</span>}
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
                  onChange={handleInputChange}
                  className={errors.stock ? 'error' : ''}
                  placeholder="0"
                  min="0"
                />
                {errors.stock && <span className="error-text">{errors.stock}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="unit">Unit *</label>
                <select
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  className={errors.unit ? 'error' : ''}
                >
                  <option value="kg">Kilogram (kg)</option>
                  <option value="g">Gram (g)</option>
                  <option value="piece">Piece</option>
                  <option value="bunch">Bunch</option>
                  <option value="dozen">Dozen</option>
                  <option value="liter">Liter</option>
                  <option value="ml">Milliliter</option>
                </select>
                {errors.unit && <span className="error-text">{errors.unit}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="minOrderQuantity">Min Order Quantity</label>
                <input
                  type="number"
                  id="minOrderQuantity"
                  name="minOrderQuantity"
                  value={formData.minOrderQuantity}
                  onChange={handleInputChange}
                  placeholder="1"
                  min="1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxOrderQuantity">Max Order Quantity</label>
                <input
                  type="number"
                  id="maxOrderQuantity"
                  name="maxOrderQuantity"
                  value={formData.maxOrderQuantity}
                  onChange={handleInputChange}
                  className={errors.maxOrderQuantity ? 'error' : ''}
                  placeholder="100"
                  min="1"
                />
                {errors.maxOrderQuantity && <span className="error-text">{errors.maxOrderQuantity}</span>}
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="form-section">
            <h3>Product Images</h3>
            
            <div className="form-group">
              <label htmlFor="images">Upload Images (Max 5) {!product && '*'}</label>
              <input
                type="file"
                id="images"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageChange}
                className={errors.images ? 'error' : ''}
              />
              {errors.images && <span className="error-text">{errors.images}</span>}
              <small>Supported formats: JPEG, PNG, WebP. Max size: 5MB per image.</small>
            </div>

            {imagePreviews.length > 0 && (
              <div className="image-previews">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="image-preview">
                    <img src={preview} alt={`Preview ${index + 1}`} />
                    <button
                      type="button"
                      className="remove-image"
                      onClick={() => removeImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="form-section">
            <h3>Tags</h3>
            
            <div className="form-group">
              <div className="tag-input">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <button type="button" onClick={addTag}>Add</button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="tags-list">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="form-section">
            <h3>Additional Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="harvestDate">Harvest Date</label>
                <input
                  type="date"
                  id="harvestDate"
                  name="harvestDate"
                  value={formData.harvestDate}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="expiryDate">Expiry Date</label>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="farmLocation">Farm Location</label>
              <input
                type="text"
                id="farmLocation"
                name="farmLocation"
                value={formData.farmLocation}
                onChange={handleInputChange}
                placeholder="e.g., Kathmandu Valley, Nepal"
              />
            </div>

            <div className="form-checkboxes">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isOrganic"
                  checked={formData.isOrganic}
                  onChange={handleInputChange}
                />
                Organic Product
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleInputChange}
                />
                Featured Product
              </label>

              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                />
                Active Product
              </label>
            </div>
          </div>

          {/* Nutrition Information */}
          <div className="form-section">
            <h3>Nutrition Information (Optional)</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nutrition.calories">Calories (per 100g)</label>
                <input
                  type="number"
                  id="nutrition.calories"
                  name="nutrition.calories"
                  value={formData.nutritionInfo.calories}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nutrition.protein">Protein (g)</label>
                <input
                  type="number"
                  id="nutrition.protein"
                  name="nutrition.protein"
                  value={formData.nutritionInfo.protein}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nutrition.carbs">Carbohydrates (g)</label>
                <input
                  type="number"
                  id="nutrition.carbs"
                  name="nutrition.carbs"
                  value={formData.nutritionInfo.carbs}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nutrition.fat">Fat (g)</label>
                <input
                  type="number"
                  id="nutrition.fat"
                  name="nutrition.fat"
                  value={formData.nutritionInfo.fat}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nutrition.fiber">Fiber (g)</label>
                <input
                  type="number"
                  id="nutrition.fiber"
                  name="nutrition.fiber"
                  value={formData.nutritionInfo.fiber}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="nutrition.vitamins">Key Vitamins</label>
                <input
                  type="text"
                  id="nutrition.vitamins"
                  name="nutrition.vitamins"
                  value={formData.nutritionInfo.vitamins}
                  onChange={handleInputChange}
                  placeholder="e.g., Vitamin C, Vitamin A"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="button"
            className="btn-secondary"
            onClick={onCancel}
            disabled={loading || isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
            disabled={loading || isLoading}
          >
            {loading || isLoading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>

      <style jsx>{`
        .product-form {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }

        .product-form-container {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          padding: 30px;
        }

        .form-header {
          margin-bottom: 30px;
          border-bottom: 2px solid #f0f0f0;
          padding-bottom: 15px;
        }

        .form-header h2 {
          color: #2d3748;
          font-size: 28px;
          font-weight: 600;
          margin: 0;
        }

        .form-grid {
          display: grid;
          gap: 30px;
        }

        .form-section {
          background: #f8f9fa;
          border-radius: 8px;
          padding: 25px;
          border-left: 4px solid #4CAF50;
        }

        .form-section h3 {
          color: #2d3748;
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 20px 0;
          display: flex;
          align-items: center;
        }

        .form-section h3:before {
          content: '';
          width: 6px;
          height: 20px;
          background: #4CAF50;
          margin-right: 10px;
          border-radius: 3px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .form-group label {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
          font-size: 14px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
          background: white;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #4CAF50;
          box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
        }

        .form-group input.error,
        .form-group select.error,
        .form-group textarea.error {
          border-color: #ef4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-group small {
          display: block;
          color: #6b7280;
          font-size: 12px;
          margin-top: 5px;
        }

        .error-text {
          color: #ef4444;
          font-size: 12px;
          margin-top: 5px;
          display: block;
        }

        .image-previews {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .image-preview {
          position: relative;
          aspect-ratio: 1;
          border-radius: 8px;
          overflow: hidden;
          border: 2px solid #e2e8f0;
        }

        .image-preview img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image {
          position: absolute;
          top: 5px;
          right: 5px;
          background: #ef4444;
          color: white;
          border: none;
          border-radius: 50%;
          width: 24px;
          height: 24px;
          font-size: 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }

        .remove-image:hover {
          background: #dc2626;
        }

        .tag-input {
          display: flex;
          gap: 10px;
          margin-bottom: 15px;
        }

        .tag-input input {
          flex: 1;
        }

        .tag-input button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 12px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background 0.2s ease;
        }

        .tag-input button:hover {
          background: #45a049;
        }

        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag {
          background: #e3f2fd;
          color: #1976d2;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .tag button {
          background: none;
          border: none;
          color: #1976d2;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tag button:hover {
          background: #1976d2;
          color: white;
        }

        .form-checkboxes {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 500;
          cursor: pointer;
        }

        .checkbox-label input[type="checkbox"] {
          width: auto;
          margin: 0;
          transform: scale(1.2);
        }

        .form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 15px;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 2px solid #f0f0f0;
        }

        .btn-primary,
        .btn-secondary {
          padding: 12px 30px;
          border-radius: 8px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          border: 2px solid transparent;
        }

        .btn-primary {
          background: #4CAF50;
          color: white;
          border-color: #4CAF50;
        }

        .btn-primary:hover:not(:disabled) {
          background: #45a049;
          border-color: #45a049;
          transform: translateY(-1px);
        }

        .btn-secondary {
          background: white;
          color: #6b7280;
          border-color: #d1d5db;
        }

        .btn-secondary:hover:not(:disabled) {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .btn-primary:disabled,
        .btn-secondary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        @media (max-width: 768px) {
          .product-form {
            padding: 10px;
          }

          .product-form-container {
            padding: 20px;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 15px;
          }

          .form-actions {
            flex-direction: column;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductForm;
