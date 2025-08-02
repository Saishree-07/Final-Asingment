'use client';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function EntryForm({ entry = null, isEditing = false }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: entry?.title || '',
    content: entry?.content || '',
    tags: entry?.tags || ''
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    console.log('=== FORM SUBMISSION STARTED ==='); // Debug log
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Submitting form with files:', files); // Debug log
      console.log('Files array length:', files.length); // Debug log
      
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('content', form.content);
      formData.append('tags', form.tags);
      
      // Add files to form data
      files.forEach((file, index) => {
        console.log('Adding file to FormData:', file.name, 'at index:', index); // Debug log
        formData.append(`files`, file);
      });

      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const url = isEditing ? `/api/journal/${entry._id}` : '/api/journal';
      const method = isEditing ? 'PUT' : 'POST';

      console.log('Making request to:', url, 'with method:', method); // Debug log

      const response = await fetch(url, {
        method,
        body: formData,
      });

      console.log('Response status:', response.status); // Debug log

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save entry');
      }

      console.log('Request successful!'); // Debug log
      setSuccess(isEditing ? 'Entry updated successfully!' : 'Entry created successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);

    } catch (err) {
      console.error('Error in form submission:', err); // Debug log
      setError(err.message || 'Failed to save entry. Please try again.');
      console.error('Error saving entry:', err);
    } finally {
      setLoading(false);
      console.log('=== FORM SUBMISSION ENDED ==='); // Debug log
    }
  };

  const handleFileChange = (e) => {
    console.log('File input change event:', e.target.files); // Debug log
    const selectedFiles = Array.from(e.target.files);
    console.log('Selected files:', selectedFiles); // Debug log
    
    const validFiles = selectedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB limit
      
      console.log('File validation:', file.name, { isValidType, isValidSize }); // Debug log
      
      if (!isValidType) {
        alert(`${file.name} is not a valid file type. Please upload images or PDFs only.`);
      }
      if (!isValidSize) {
        alert(`${file.name} is too large. Please upload files smaller than 10MB.`);
      }
      
      return isValidType && isValidSize;
    });

    console.log('Valid files after filtering:', validFiles); // Debug log
    setFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('dragover');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('dragover');
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type === 'application/pdf';
      const isValidSize = file.size <= 10 * 1024 * 1024;
      return isValidType && isValidSize;
    });

    setFiles(prev => [...prev, ...validFiles]);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="form-container">
      <h2 className="text-center mb-4">
        {isEditing ? '✏️ Edit Journal Entry' : '📝 Create New Journal Entry'}
      </h2>

      {error && (
        <div className="alert alert-error">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          ✅ {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title *</label>
      <input
            id="title"
        type="text"
            className="form-input"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Enter your journal entry title"
        required
      />
        </div>

        <div className="form-group">
          <label htmlFor="content" className="form-label">Content *</label>
      <textarea
            id="content"
            className="form-textarea"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Write about your learning experience, insights, or reflections..."
        required
      />
        </div>

        <div className="form-group">
          <label htmlFor="tags" className="form-label">Tags</label>
          <input
            id="tags"
            type="text"
            className="form-input"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            placeholder="Enter tags separated by commas (e.g., javascript, react, learning)"
          />
          <small style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Tags help you organize and find your entries later
          </small>
        </div>

        <div className="form-group">
          <label className="form-label">Attachments (Photos & PDFs)</label>
          <div
            className="file-upload"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="upload-icon">📁</div>
            <div className="upload-text">
              <strong>Click to upload</strong> or drag and drop files here
            </div>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Supports: JPG, PNG, GIF, PDF (Max 10MB each)
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="file-input"
            />
          </div>

          {files.length > 0 && (
            <div className="file-preview">
              {files.map((file, index) => (
                <div key={index} className="file-item">
                  {file.type.startsWith('image/') ? (
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      width={40}
                      height={40}
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />
                  ) : (
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      background: 'var(--primary-color)', 
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.5rem'
                    }}>
                      📄
                    </div>
                  )}
                  <div className="file-info">
                    <div className="file-name">{file.name}</div>
                    <div className="file-size">{formatFileSize(file.size)}</div>
                  </div>
                  <button
                    type="button"
                    className="remove-file"
                    onClick={() => removeFile(index)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => router.back()}
            disabled={loading}
          >
            ← Cancel
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || !form.title || !form.content}
            onClick={() => console.log('Submit button clicked!')} // Debug log
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                {isEditing ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                {isEditing ? '✏️ Update Entry' : '📝 Create Entry'}
              </>
            )}
      </button>
        </div>
    </form>
    </div>
  );
}
