'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/Navbar';

export default function ViewEntry({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/journal/${id}`);
        if (!res.ok) throw new Error('Failed to fetch entry');
        const data = await res.json();
        console.log('Fetched entry:', data); // Debug log
        console.log('Entry files:', data.files); // Debug log
        setEntry(data);
      } catch (err) {
        setError('Failed to load entry. Please try again.');
        console.error('Error fetching entry:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) throw new Error('Failed to delete entry');
      
      router.push('/dashboard');
    } catch (err) {
      setError('Failed to delete entry. Please try again.');
      console.error('Error deleting entry:', err);
    }
  };

  const renderFiles = (files) => {
    console.log('renderFiles called with:', files); // Debug log
    if (!files || files.length === 0) {
      console.log('No files to render'); // Debug log
      return null;
    }
    
    return (
      <div className="mt-4">
        <h3 className="mb-3" style={{ color: 'var(--text-primary)', fontSize: '1.125rem' }}>
          📎 Attachments ({files.length})
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {files.map((file, index) => {
            console.log('Rendering file:', file, 'at index:', index); // Debug log
            return (
              <div key={index} className="card" style={{ overflow: 'hidden' }}>
                {file.endsWith('.pdf') ? (
                  <div style={{
                    height: '150px',
                    background: 'var(--primary-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '3rem',
                    borderRadius: 'var(--radius) 0 0 var(--radius)'
                  }}>
                    📄
                  </div>
                ) : (
                  <div style={{ position: 'relative', height: '150px' }}>
                    <Image 
                      src={file} 
                      alt="attachment"
                      width={200}
                      height={150}
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'cover',
                        borderRadius: 'var(--radius) 0 0 var(--radius)'
                      }}
                      onError={(e) => {
                        console.log('Image failed to load:', file); // Debug log
                        e.target.style.display = 'none';
                        const fallback = e.target.nextSibling;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                      onLoad={() => console.log('Image loaded successfully:', file)} // Debug log
                    />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: 'var(--bg-secondary)',
                      display: 'none',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 'var(--radius) 0 0 var(--radius)',
                      fontSize: '2rem'
                    }}>
                      📷
                    </div>
                  </div>
                )}
                <div className="p-3">
                  <div style={{ 
                    fontSize: '0.875rem', 
                    fontWeight: '500', 
                    color: 'var(--text-primary)',
                    marginBottom: '0.5rem',
                    wordBreak: 'break-word'
                  }}>
                    {file.split('/').pop()}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a 
                      href={file} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-outline btn-sm"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      👁️ View
                    </a>
                    <a 
                      href={file} 
                      download
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      ⬇️ Download
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
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

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="alert alert-error">
            ⚠️ {error}
          </div>
        </div>
      </>
    );
  }

  if (!entry) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="alert alert-error">
            ⚠️ Entry not found
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="container" style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div className="card">
          <div className="card-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ 
                  fontSize: '2rem', 
                  fontWeight: '700', 
                  color: 'var(--text-primary)',
                  marginBottom: '0.5rem'
                }}>
                  {entry.title}
                </h1>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: 'var(--text-secondary)',
                  marginBottom: '1rem'
                }}>
                  Created: {new Date(entry.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                  {entry.updatedAt && entry.updatedAt !== entry.createdAt && (
                    <span style={{ marginLeft: '1rem' }}>
                      • Updated: {new Date(entry.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => router.push(`/journal/${entry._id}`)}
                >
                  ✏️ Edit
                </button>
                <button 
                  className="btn btn-danger btn-sm"
                  onClick={handleDelete}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
          
          <div className="card-body">
            {entry.tags && entry.tags.length > 0 && (
              <div className="entry-tags" style={{ marginBottom: '2rem' }}>
                {entry.tags.split(',').map((tag, index) => (
                  <span key={index} className="tag">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}
            
            <div style={{ 
              lineHeight: '1.8', 
              fontSize: '1.125rem',
              color: 'var(--text-primary)',
              whiteSpace: 'pre-wrap'
            }}>
              {entry.content}
            </div>
            
            {renderFiles(entry.files)}
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            className="btn btn-outline"
            onClick={() => router.push('/dashboard')}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </>
  );
} 