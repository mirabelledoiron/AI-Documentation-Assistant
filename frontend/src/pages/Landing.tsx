import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Search, MessageCircle, Upload, BarChart2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function Landing() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl bg-gradient-to-br from-muted to-background border border-border p-8">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold tracking-wide text-atelier-primary uppercase mb-3">
            Atelier Design System
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            AI-Powered Documentation Assistant
          </h1>
          <p className="mt-3 text-muted-foreground text-base sm:text-lg">
            Centralize your design system knowledge in one place. Upload documentation, run semantic search,
            and chat with an assistant that answers using your own sources.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
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
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <FeatureCard
          icon={<BookOpen className="w-5 h-5" />}
          title="Bring your docs"
          body="Add guidelines, component usage, tokens, and patterns as plain text. The system stores them in Postgres."
        />
        <FeatureCard
          icon={<Search className="w-5 h-5" />}
          title="Semantic search"
          body="Use the search bar in the header to find the best match even when you don’t know the exact keywords. Powered by pgvector similarity search."
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
      </section>

      <section className="bg-card rounded-2xl border border-border p-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">How it works</h2>
        <ol className="space-y-2 text-muted-foreground text-sm">
          <li><strong>1)</strong> Upload docs (or import them in bulk).</li>
          <li><strong>2)</strong> The backend generates embeddings (OpenAI) and stores vectors (pgvector).</li>
          <li><strong>3)</strong> Search and chat queries retrieve top matches, then answer using the retrieved context.</li>
        </ol>
      </section>
    </div>
  );
}

function FeatureCard(props: { icon: React.ReactNode; title: string; body: string; to?: string }) {
  const content = (
    <Card className="h-full hover:shadow-sm transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <span className="text-primary">{props.icon}</span>
          {props.title}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{props.body}</p>
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

