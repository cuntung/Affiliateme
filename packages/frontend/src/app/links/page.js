'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { linksAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';

export default function LinksPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [links, setLinks] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    originalUrl: '',
    title: '',
    description: '',
    category: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchLinks();
    }
  }, [user]);

  const fetchLinks = async () => {
    try {
      setLoadingData(true);
      const response = await linksAPI.getAll();
      setLinks(response.data.data.links);
      setError('');
    } catch (err) {
      setError('Failed to load links');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await linksAPI.create(formData);
      setShowModal(false);
      setFormData({ originalUrl: '', title: '', description: '', category: '' });
      fetchLinks();
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to create link');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await linksAPI.delete(id);
      fetchLinks();
    } catch (err) {
      setError('Failed to delete link');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Short URL copied to clipboard!');
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Affiliate Links</h1>
            <button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
            >
              + Create Link
            </button>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {loadingData ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading links...</p>
            </div>
          ) : links.length > 0 ? (
            <div className="grid gap-6">
              {links.map((link) => (
                <div key={link.id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{link.title}</h3>
                      {link.description && (
                        <p className="text-sm text-gray-600 mt-1">{link.description}</p>
                      )}
                      {link.category && (
                        <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                          {link.category}
                        </span>
                      )}
                      <div className="mt-3 space-y-1">
                        <p className="text-sm text-gray-500">
                          Original: <span className="text-gray-700">{link.originalUrl}</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">
                            Short URL: <span className="text-primary-600 font-medium">{link.shortUrl}</span>
                          </p>
                          <button
                            onClick={() => copyToClipboard(link.shortUrl)}
                            className="text-sm text-primary-600 hover:text-primary-700"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col items-end gap-2">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{link.clicks}</p>
                        <p className="text-sm text-gray-500">clicks</p>
                      </div>
                      <button
                        onClick={() => handleDelete(link.id)}
                        className="text-sm text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card text-center py-12">
              <p className="text-gray-600 mb-4">No affiliate links yet. Create your first one!</p>
              <button onClick={() => setShowModal(true)} className="btn btn-primary">
                Create Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Link Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Create Affiliate Link</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  placeholder="My Awesome Product"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Original URL *
                </label>
                <input
                  type="url"
                  required
                  className="input"
                  placeholder="https://example.com/product?ref=..."
                  value={formData.originalUrl}
                  onChange={(e) => setFormData({ ...formData, originalUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  className="input"
                  rows="3"
                  placeholder="Optional description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Electronics, Fashion"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="btn btn-secondary flex-1"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
