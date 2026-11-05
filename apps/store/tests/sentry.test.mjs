import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { test } from "node:test";

const optionsUrl = new URL("../src/lib/sentry-options.ts", import.meta.url)
  .href;
const testDsn = "https://public@example.com/123";

const loadOptions = (environment = {}) => {
  const output = execFileSync(
    process.execPath,
    [
      "--input-type=module",
      "-e",
      `const { sentryOptions } = await import(${JSON.stringify(optionsUrl)});
       process.stdout.write(JSON.stringify(sentryOptions));`,
    ],
    {
      encoding: "utf-8",
      env: {
        ...process.env,
        NEXT_PUBLIC_SENTRY_DSN: "",
        NEXT_PUBLIC_SENTRY_ENVIRONMENT: "",
        NODE_ENV: "development",
        ...environment,
      },
    }
  );

  return JSON.parse(output);
};

test("reporting is disabled without a storefront DSN, even if Medusa has one", () => {
  const options = loadOptions({ SENTRY_DSN: testDsn });

  assert.equal(options.enabled, false);
  assert.equal(options.dsn, "");
});

test("production enables reporting with conservative tracing and privacy defaults", () => {
  const options = loadOptions({
    NEXT_PUBLIC_SENTRY_DSN: testDsn,
    NODE_ENV: "production",
  });

  assert.equal(options.enabled, true);
  assert.equal(options.dsn, testDsn);
  assert.equal(options.environment, "production");
  assert.equal(options.tracesSampleRate, 0.1);
  assert.deepEqual(options.dataCollection, {
    cookies: false,
    databaseQueryData: false,
    genAI: { inputs: false, outputs: false },
    graphQL: { document: false, variables: false },
    httpBodies: [],
    httpHeaders: false,
    mcp: { inputs: false, outputs: false },
    queues: false,
    stackFrameVariables: false,
    urlQueryParams: false,
    userInfo: false,
  });
  assert.deepEqual(options.initialScope.tags, { service: "storefront" });
  assert.equal(options.integrations, undefined);
});

test("a deployment environment override does not change production sampling", () => {
  const options = loadOptions({
    NEXT_PUBLIC_SENTRY_DSN: testDsn,
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: "staging",
    NODE_ENV: "production",
  });

  assert.equal(options.environment, "staging");
  assert.equal(options.tracesSampleRate, 0.1);
});

test("development samples all traces when a storefront DSN is configured", () => {
  const options = loadOptions({ NEXT_PUBLIC_SENTRY_DSN: testDsn });

  assert.equal(options.enabled, true);
  assert.equal(options.environment, "development");
  assert.equal(options.tracesSampleRate, 1);
});

test("console breadcrumbs are dropped without removing HTTP diagnostics", async () => {
  const { sentryOptions } = await import("../src/lib/sentry-options.ts");
  const consoleBreadcrumb = {
    category: "console",
    message: "A log containing sensitive application data",
  };
  const httpBreadcrumb = {
    category: "http",
    data: { method: "GET", status_code: 500 },
  };

  assert.equal(sentryOptions.beforeBreadcrumb(consoleBreadcrumb), null);
  assert.equal(sentryOptions.beforeBreadcrumb(httpBreadcrumb), httpBreadcrumb);
});

test("private build credentials are never included in runtime options", () => {
  const authToken = "test-only-private-sentry-upload-token";
  const options = loadOptions({
    NEXT_PUBLIC_SENTRY_DSN: testDsn,
    SENTRY_AUTH_TOKEN: authToken,
    SENTRY_ORG: "test-private-org",
    SENTRY_PROJECT: "test-private-project",
  });
  const serialized = JSON.stringify(options);

  assert.equal(serialized.includes(authToken), false);
  assert.equal(serialized.includes("test-private-org"), false);
  assert.equal(serialized.includes("test-private-project"), false);
});
