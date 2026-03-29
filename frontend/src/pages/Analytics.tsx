import { useEffect, useState } from 'react';
import { analyticsApi } from '@/services/api';
import type { UserQuery } from '@/types';

export function Analytics() {
  const [queries, setQueries] = useState<UserQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await analyticsApi.getPopularQueries();
        if (mounted) setQueries(data);
      } catch (e) {
        if (mounted) setError('Failed to load analytics');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h1 className="text-xl font-semibold text-gray-900 mb-4">Analytics</h1>

      {loading && <div className="text-gray-600">Loading…</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-600 border-b">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Query</th>
                <th className="py-2 pr-4">Response</th>
              </tr>
            </thead>
            <tbody>
              {queries.length === 0 ? (
                <tr>
                  <td className="py-3 text-gray-600" colSpan={3}>
                    No queries yet. Run a search/chat to generate analytics.
                  </td>
                </tr>
              ) : (
                queries.map((q) => (
                  <tr key={q.id} className="border-b">
                    <td className="py-2 pr-4 whitespace-nowrap text-gray-600">
                      {q.created_at ? new Date(q.created_at).toLocaleString() : '-'}
                    </td>
                    <td className="py-2 pr-4 font-medium text-gray-900">{q.query}</td>
                    <td className="py-2 pr-4 text-gray-700">{q.response || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

