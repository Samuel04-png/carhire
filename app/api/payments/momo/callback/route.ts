/**
 * Receives MTN MoMo callback notifications.
 * This currently acknowledges receipt and logs the payload for future booking reconciliation.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as unknown;
    console.info("[momo][callback] Notification received", body);

    return new Response(JSON.stringify({ success: true, received: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[momo][callback] Failed to process callback", error);

    return new Response(JSON.stringify({ success: false, error: "Invalid callback payload" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
