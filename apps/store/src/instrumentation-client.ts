import { init } from "@sentry/nextjs";

import { sentryOptions } from "./lib/sentry-options";

init(sentryOptions);

export { captureRouterTransitionStart as onRouterTransitionStart } from "@sentry/nextjs";
