import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Search, MessageCircle, Upload, BarChart2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export function Landing() {
  return (
    <div className="space-y-10">
      {/* Hero */}
      <div className="pt-2">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Design System Documentation
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-2">
          Stop rebuilding what already exists
        </h1>
        <p className="mt-3 text-foreground/70 text-base max-w-2xl leading-relaxed">
          When developers can't find the right component or its API, they build one-off solutions.
          This assistant puts your design system docs in one searchable place -- so every question
          gets an answer grounded in your actual guidelines.
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

      {/* The problem */}
      <Card className="border-primary/20 bg-primary/[0.03]">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground mb-1">The adoption problem</div>
              <div className="text-sm text-foreground/70 leading-relaxed">
                Design systems fail when people can't find what they need. Docs live in Notion, Storybook,
                Figma, and Slack threads. Engineers search three places, give up, and write their own
                version. This tool solves the discovery gap.
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FeatureCard
          icon={<BookOpen className="w-5 h-5" />}
          title="Centralize your docs"
          body="Import guidelines, component APIs, tokens, and usage patterns from wherever they live. One source of truth."
        />
        <FeatureCard
          icon={<Search className="w-5 h-5" />}
          title="Search by intent"
          body='Ask "how do I show a loading state?" instead of guessing the right keywords. Semantic search understands what you mean.'
        />
        <FeatureCard
          icon={<MessageCircle className="w-5 h-5" />}
          title="Get grounded answers"
          body="The AI retrieves matching docs first, then answers using that context. Every response cites its source."
          to="/chat"
        />
        <FeatureCard
          icon={<BarChart2 className="w-5 h-5" />}
          title="See what people ask"
          body="Query logs reveal the real gaps -- what devs search for tells you what your docs are missing."
          to="/analytics"
        />
      </div>

      {/* How it works -- reframed as user journey */}
      <div>
        <div className="text-base font-semibold text-foreground mb-4">How it works</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StepCard
            step="1"
            title="Add your knowledge"
            body="Upload docs manually or sync from a GitHub repo. The system chunks and indexes everything automatically."
          />
          <StepCard
            step="2"
            title="Ask a question"
            body="Search or chat naturally. The backend finds the most relevant docs using vector similarity, not keyword matching."
          />
          <StepCard
            step="3"
            title="Get a cited answer"
            body="The AI composes a response grounded in your docs, with links back to the source material."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard(props: { icon: React.ReactNode; title: string; body: string; to?: string }) {
  const content = (
    <Card className="h-full hover:border-primary/30">
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
  return <Link to={props.to} className="block">{content}</Link>;
}

function StepCard(props: { step: string; title: string; body: string }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold mb-3">
          {props.step}
        </div>
        <div className="text-sm font-semibold text-foreground mb-1">{props.title}</div>
        <div className="text-sm text-foreground/60 leading-relaxed">{props.body}</div>
      </CardContent>
    </Card>
  );
}
