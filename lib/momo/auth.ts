import { getMomoConfig } from "./config";

type ApiKeyResponse = {
  apiKey: string;
};

type AccessTokenResponse = {
  access_token: string;
  expires_in: number | string;
  token_type?: string;
};

type CachedToken = {
  accessToken: string;
  expiresAt: number;
};

let cachedApiUserId: string | null = process.env.MOMO_API_USER_ID ?? null;
let cachedApiKey: string | null = process.env.MOMO_API_KEY ?? null;
let cachedToken: CachedToken | null = null;

function getProviderCallbackHost(callbackUrl: string): string {
  try {
    return new URL(callbackUrl).host;
  } catch {
    return callbackUrl.replace(/^https?:\/\//, "").split("/")[0] ?? callbackUrl;
  }
}

/**
 * Safely reads a response body so MTN error details can be logged without being exposed upstream.
 */
async function readResponseBody(response: Response): Promise<unknown> {
  const raw = await response.text();

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw;
  }
}

/**
 * Creates an MTN API user and returns the generated reference id used as the apiUserId.
 */
export async function createApiUser(): Promise<string> {
  try {
    const momoConfig = getMomoConfig();
    const apiUserId = crypto.randomUUID();
    const response = await fetch(`${momoConfig.baseUrl}/v1_0/apiuser`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
        "X-Reference-Id": apiUserId,
      },
      body: JSON.stringify({
        providerCallbackHost: getProviderCallbackHost(momoConfig.callbackUrl),
      }),
      cache: "no-store",
    });

    if (!response.ok) {
      const body = await readResponseBody(response);
      console.error("[momo][createApiUser] MTN API user creation failed", {
        status: response.status,
        body,
      });
      throw new Error("Service temporarily unavailable");
    }

    cachedApiUserId = apiUserId;
    return apiUserId;
  } catch (error) {
    console.error("[momo][createApiUser] Unexpected failure", error);
    throw new Error("Service temporarily unavailable");
  }
}

/**
 * Creates an API key for an existing MTN API user.
 */
export async function createApiKey(apiUserId: string): Promise<string> {
  try {
    const momoConfig = getMomoConfig();
    const response = await fetch(`${momoConfig.baseUrl}/v1_0/apiuser/${apiUserId}/apikey`, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
      },
      cache: "no-store",
    });

    const body = (await readResponseBody(response)) as ApiKeyResponse | string | null;

    if (!response.ok || typeof body !== "object" || body === null || !("apiKey" in body)) {
      console.error("[momo][createApiKey] MTN API key creation failed", {
        status: response.status,
        body,
      });
      throw new Error("Service temporarily unavailable");
    }

    cachedApiKey = body.apiKey;
    return body.apiKey;
  } catch (error) {
    console.error("[momo][createApiKey] Unexpected failure", error);
    throw new Error("Service temporarily unavailable");
  }
}

/**
 * Exchanges an MTN API user id and key for a collections access token.
 */
export async function getAccessToken(apiUserId: string, apiKey: string): Promise<AccessTokenResponse> {
  try {
    const momoConfig = getMomoConfig();
    const basicAuth = Buffer.from(`${apiUserId}:${apiKey}`).toString("base64");
    const response = await fetch(`${momoConfig.baseUrl}/collection/token/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${basicAuth}`,
        "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
      },
      cache: "no-store",
    });

    const body = (await readResponseBody(response)) as AccessTokenResponse | string | null;

    if (
      !response.ok ||
      typeof body !== "object" ||
      body === null ||
      !("access_token" in body) ||
      !("expires_in" in body)
    ) {
      console.error("[momo][getAccessToken] MTN access token request failed", {
        status: response.status,
        body,
      });
      throw new Error("Service temporarily unavailable");
    }

    return body;
  } catch (error) {
    console.error("[momo][getAccessToken] Unexpected failure", error);
    throw new Error("Service temporarily unavailable");
  }
}

/**
 * Returns a valid collections access token using an in-memory cache.
 */
export async function getOrRefreshToken(): Promise<string> {
  try {
    if (cachedToken && cachedToken.expiresAt > Date.now()) {
      return cachedToken.accessToken;
    }

    const apiUserId = cachedApiUserId ?? (await createApiUser());
    const apiKey = cachedApiKey ?? (await createApiKey(apiUserId));
    const tokenResponse = await getAccessToken(apiUserId, apiKey);
    const expiresInSeconds = Number(tokenResponse.expires_in);

    cachedToken = {
      accessToken: tokenResponse.access_token,
      expiresAt: Date.now() + Math.max(expiresInSeconds - 60, 30) * 1000,
    };

    return cachedToken.accessToken;
  } catch (error) {
    console.error("[momo][getOrRefreshToken] Token refresh failed", error);
    throw new Error("Service temporarily unavailable");
  }
}

export function getCachedCredentials() {
  return {
    apiUserId: cachedApiUserId,
    apiKey: cachedApiKey,
    hasToken: Boolean(cachedToken),
  };
}

export function resetTokenCache() {
  cachedToken = null;
}
