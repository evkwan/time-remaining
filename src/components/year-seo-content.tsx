import { DateTime } from 'luxon';

import { buildYearFaq, buildYearSummary } from '@/lib/seo';
import { getYearContext } from '@/lib/time';

/**
 * Server-rendered, crawlable content that answers the core search intent
 * ("how many days are left in <year>?") in plain HTML. Computed from
 * request-time server clock; the interactive hero refines to device time.
 */
export function YearSeoContent() {
  const context = getYearContext(DateTime.now());
  const summary = buildYearSummary(context);
  const faq = buildYearFaq(context);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section
      aria-labelledby="year-summary-heading"
      className="mx-auto w-full max-w-2xl space-y-10 border-t border-border/60 pt-12 text-left"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="space-y-3">
        <h2
          id="year-summary-heading"
          className="text-xl font-semibold tracking-tight sm:text-2xl"
        >
          How many days are left in {context.year}?
        </h2>
        <p className="text-pretty leading-relaxed text-muted-foreground">
          {summary}
        </p>
      </div>

      <div className="space-y-5">
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          Frequently asked questions
        </h2>
        <dl className="space-y-5">
          {faq.map((item) => (
            <div key={item.question} className="space-y-1.5">
              <dt className="font-medium text-foreground">{item.question}</dt>
              <dd className="leading-relaxed text-muted-foreground">
                {item.answer}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
