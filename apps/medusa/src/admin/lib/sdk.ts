import Medusa from "@medusajs/js-sdk"

const getEnvVar = (key: string, defaultValue: string = "") => {
  if (typeof process !== "undefined" && process.env) {
    return process.env[key] || defaultValue
  }
  return defaultValue
}

export const sdk = new Medusa({
  baseUrl: getEnvVar("BACKEND_URL", "/"),
  debug: getEnvVar("NODE_ENV") === "development",
  auth: {
    type: "session",
  },
})
