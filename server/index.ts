import type { Server } from "node:http";
import { pathToFileURL } from "node:url";
import dotenv from "dotenv";
import express from "express";
import {
  checkPaymentStatus,
  isSupportedMomoPhoneNumber,
  normaliseZambianNumber,
  requestToPay,
} from "../lib/momo/collections";

dotenv.config({ path: ".env.local" });
dotenv.config();

type MomoPaymentRequest = {
  amount: number;
  phoneNumber: string;
  bookingRef: string;
  customerName?: string;
};

const app = express();
const port = Number(process.env.API_PORT ?? process.env.PORT ?? 3001);
let serverInstance: Server | null = null;

app.use(express.json());

app.use((request, response, next) => {
  const allowedOrigins = new Set([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://sharkcarhire.org",
    "https://www.sharkcarhire.org",
    "https://samuel04-png.github.io",
  ]);
  const origin = request.headers.origin;

  if (origin && allowedOrigins.has(origin)) {
    response.setHeader("Access-Control-Allow-Origin", origin);
    response.setHeader("Vary", "Origin");
  }

  response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (request.method === "OPTIONS") {
    response.status(204).end();
    return;
  }

  next();
});

app.get("/api/health", (_request, response) => {
  response.json({
    ok: true,
    service: "shark-car-hire-api",
    timestamp: new Date().toISOString(),
  });
});

app.post("/api/payments/momo", async (request, response) => {
  try {
    const body = request.body as Partial<MomoPaymentRequest>;
    const amount = Number(body.amount);
    const bookingRef = body.bookingRef?.trim();
    const customerName = body.customerName?.trim() || "Shark Car Hire customer";
    const phoneNumber = normaliseZambianNumber(body.phoneNumber?.trim() ?? "");

    if (!Number.isFinite(amount) || amount <= 0) {
      response.status(400).json({ success: false, error: "Invalid amount" });
      return;
    }

    if (!bookingRef) {
      response.status(400).json({ success: false, error: "Booking reference is required" });
      return;
    }

    if (!isSupportedMomoPhoneNumber(phoneNumber)) {
      response.status(400).json({ success: false, error: "Invalid phone number" });
      return;
    }

    const payment = await requestToPay({
      amount,
      phoneNumber,
      bookingRef,
      customerName,
      note: `Booking payment for ${customerName}`,
    });

    response.status(202).json({
      success: true,
      referenceId: payment.referenceId,
      status: payment.status,
      message: "Payment request sent to customer phone",
    });
  } catch (error) {
    console.error("[server][POST /api/payments/momo] Payment initiation failed", error);
    const message =
      error instanceof Error &&
      (error.message === "Payment request failed" ||
        error.message === "Service temporarily unavailable")
        ? error.message
        : "Payment request failed";

    response.status(message === "Service temporarily unavailable" ? 503 : 500).json({
      success: false,
      error: message,
    });
  }
});

app.get("/api/payments/momo/status/:referenceId", async (request, response) => {
  try {
    const referenceId = request.params.referenceId?.trim();

    if (!referenceId) {
      response.status(400).json({ success: false, error: "Reference id is required" });
      return;
    }

    const status = await checkPaymentStatus(referenceId);
    response.json(status);
  } catch (error) {
    console.error("[server][GET /api/payments/momo/status/:referenceId] Status lookup failed", error);
    response.status(503).json({ success: false, error: "Service temporarily unavailable" });
  }
});

app.post("/api/payments/momo/callback", async (request, response) => {
  try {
    console.info("[server][POST /api/payments/momo/callback] Callback received", request.body);
    response.json({ success: true, received: true });
  } catch (error) {
    console.error("[server][POST /api/payments/momo/callback] Callback failed", error);
    response.status(400).json({ success: false, error: "Invalid callback payload" });
  }
});

export function startServer() {
  if (serverInstance) {
    return Promise.resolve(serverInstance);
  }

  return new Promise<Server>((resolve, reject) => {
    const server = app.listen(port, () => {
      serverInstance = server;
      console.info(`[server] Shark Car Hire API listening on http://localhost:${port}`);
      resolve(server);
    });

    server.on("error", (error) => {
      reject(error);
    });
  });
}

export function stopServer() {
  if (!serverInstance) {
    return Promise.resolve();
  }

  return new Promise<void>((resolve, reject) => {
    serverInstance?.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      serverInstance = null;
      resolve();
    });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  startServer().catch((error) => {
    console.error("[server] Failed to start", error);
    process.exit(1);
  });
}
