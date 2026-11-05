import { init } from "@sentry/nextjs";

import { sentryOptions } from "./src/lib/sentry-options";

init(sentryOptions);
