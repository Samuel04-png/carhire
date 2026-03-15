import { getOrRefreshToken } from "./auth";
import { getMomoConfig } from "./config";

export type RequestToPayParams = {
  amount: number;
  phoneNumber: string;
  bookingRef: string;
  customerName: string;
  note: string;
};

export type RequestToPayResult = {
  referenceId: string;
  status: "PENDING";
};

export type MomoPaymentStatus = {
  amount?: string;
  currency?: string;
  externalId?: string;
  financialTransactionId?: string;
  payer?: {
    partyIdType?: string;
    partyId?: string;
  };
  payerMessage?: string;
  payeeNote?: string;
  reason?: string;
  status?: "PENDING" | "SUCCESSFUL" | "FAILED" | string;
  [key: string]: unknown;
};

/**
 * Normalises Zambian mobile numbers into MTN's expected 12-digit MSISDN format.
 */
export function normaliseZambianNumber(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, "");

  if (cleaned.startsWith("+260")) {
    return cleaned.slice(1);
  }

  if (cleaned.startsWith("260")) {
    return cleaned;
  }

  if (cleaned.startsWith("0")) {
    return `260${cleaned.slice(1)}`;
  }

  return cleaned;
}

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

async function sendRequestToPay(
  referenceId: string,
  params: RequestToPayParams,
): Promise<Response> {
  const momoConfig = getMomoConfig();
  const accessToken = await getOrRefreshToken();
  const phoneNumber = normaliseZambianNumber(params.phoneNumber);

  return fetch(`${momoConfig.baseUrl}/collection/v1_0/requesttopay`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
      "X-Callback-Url": `${momoConfig.callbackUrl}/api/payments/momo/callback`,
      "X-Reference-Id": referenceId,
      "X-Target-Environment": momoConfig.targetEnvironment,
    },
    body: JSON.stringify({
      amount: params.amount.toString(),
      currency: momoConfig.currency,
      externalId: params.bookingRef,
      payer: {
        partyIdType: "MSISDN",
        partyId: phoneNumber,
      },
      payerMessage: `Payment for booking ${params.bookingRef}`,
      payeeNote: params.note || `Booking payment for ${params.customerName}`,
    }),
    cache: "no-store",
  });
}

/**
 * Initiates an MTN MoMo collections payment request and returns a pending reference id.
 */
export async function requestToPay(params: RequestToPayParams): Promise<RequestToPayResult> {
  try {
    const referenceId = crypto.randomUUID();
    let response = await sendRequestToPay(referenceId, params);

    if (response.status === 409) {
      const retryReferenceId = crypto.randomUUID();
      console.warn("[momo][requestToPay] Duplicate reference id, retrying once", {
        referenceId,
        retryReferenceId,
      });
      response = await sendRequestToPay(retryReferenceId, params);

      if (response.status === 202) {
        return {
          referenceId: retryReferenceId,
          status: "PENDING",
        };
      }
    }

    if (response.status !== 202) {
      const body = await readResponseBody(response);
      console.error("[momo][requestToPay] Request to pay failed", {
        status: response.status,
        body,
      });
      throw new Error("Payment request failed");
    }

    return {
      referenceId,
      status: "PENDING",
    };
  } catch (error) {
    console.error("[momo][requestToPay] Unexpected failure", error);
    throw new Error("Payment request failed");
  }
}

/**
 * Fetches the latest MTN payment status for a previously created collections request.
 */
export async function checkPaymentStatus(referenceId: string): Promise<MomoPaymentStatus> {
  try {
    const momoConfig = getMomoConfig();
    const accessToken = await getOrRefreshToken();
    const response = await fetch(
      `${momoConfig.baseUrl}/collection/v1_0/requesttopay/${referenceId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Ocp-Apim-Subscription-Key": momoConfig.subscriptionKey,
          "X-Target-Environment": momoConfig.targetEnvironment,
        },
        cache: "no-store",
      },
    );

    const body = (await readResponseBody(response)) as MomoPaymentStatus | string | null;

    if (!response.ok || typeof body !== "object" || body === null) {
      console.error("[momo][checkPaymentStatus] Status lookup failed", {
        status: response.status,
        body,
      });
      throw new Error("Service temporarily unavailable");
    }

    return body;
  } catch (error) {
    console.error("[momo][checkPaymentStatus] Unexpected failure", error);
    throw new Error("Service temporarily unavailable");
  }
}
