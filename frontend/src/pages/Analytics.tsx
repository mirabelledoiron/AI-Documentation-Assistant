import { useEffect, useState } from 'react';
import { BarChart2 } from 'lucide-react';
import { analyticsApi } from '@/services/api';
import type { UserQuery } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/EmptyState';

export function Analytics() {
  const [queries, setQueries] = useState<UserQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await analyticsApi.getPopularQueries();
        if (mounted) setQueries(data);
      } catch (e) {
        if (mounted) setError('Failed to load query log');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle>Query Log</CardTitle>
      </CardHeader>
      <CardContent>
      {loading && (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
              <Skeleton className="h-4 w-16" />
            </div>
          ))}
        </div>
      )}
      {error && <div className="text-destructive text-sm">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-muted-foreground border-b border-border">
                <th className="py-2 pr-4">When</th>
                <th className="py-2 pr-4">Query</th>
                <th className="py-2 pr-4">Response</th>
              </tr>
            </thead>
            <tbody>
              {queries.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-0">
                    <EmptyState
                      icon={<BarChart2 className="w-6 h-6" />}
                      title="No queries yet"
                      description="Start a conversation or run a search to see query history here."
                      actionLabel="Start chatting"
                      actionTo="/chat"
                    />
                  </td>
                </tr>
              ) : (
                queries.map((q) => (
                  <>
                    <tr key={q.id} className="border-b border-border align-top">
                      <td className="py-2 pr-4 whitespace-nowrap text-muted-foreground">
                        {q.created_at ? new Date(q.created_at).toLocaleString() : '-'}
                      </td>
                      <td className="py-2 pr-4 font-medium text-foreground max-w-[28rem]">
                        <div className="whitespace-pre-wrap">{q.query}</div>
                      </td>
                      <td className="py-2 pr-4 text-muted-foreground whitespace-nowrap">
                        {q.response && q.response.trim() ? (
                          <Button
                            type="button"
                            variant="ghost"
                            className="h-8 px-2 text-primary"
                            onClick={() => setExpandedId((cur) => (cur === q.id ? null : q.id))}
                          >
                            {expandedId === q.id ? 'Hide' : 'View'}
                          </Button>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>

                    {expandedId === q.id && q.response && q.response.trim() && (
                      <tr className="border-b border-border">
                        <td colSpan={3} className="py-3 pr-4">
                          <div className="rounded-md border border-border bg-card p-3">
                            <div className="text-xs font-medium text-muted-foreground mb-2">Full response</div>
                            <div className="text-sm text-foreground whitespace-pre-wrap max-h-80 overflow-y-auto">
                              {q.response}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
      </CardContent>
    </Card>
  );
}

