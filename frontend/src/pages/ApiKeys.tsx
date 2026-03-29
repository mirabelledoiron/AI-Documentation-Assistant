import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const LS_PROVIDER = 'ai_provider';
const LS_OPENAI_KEY = 'openai_api_key';
const LS_ANTHROPIC_KEY = 'anthropic_api_key';

type Provider = 'openai' | 'anthropic';

function readLS(key: string): string {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

function writeLS(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // ignore
  }
}

function removeLS(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

export function ApiKeys() {
  const [provider, setProvider] = useState<Provider>('openai');
  const [openAIKey, setOpenAIKey] = useState('');
  const [anthropicKey, setAnthropicKey] = useState('');

  useEffect(() => {
    const savedProvider = (readLS(LS_PROVIDER) as Provider) || 'openai';
    setProvider(savedProvider === 'anthropic' ? 'anthropic' : 'openai');
    setOpenAIKey(readLS(LS_OPENAI_KEY));
    setAnthropicKey(readLS(LS_ANTHROPIC_KEY));
  }, []);

  const hasAnyKey = useMemo(() => {
    return Boolean(openAIKey.trim() || anthropicKey.trim());
  }, [openAIKey, anthropicKey]);

  const onSave = () => {
    writeLS(LS_PROVIDER, provider);
    writeLS(LS_OPENAI_KEY, openAIKey.trim());
    writeLS(LS_ANTHROPIC_KEY, anthropicKey.trim());
    toast.success('API keys saved on this device');
  };

  const onClear = () => {
    removeLS(LS_PROVIDER);
    removeLS(LS_OPENAI_KEY);
    removeLS(LS_ANTHROPIC_KEY);
    setProvider('openai');
    setOpenAIKey('');
    setAnthropicKey('');
    toast.success('API keys cleared');
  };

  return (
    <div className="max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Provider</div>
            <select
              value={provider}
              onChange={(e) => setProvider(e.target.value as Provider)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Keys are stored in your browser (localStorage) and sent with requests to your backend.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">OpenAI API key</div>
            <Input
              type="password"
              value={openAIKey}
              onChange={(e) => setOpenAIKey(e.target.value)}
              placeholder="sk-..."
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Required for document search/embeddings (RAG). Used for chat when Provider is OpenAI.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium text-foreground">Anthropic API key</div>
            <Input
              type="password"
              value={anthropicKey}
              onChange={(e) => setAnthropicKey(e.target.value)}
              placeholder="sk-ant-..."
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              Used for chat when Provider is Anthropic.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button onClick={onSave}>Save</Button>
            <Button variant="outline" onClick={onClear} disabled={!hasAnyKey}>
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
