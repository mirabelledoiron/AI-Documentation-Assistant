// frontend/src/components/Admin/DocumentUpload.tsx
import React, { useState } from 'react';
import { Upload, X, Check } from 'lucide-react';
import { documentApi } from '@/services/api';
import api from '@/services/api';
import { Button } from '@/components/Shared/Button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

export const DocumentUpload: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [url, setUrl] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsUploading(true);
    setMessage(null);

    try {
      await documentApi.createDocument({
        title,
        content,
        url,
        category,
        tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });

      setMessage({ type: 'success', text: 'Document uploaded successfully!' });
      setTitle('');
      setContent('');
      setUrl('');
      setCategory('');
      setTags('');
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to upload document' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Upload className="w-6 h-6 text-primary" />
          Upload Documentation
        </h2>
        <p className="text-muted-foreground mt-1">Add new documentation to the AI assistant's knowledge base</p>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="text-sm text-foreground font-medium mb-1">Where your upload goes</div>
          <div className="text-sm text-muted-foreground space-y-1">
            <div>
              Your document is saved to the database (Postgres) as a row in <span className="font-medium text-foreground">documents</span>.
            </div>
            <div>
              The backend then generates an embedding and stores it in <span className="font-medium text-foreground">embeddings</span> so Search and Chat can retrieve it.
            </div>
            <div>
              After upload, try asking about the title/content in Chat or using the header search bar.
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="text-sm text-foreground font-medium mb-1">Seed from Atelier Storybook</div>
          <div className="text-sm text-muted-foreground">
            Pulls documentation/tokens from the configured GitHub repo into your local database.
          </div>
          <div className="mt-3 flex items-center gap-3">
            <Button
              type="button"
              variant="secondary"
              loading={isSyncing}
              onClick={async () => {
                setIsSyncing(true);
                setSyncMessage(null);
                try {
                  const res = await api.post('/admin/atelier/sync', { ref: 'main', limit: 200 });
                  const embedded = res.data?.embedded ?? 0;
                  const upserted = res.data?.upserted ?? 0;
                  setSyncMessage({ type: 'success', text: `Synced ${upserted} docs, embedded ${embedded}.` });
                } catch {
                  setSyncMessage({ type: 'error', text: 'Sync failed. Check backend logs and API key.' });
                } finally {
                  setIsSyncing(false);
                }
              }}
            >
              Sync Atelier Storybook
            </Button>
            <div className="text-xs text-muted-foreground">Dev-only. Disabled in production.</div>
          </div>

          {syncMessage && (
            <div
              className={`mt-3 p-3 rounded-md ${
                syncMessage.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-2">
                {syncMessage.type === 'success' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <X className="w-5 h-5 text-red-600" />
                )}
                <span className={syncMessage.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                  {syncMessage.text}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Title *
          </label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Content *
          </label>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[200px]"
            placeholder="Document content..."
            required
          />
          <div className="mt-1 text-xs text-muted-foreground">
            Tip: paste the canonical documentation text you want the assistant to quote and search.
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              URL
            </label>
            <Input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
            />
            <div className="mt-1 text-xs text-muted-foreground">
              Optional. If present, it will be shown as a clickable source.
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ring-offset-background"
            >
              <option value="">Select category</option>
              <option value="Components">Components</option>
              <option value="Patterns">Patterns</option>
              <option value="Guidelines">Guidelines</option>
              <option value="Accessibility">Accessibility</option>
              <option value="Tokens">Design Tokens</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Tags (comma separated)
          </label>
          <Input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="button, form, validation"
          />
        </div>

        {message && (
          <div
            className={`p-3 rounded-md ${
              message.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === 'success' ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-600" />
              )}
              <span className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
                {message.text}
              </span>
            </div>
          </div>
        )}

        <Button
          type="submit"
          disabled={!title || !content}
          loading={isUploading}
          icon={<Upload className="w-5 h-5" />}
          className="w-full h-12"
        >
          Upload Document
        </Button>
      </form>
    </div>
  );
};
