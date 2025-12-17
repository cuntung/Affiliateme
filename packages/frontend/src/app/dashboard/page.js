'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../lib/AuthContext';
import { analyticsAPI } from '../../lib/api';
import Navbar from '../../components/Navbar';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchAnalytics();
    }
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      setLoadingData(true);
      const response = await analyticsAPI.getOverview();
      setAnalytics(response.data.data);
      setError('');
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoadingData(false);
    }
  };

  if (loading || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

          {error && (
            <div className="rounded-md bg-red-50 p-4 mb-6">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {loadingData ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          ) : analytics ? (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                <div className="card">
                  <h3 className="text-sm font-medium text-gray-500">Total Clicks</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {analytics.totalClicks.toLocaleString()}
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    ${analytics.totalEarnings.toFixed(2)}
                  </p>
                </div>

                <div className="card">
                  <h3 className="text-sm font-medium text-gray-500">Active Links</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {analytics.totalLinks}
                  </p>
                </div>
              </div>

              {/* Clicks Chart */}
              {analytics.clicksByDate.length > 0 && (
                <div className="card mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Clicks Over Time</h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={analytics.clicksByDate}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Line
                        type="monotone"
                        dataKey="clicks"
                        stroke="#3b82f6"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}

              {/* Top Links */}
              {analytics.topLinks.length > 0 && (
                <div className="card">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performing Links</h2>
                  <div className="space-y-4">
                    {analytics.topLinks.map((link) => (
                      <div key={link.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-gray-900">{link.title}</p>
                          <p className="text-sm text-gray-500">{link.clicks} clicks</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-primary-600">
                            ${link.earnings.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {analytics.topLinks.length === 0 && analytics.totalLinks === 0 && (
                <div className="card text-center py-12">
                  <p className="text-gray-600 mb-4">No links yet. Create your first affiliate link!</p>
                  <button
                    onClick={() => router.push('/links')}
                    className="btn btn-primary"
                  >
                    Create Link
                  </button>
                </div>
              )}
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
