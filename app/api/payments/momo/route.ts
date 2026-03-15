/**
 * SETUP.md
 * 1. Create API User and API Key automatically by sending the first sandbox payment request.
 * 2. Test collections with the sandbox number 46733123450.
 * 3. When MTN approves production, switch the MOMO_* environment variables only.
 */
import { normaliseZambianNumber, requestToPay } from "../../../../lib/momo/collections";

type MomoPaymentRequest = {
  amount: number;
  phoneNumber: string;
  bookingRef: string;
  customerName?: string;
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function isValidMsisdn(phoneNumber: string) {
  return /^260\d{9}$/.test(phoneNumber);
}

/**
 * Starts an MTN MoMo collection request for a booking payment.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<MomoPaymentRequest>;
    const amount = Number(body.amount);
    const bookingRef = body.bookingRef?.trim();
    const customerName = body.customerName?.trim() || "Shark Car Hire customer";
    const phoneNumber = normaliseZambianNumber(body.phoneNumber?.trim() ?? "");

    if (!Number.isFinite(amount) || amount <= 0) {
      return jsonResponse({ success: false, error: "Invalid amount" }, 400);
    }

    if (!bookingRef) {
      return jsonResponse({ success: false, error: "Booking reference is required" }, 400);
    }

    if (!isValidMsisdn(phoneNumber)) {
      return jsonResponse({ success: false, error: "Invalid phone number" }, 400);
    }

    const payment = await requestToPay({
      amount,
      phoneNumber,
      bookingRef,
      customerName,
      note: `Booking payment for ${customerName}`,
    });

    return jsonResponse(
      {
        success: true,
        referenceId: payment.referenceId,
        status: payment.status,
        message: "Payment request sent to customer phone",
      },
      202,
    );
  } catch (error) {
    console.error("[momo][POST /api/payments/momo] Payment initiation failed", error);
    const message =
      error instanceof Error &&
      (error.message === "Payment request failed" ||
        error.message === "Service temporarily unavailable")
        ? error.message
        : "Payment request failed";

    return jsonResponse({ success: false, error: message }, 500);
  }
}
