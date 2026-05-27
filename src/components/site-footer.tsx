import { siteConfig } from '@/lib/site';

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="text-center text-xs text-muted-foreground">
      <p>
        {year} © {siteConfig.author}
      </p>
    </footer>
  );
}
