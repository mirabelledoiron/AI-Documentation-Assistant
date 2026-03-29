import { Globe, Github, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

type FooterProps = Record<string, never>;

export default function Footer(_props: FooterProps) {
    return (
    <div className="w-full py-6 px-8 bg-[#2b253f]">
      <div className="flex items-center justify-between max-w-5xl mx-auto">
        <span className="text-sm text-white/70">
          {"© 2026 Mirabelle Doiron. All rights reserved."}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10"
          >
            <a
              href="https://www.mirabelledoiron.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Portfolio"
            >
              <Globe className="size-5" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10"
          >
            <a
              href="https://github.com/mirabelledoiron"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
            >
              <Github className="size-5" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="h-9 w-9 text-white/60 hover:text-white hover:bg-white/10"
          >
            <a
              href="https://www.linkedin.com/in/mirabelledoiron"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <Linkedin className="size-5" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
