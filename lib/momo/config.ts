/**
 * MTN MoMo environment-backed configuration.
 * Switching from sandbox to production should only require changing env vars.
 */
export type MomoConfig = {
  baseUrl: string;
  subscriptionKey: string;
  targetEnvironment: string;
  callbackUrl: string;
  currency: "ZMW";
};

export const config: MomoConfig = {
  baseUrl: process.env.MOMO_BASE_URL ?? "",
  subscriptionKey: process.env.MOMO_SUBSCRIPTION_KEY ?? "",
  targetEnvironment: process.env.MOMO_TARGET_ENVIRONMENT ?? "",
  callbackUrl: process.env.MOMO_CALLBACK_URL ?? "",
  currency: "ZMW",
};

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
