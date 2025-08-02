'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function Dashboard() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/journal');
      if (!res.ok) throw new Error('Failed to fetch entries');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      setError('Failed to load entries. Please try again.');
      console.error('Failed to load entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete entry');
      
      // Remove from state
      setEntries(entries.filter(entry => entry._id !== id));
    } catch (err) {
      setError('Failed to delete entry. Please try again.');
      console.error('Failed to delete:', err);
    }
  };

  const renderFilePreview = (files) => {
    if (!files || files.length === 0) return null;
    
    return (
      <div style={{ marginTop: '1rem' }}>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
          📎 Attachments ({files.length})
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {files.slice(0, 3).map((file, index) => (
            <div key={index} style={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '4px',
              overflow: 'hidden',
              border: '1px solid var(--border-color)',
              cursor: 'pointer'
            }}
            onClick={() => window.open(file, '_blank')}
            title="Click to view/download"
            >
              {file.endsWith('.pdf') ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'var(--primary-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '1rem'
                }}>
                  📄
                </div>
              ) : (
                <Image 
                  src={file} 
                  alt="attachment"
                  width={40}
                  height={40}
                  style={{ objectFit: 'cover' }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              )}
            </div>
          ))}
          {files.length > 3 && (
            <div style={{
              width: '40px',
              height: '40px',
              background: 'var(--bg-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: 'var(--text-secondary)'
            }}>
              +{files.length - 3}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading">
          <div className="spinner"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            📓 My Journal Entries
          </h1>
          <button 
            className="btn btn-primary btn-lg" 
            onClick={() => router.push('/journal/new')}
          >
            + Add New Entry
          </button>
        </div>

        {error && (
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        )}

        <div className="entry-grid">
          {entries.length === 0 ? (
            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
              <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
                No entries yet
              </h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                Start your learning journey by creating your first journal entry.
              </p>
              <button 
                className="btn btn-primary btn-lg"
                onClick={() => router.push('/journal/new')}
              >
                Create Your First Entry
              </button>
            </div>
          ) : (
            entries.map((entry) => (
              <div key={entry._id} className="entry-card">
                <div className="entry-header">
                  <h2 
                    className="entry-title"
                    style={{ cursor: 'pointer' }}
                    onClick={() => router.push(`/journal/view/${entry._id}`)}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary-color)'}
                    onMouseLeave={(e) => e.target.style.color = 'var(--text-primary)'}
                  >
                    {entry.title}
                  </h2>
                  <div className="entry-date">
                    {new Date(entry.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div className="entry-content">
                  <p>{entry.content.slice(0, 150)}...</p>
                  
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="entry-tags">
                      {entry.tags.split(',').map((tag, index) => (
                        <span key={index} className="tag">
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  {renderFilePreview(entry.files)}
                </div>
                
                <div className="entry-actions">
                  <button 
                    className="btn btn-primary btn-sm"
                    onClick={() => router.push(`/journal/view/${entry._id}`)}
                  >
                    👁️ View
                  </button>
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={() => router.push(`/journal/${entry._id}`)}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(entry._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
