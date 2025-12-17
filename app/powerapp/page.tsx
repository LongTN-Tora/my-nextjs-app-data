'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DataItem {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  createdAt: string;
}

export default function PowerAppPage() {
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  useEffect(() => {
    // Set API URL
    if (typeof window !== 'undefined') {
      setApiUrl(`${window.location.origin}/api/powerapp`);
    }
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const url = filter
        ? `/api/powerapp?filter=${encodeURIComponent(filter)}`
        : '/api/powerapp';
      const response = await fetch(url);
      const result = await response.json();
      
      if (result.success) {
        setData(result.data);
      } else {
        setError(result.message || 'Failed to fetch data');
      }
    } catch (err) {
      setError('Error fetching data: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilter = () => {
    fetchData();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Link href="/" style={{ color: '#0070f3', textDecoration: 'none' }}>
          ← Back to Home
        </Link>
      </div>

      <h1>Power Apps Data Integration</h1>
      
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '1.5rem', 
        borderRadius: '8px',
        marginBottom: '2rem'
      }}>
        <h2 style={{ marginTop: 0 }}>API Endpoint Information</h2>
        <p><strong>API URL:</strong> <code style={{ backgroundColor: '#fff', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>{apiUrl}</code></p>
        <p><strong>Methods:</strong> GET, POST, OPTIONS</p>
        <p><strong>CORS:</strong> Enabled (All origins allowed)</p>
        
        <div style={{ marginTop: '1rem' }}>
          <h3>GET Request Examples:</h3>
          <ul>
            <li>Get all data: <code>{apiUrl}</code></li>
            <li>Filter by name/category: <code>{apiUrl}?filter=Electronics</code></li>
            <li>Limit results: <code>{apiUrl}?limit=2</code></li>
          </ul>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <h3>POST Request Example (Power Apps):</h3>
          <pre style={{ 
            backgroundColor: '#fff', 
            padding: '1rem', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
{`POST ${apiUrl}
Content-Type: application/json

{
  "name": "New Product",
  "category": "Electronics",
  "price": 199.99,
  "stock": 30
}`}
          </pre>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Filter by name or category..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              flex: 1,
              maxWidth: '300px'
            }}
          />
          <button
            onClick={handleFilter}
            disabled={loading}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#0070f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Loading...' : 'Filter'}
          </button>
          <button
            onClick={() => {
              setFilter('');
              fetchData();
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          Error: {error}
        </div>
      )}

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <h2>Data ({data.length} items)</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#fff',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Category</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Price</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Stock</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Created At</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '1rem', textAlign: 'center' }}>
                      No data found
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '0.75rem' }}>{item.id}</td>
                      <td style={{ padding: '0.75rem' }}>{item.name}</td>
                      <td style={{ padding: '0.75rem' }}>{item.category}</td>
                      <td style={{ padding: '0.75rem' }}>${item.price.toFixed(2)}</td>
                      <td style={{ padding: '0.75rem' }}>{item.stock}</td>
                      <td style={{ padding: '0.75rem' }}>{item.createdAt}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

