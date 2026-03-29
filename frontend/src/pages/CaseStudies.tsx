import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function CaseStudies() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Case Studies</CardTitle>
          <CardDescription>
            How this design system knowledge assistant helps B2B and B2C teams across web, chat, and IDE workflows.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>1) Web (what you have today)</CardTitle>
            <CardDescription>Best for designers + engineers browsing the design system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-foreground font-medium">Pitch</div>
            <p className="text-sm text-muted-foreground">
              Ask the design system questions, get cited answers + links back to the canonical docs.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>2) Slack/Teams bot (B2B-friendly)</CardTitle>
            <CardDescription>Best for teams that live in chat</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm text-foreground font-medium">Flow</div>
            <p className="text-sm text-muted-foreground">
              “/atelier How do I use the Button?” → bot replies with a short answer + links
            </p>
            <div className="text-sm text-foreground font-medium">Value</div>
            <p className="text-sm text-muted-foreground">
              Reduces interruptions; faster onboarding; answers are consistent across the org.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>3) IDE integration (engineers)</CardTitle>
            <CardDescription>Best for engineers who want answers while coding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              VS Code extension or JetBrains plugin that calls the same backend `/api/chat` and `/api/search`.
            </p>
            <p className="text-sm text-muted-foreground">
              Value: answer in-context while coding + link back to docs/components.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>B2B framing (companies with a design system)</CardTitle>
            <CardDescription>Primary buyers: DX / DesignOps / design system teams</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Fewer Slack pings and repeated questions</li>
              <li>Faster onboarding and ramp-up time</li>
              <li>Fewer UI inconsistencies across products</li>
              <li>Searchable institutional knowledge with source links</li>
              <li>“Atelier Storybook sync” becomes “Sync from your internal repo/Storybook site on demand or CI.”</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>B2C framing (individual devs/teams building a DS)</CardTitle>
            <CardDescription>Turn docs into an assistant quickly</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
              <li>Turn your Storybook + MDX + tokens into an assistant instantly</li>
              <li>Helps support community/users with consistent answers</li>
              <li>Makes your design system easier to discover and adopt</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
