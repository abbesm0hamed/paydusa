import Script from "next/script";
import type { Thing, WithContext } from "schema-dts";

type JsonLdProps = {
  code: WithContext<Thing>;
};

export const JsonLd = ({ code }: JsonLdProps) => (
  <Script
    id="json-ld"
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(code) }}
  />
);

export * from "schema-dts";
