'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import EntryForm from '@/components/EntryForm';
import Navbar from '@/components/Navbar';

export default function EditEntry({ params }) {
  const { id } = use(params);
  const [entry, setEntry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEntry = async () => {
      try {
        const res = await fetch(`/api/journal/${id}`);
        if (!res.ok) throw new Error('Failed to fetch entry');
        const data = await res.json();
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
      <EntryForm entry={entry} isEditing={true} />
    </>
  );
}
