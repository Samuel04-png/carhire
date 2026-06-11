import { checkPaymentStatus } from "../../../../../../lib/momo/collections";

type RouteContext = {
  params: Promise<{ referenceId: string }> | { referenceId: string };
};

function jsonResponse(body: unknown, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

/**
 * Returns the latest MTN MoMo payment state for the supplied request-to-pay reference id.
 */
export async function GET(_request: Request, context: RouteContext) {
  try {
    const params = await context.params;
    const referenceId = params.referenceId?.trim();

    if (!referenceId) {
      return jsonResponse({ success: false, error: "Reference id is required" }, 400);
    }

    const status = await checkPaymentStatus(referenceId);
    return jsonResponse(status, 200);
  } catch (error) {
    console.error("[momo][GET /api/payments/momo/status/[referenceId]] Status lookup failed", error);
    return jsonResponse({ success: false, error: "Service temporarily unavailable" }, 500);
  }
}
