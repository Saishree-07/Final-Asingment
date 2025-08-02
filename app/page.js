'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <>
      <Navbar />
      
      <main>
        {/* Hero Section */}
        <section className="landing-container">
          <div className="hero-section">
            <h1 className="hero-title">
              Track Your Learning Journey
            </h1>
            <p className="hero-subtitle">
              A modern journal system to document your educational experiences, 
              insights, and progress. Capture your thoughts, upload files, and 
              organize your learning with ease.
            </p>
            <div className="hero-actions">
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className="btn btn-primary btn-lg">
                    Go to Dashboard
                  </Link>
                  <Link href="/journal/new" className="btn btn-outline btn-lg">
                    Create New Entry
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="btn btn-primary btn-lg">
                    Get Started
                  </Link>
                  <Link href="/auth/signup" className="btn btn-outline btn-lg">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <div className="container">
            <h2 className="text-center mb-5" style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--text-primary)' }}>
              Why Choose Our Journal System?
            </h2>
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">📝</div>
                <h3 className="feature-title">Easy Journaling</h3>
                <p className="feature-description">
                  Create rich journal entries with titles, content, and tags. 
                  Organize your thoughts and track your learning progress.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📁</div>
                <h3 className="feature-title">File Uploads</h3>
                <p className="feature-description">
                  Upload photos and PDFs to enhance your journal entries. 
                  Keep all your learning materials in one place.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔍</div>
                <h3 className="feature-title">Smart Organization</h3>
                <p className="feature-description">
                  Tag your entries and search through your learning history. 
                  Find exactly what you need when you need it.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">📱</div>
                <h3 className="feature-title">Responsive Design</h3>
                <p className="feature-description">
                  Access your journal from any device. Clean, modern interface 
                  that works perfectly on desktop, tablet, and mobile.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">🔒</div>
                <h3 className="feature-title">Secure & Private</h3>
                <p className="feature-description">
                  Your learning journal is private and secure. Your data is 
                  protected and only accessible to you.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">⚡</div>
                <h3 className="feature-title">Fast & Reliable</h3>
                <p className="feature-description">
                  Built with modern technology for speed and reliability. 
                  Never lose your progress with automatic saving.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
