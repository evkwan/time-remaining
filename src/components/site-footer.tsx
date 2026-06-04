import { CurrentYear } from '@/components/current-year';
import { siteConfig } from '@/lib/site';

export function SiteFooter() {
  return (
    <footer className="text-center text-xs text-muted-foreground">
      <p>
        <CurrentYear /> © {siteConfig.author}
      </p>
    </footer>
  );
}
