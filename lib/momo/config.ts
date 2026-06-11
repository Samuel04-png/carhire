/**
 * MTN MoMo environment-backed configuration.
 * Switching from sandbox to production should only require changing env vars.
 */
export type MomoConfig = {
  baseUrl: string;
  subscriptionKey: string;
  targetEnvironment: string;
  callbackUrl: string;
  currency: "ZMW" | "EUR";
};

export const config = {
  get baseUrl() {
    return process.env.MOMO_BASE_URL ?? "";
  },
  get subscriptionKey() {
    return process.env.MOMO_SUBSCRIPTION_KEY ?? "";
  },
  get targetEnvironment() {
    return process.env.MOMO_TARGET_ENVIRONMENT ?? "";
  },
  get callbackUrl() {
    return process.env.MOMO_CALLBACK_URL ?? "";
  },
  get currency() {
    const configuredCurrency = process.env.MOMO_CURRENCY;
    if (configuredCurrency === "ZMW" || configuredCurrency === "EUR") {
      return configuredCurrency;
    }

    return process.env.MOMO_TARGET_ENVIRONMENT === "sandbox" ? "EUR" : "ZMW";
  },
} satisfies MomoConfig;

/**
 * Validates the required MTN MoMo environment variables before a request is sent.
 */
export function getMomoConfig(): MomoConfig {
  const missing: string[] = [];

  if (!config.baseUrl) missing.push("MOMO_BASE_URL");
  if (!config.subscriptionKey) missing.push("MOMO_SUBSCRIPTION_KEY");
  if (!config.targetEnvironment) missing.push("MOMO_TARGET_ENVIRONMENT");
  if (!config.callbackUrl) missing.push("MOMO_CALLBACK_URL");

  if (missing.length > 0) {
    throw new Error(`Missing MTN MoMo configuration: ${missing.join(", ")}`);
  }

  return config;
}
