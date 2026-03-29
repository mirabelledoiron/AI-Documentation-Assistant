import { Globe, Github, Linkedin } from "lucide-react";
type FooterProps = Record<string, never>;

export default function Footer(_props: FooterProps) {
    return (
    <footer className="w-full py-6 px-8">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <p className="text-sm text-muted-foreground">
         {"© 2026 Mirabelle Doiron. All rights reserved."}
        </p>

        <div className="flex items-center gap-5">
          <a
            href="https://www.mirabelledoiron.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Portfolio"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Globe className="size-5" />
          </a>
          <a
            href="https://github.com/mirabelledoiron"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="size-5" />
          </a>
          <a
            href="https://www.linkedin.com/in/mirabelledoiron"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Linkedin className="size-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
