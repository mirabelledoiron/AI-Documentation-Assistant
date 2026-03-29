import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

export function Process() {
  return (
    <div className="space-y-10">
      <div className="pt-2">
        <span className="text-xs font-semibold tracking-widest text-primary uppercase">
          Design Process
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground leading-tight mt-2">
          Why this exists
        </h1>
        <p className="mt-3 text-foreground/70 text-base max-w-2xl leading-relaxed">
          This project started with a real problem: design system adoption drops
          when developers can't find the component they need. Here's the thinking
          behind the solution.
        </p>
      </div>

      <Separator />

      {/* Problem Discovery */}
      <ProcessSection
        label="Discover"
        title="The problem isn't the system -- it's findability"
        content={[
          "I observed the same pattern across multiple teams: a design system existed, components were built and documented, but engineers kept building one-off solutions anyway.",
          "The root cause wasn't resistance or lack of awareness. It was friction. Documentation lived in Notion, Storybook, Figma annotations, and Slack threads. Finding the right component for a specific use case meant searching three or four tools.",
          "When the cost of searching exceeds the cost of rebuilding, people rebuild. That's the adoption gap.",
        ]}
      />

      {/* Research */}
      <ProcessSection
        label="Define"
        title="How developers actually search for component docs"
        content={[
          'Through conversations with engineers and observing support channels, I identified three distinct search behaviors:',
        ]}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          <InsightCard
            title="Intent-based"
            example='"How do I show a loading state in a table?"'
            insight="They describe what they want to do, not the component name."
          />
          <InsightCard
            title="API-driven"
            example='"What props does Button accept?"'
            insight="They know the component but need the interface details."
          />
          <InsightCard
            title="Pattern-matching"
            example='"Is there a form validation pattern?"'
            insight="They're looking for composition guidance, not individual parts."
          />
        </div>
      </ProcessSection>

      {/* Solution */}
      <ProcessSection
        label="Design"
        title="RAG bridges the gap between question and documentation"
        content={[
          "Traditional search fails because it matches keywords, not intent. A developer searching for 'loading state' won't find docs titled 'Skeleton Component' unless they already know the answer.",
          "Retrieval-Augmented Generation (RAG) solves this by converting docs into vector embeddings and matching on semantic meaning. The AI then composes an answer using the retrieved context, with citations back to the source.",
          "This means the assistant can answer 'how do I show a loading state?' by retrieving the Skeleton component docs, the Spinner docs, and the Button loading prop -- even though the question never mentions any of them.",
        ]}
      />

      {/* Implementation Decisions */}
      <ProcessSection
        label="Develop"
        title="Technical decisions driven by user needs"
        content={[]}
      >
        <div className="space-y-3 mt-1">
          <DecisionCard
            decision="Streaming responses"
            rationale="Developers are impatient searchers. Streaming shows progress immediately and lets them scan the answer as it arrives, reducing perceived wait time."
          />
          <DecisionCard
            decision="Source citations"
            rationale="Trust requires traceability. Every AI response links back to the docs it drew from, so engineers can verify and go deeper."
          />
          <DecisionCard
            decision="Query logging"
            rationale="The most valuable output isn't answers -- it's the questions. Popular queries reveal what's missing from the docs."
          />
          <DecisionCard
            decision="Accessibility + Low Carbon modes"
            rationale="A design system tool should model the standards it advocates. Both modes demonstrate that inclusive and sustainable design are implementation choices, not afterthoughts."
          />
        </div>
      </ProcessSection>

      {/* Outcomes */}
      <ProcessSection
        label="Measure"
        title="What success looks like"
        content={[
          "This tool succeeds when fewer one-off components are built, when support-channel questions decrease, and when query logs show that developers are finding what they need on the first try.",
          "The query log isn't just a feature -- it's a continuous feedback loop. Each unanswered question is a signal to improve the documentation.",
        ]}
      />
    </div>
  );
}

function ProcessSection({ label, title, content, children }: {
  label: string;
  title: string;
  content: string[];
  children?: React.ReactNode;
}) {
  return (
    <div>
      <span className="text-xs font-semibold tracking-widest text-primary uppercase">{label}</span>
      <div className="text-lg font-semibold text-foreground mt-1 mb-3">{title}</div>
      <div className="space-y-3 text-sm text-foreground/70 leading-relaxed max-w-2xl">
        {content.map((p, i) => (
          <div key={i}>{p}</div>
        ))}
      </div>
      {children}
    </div>
  );
}

function InsightCard({ title, example, insight }: { title: string; example: string; insight: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm font-semibold text-foreground mb-1">{title}</div>
        <div className="text-xs text-primary italic mb-2">{example}</div>
        <div className="text-xs text-foreground/60 leading-relaxed">{insight}</div>
      </CardContent>
    </Card>
  );
}

function DecisionCard({ decision, rationale }: { decision: string; rationale: string }) {
  return (
    <div className="flex gap-3 text-sm">
      <div className="w-1.5 rounded-full bg-primary/20 flex-shrink-0" />
      <div>
        <span className="font-medium text-foreground">{decision}.</span>{' '}
        <span className="text-foreground/60">{rationale}</span>
      </div>
    </div>
  );
}
