import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Search, MessageCircle, Upload, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function Landing() {
  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="pt-2">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Design System Documentation
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-2">
          AI-Powered Documentation Assistant
        </h1>
        <p className="mt-2 text-foreground/70 text-base max-w-2xl">
          Centralize your design system knowledge in one place. Upload documentation,
          run semantic search, and chat with an assistant that answers using your own sources.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/chat" className="inline-flex items-center gap-2">
              Start chatting <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/upload" className="inline-flex items-center gap-2">
              Upload docs <Upload className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <FeatureCard
          icon={<BookOpen className="w-5 h-5" />}
          title="Bring your docs"
          body="Add guidelines, component usage, tokens, and patterns as plain text. The system stores them in Postgres."
        />
        <FeatureCard
          icon={<Search className="w-5 h-5" />}
          title="Semantic search"
          body="Find the best match even when you don't know the exact keywords. Powered by pgvector similarity search."
        />
        <FeatureCard
          icon={<MessageCircle className="w-5 h-5" />}
          title="Chat with context"
          body="The UI retrieves relevant docs first, then the assistant answers using that context."
          to="/chat"
        />
        <FeatureCard
          icon={<BarChart2 className="w-5 h-5" />}
          title="Query log"
          body="See recent questions and responses to understand what people are looking for."
          to="/analytics"
        />
      </div>

      {/* How it works */}
      <Card>
        <CardContent className="p-6">
          <div className="text-base font-semibold text-foreground mb-3">How it works</div>
          <div className="space-y-2 text-foreground/70 text-sm">
            <div><span className="font-medium text-foreground">1.</span> Upload docs (or import them in bulk).</div>
            <div><span className="font-medium text-foreground">2.</span> The backend generates embeddings (OpenAI) and stores vectors (pgvector).</div>
            <div><span className="font-medium text-foreground">3.</span> Search and chat queries retrieve top matches, then answer using the retrieved context.</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function FeatureCard(props: { icon: React.ReactNode; title: string; body: string; to?: string }) {
  const content = (
    <Card className="h-full hover:border-primary/30 transition-colors">
      <CardContent className="p-5">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {props.icon}
          </div>
          <div className="text-sm font-semibold text-foreground">{props.title}</div>
        </div>
        <div className="text-sm text-foreground/60 leading-relaxed">{props.body}</div>
      </CardContent>
    </Card>
  );

  if (!props.to) return content;
  return (
    <Link to={props.to} className="block">
      {content}
    </Link>
  );
}
