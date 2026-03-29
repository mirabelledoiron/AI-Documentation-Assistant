export type AIProvider = 'openai' | 'anthropic';

const LS_PROVIDER = 'ai_provider';
const LS_OPENAI_KEY = 'openai_api_key';
const LS_ANTHROPIC_KEY = 'anthropic_api_key';

export type ProviderKeys = {
  provider: AIProvider;
  openAIKey?: string;
  anthropicKey?: string;
};

function safeRead(key: string): string {
  try {
    return localStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

export function getProviderKeys(): ProviderKeys {
  const providerRaw = safeRead(LS_PROVIDER);
  const provider: AIProvider = providerRaw === 'anthropic' ? 'anthropic' : 'openai';
  const openAIKey = safeRead(LS_OPENAI_KEY).trim();
  const anthropicKey = safeRead(LS_ANTHROPIC_KEY).trim();

  return {
    provider,
    openAIKey: openAIKey || undefined,
    anthropicKey: anthropicKey || undefined,
  };
}
