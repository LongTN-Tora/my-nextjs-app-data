'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

type AnyRecord = Record<string, unknown>;

function isRecord(v: unknown): v is AnyRecord {
  return !!v && typeof v === 'object' && !Array.isArray(v);
}

function isRecordArray(v: unknown): v is AnyRecord[] {
  return Array.isArray(v) && v.every(isRecord);
}

function toDisplayString(v: unknown) {
  if (v === null) return 'null';
  if (v === undefined) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function pickField(row: AnyRecord, keys: string[]) {
  for (const k of keys) {
    if (k in row && row[k] !== undefined && row[k] !== null) return row[k];
  }
  return undefined;
}

function formatNumber(v: unknown) {
  const n =
    typeof v === 'number'
      ? v
      : typeof v === 'string'
        ? Number(v.replace(/,/g, ''))
        : NaN;
  if (!Number.isFinite(n)) return toDisplayString(v);
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(n);
}

function formatCurrency(v: unknown) {
  const n =
    typeof v === 'number'
      ? v
      : typeof v === 'string'
        ? Number(v.replace(/,/g, ''))
        : NaN;
  if (!Number.isFinite(n)) return toDisplayString(v);
  return new Intl.NumberFormat(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n);
}

const ESTIMATE_COLUMNS: Array<{
  header: string;
  keys: string[];
  render?: (v: unknown) => string;
}> = [
  { header: 'CustomerName', keys: ['crca3_customername'] },
  { header: 'ProjectName', keys: ['crca3_projectname'] },
  { header: 'Requester', keys: ['crca3_requester'] },
  { header: 'CustomerEmail', keys: ['crca3_customeremail'] },
  { header: 'WorkType', keys: ['crca3_worktype'] },
  { header: 'Quantity', keys: ['crca3_quantity'], render: formatNumber },
  { header: 'Unit', keys: ['crca3_unit'] },
  { header: 'UnitPrice', keys: ['crca3_unitprice'], render: formatCurrency },
  { header: 'Subtotal', keys: ['crca3_subtotal'], render: formatCurrency },
  { header: 'Tax', keys: ['crca3_tax'], render: formatCurrency },
];

export default function PowerAppPage() {
  const [data, setData] = useState<unknown>([]);
  const [raw, setRaw] = useState<unknown>(null);
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
      console.log("11111111111", result);
      
      if (result.success) {
        setData(result.data);
        setRaw(result.raw ?? null);
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

      {loading ? (
        <p>Loading data...</p>
      ) : (
        <div>
          <h2>Data</h2>

          {isRecordArray(data) ? (
            <div style={{ overflowX: 'auto' }}>
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    {ESTIMATE_COLUMNS.map((c) => (
                      <th
                        key={c.header}
                        style={{
                          padding: '0.75rem',
                          textAlign: 'left',
                          borderBottom: '2px solid #ddd',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.length === 0 ? (
                    <tr>
                      <td
                        colSpan={ESTIMATE_COLUMNS.length}
                        style={{ padding: '1rem', textAlign: 'center' }}
                      >
                        No data found
                      </td>
                    </tr>
                  ) : (
                    data.map((row, idx) => (
                      <tr key={String(row.id ?? row.ID ?? row.estimateid ?? idx)} style={{ borderBottom: '1px solid #eee' }}>
                        {ESTIMATE_COLUMNS.map((c) => {
                          const v = pickField(row, c.keys);
                          const out = c.render ? c.render(v) : toDisplayString(v);
                          return (
                            <td key={c.header} style={{ padding: '0.75rem', whiteSpace: 'nowrap' }}>
                              {out}
                            </td>
                          );
                        })}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div>
              <p style={{ marginTop: 0 }}>
                Dữ liệu trả về không phải dạng “array of objects”, nên mình hiển thị JSON.
              </p>
              <pre
                style={{
                  backgroundColor: '#fff',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflow: 'auto',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
              >
{JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

