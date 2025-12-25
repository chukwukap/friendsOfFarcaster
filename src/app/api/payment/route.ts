import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * POST /api/payment
 *
 * Creates a payment record for a generation.
 * Called when user initiates payment flow.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      fid,
      generationId,
      amount,
      currency,
      txHash,
      discountPct,
      discountReason,
    } = body;

    // Validate required fields
    if (!fid || !generationId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields: fid, generationId, amount" },
        { status: 400 }
      );
    }

    // 1. Get user
    const user = await prisma.user.findUnique({
      where: { fid: parseInt(fid, 10) },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 2. Get generation
    const generation = await prisma.generation.findUnique({
      where: { id: parseInt(generationId, 10) },
    });

    if (!generation) {
      return NextResponse.json(
        { error: "Generation not found" },
        { status: 404 }
      );
    }

    // 3. Check if payment already exists
    const existingPayment = await prisma.payment.findUnique({
      where: { generationId: generation.id },
    });

    if (existingPayment) {
      return NextResponse.json(
        { error: "Payment already exists for this generation" },
        { status: 409 }
      );
    }

    // 4. Calculate discount
    const originalAmount = 1.0; // $1 base price
    const discountAmount = discountPct
      ? originalAmount * (discountPct / 100)
      : 0;
    const finalAmount = originalAmount - discountAmount;

    // 5. Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        generationId: generation.id,
        amount: finalAmount,
        currency: currency || "USDC",
        discount: discountAmount > 0 ? discountAmount : null,
        discountPct: discountPct || null,
        txHash: txHash || null,
        status: txHash ? "COMPLETED" : "PENDING",
        confirmedAt: txHash ? new Date() : null,
      },
    });

    return NextResponse.json({
      success: true,
      paymentId: payment.id,
      amount: finalAmount,
      discount: discountAmount,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      {
        error: "Failed to create payment",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/payment
 *
 * Updates payment status after transaction confirmation.
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { paymentId, txHash, status } = body;

    if (!paymentId) {
      return NextResponse.json({ error: "Missing paymentId" }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};

    if (txHash) updateData.txHash = txHash;
    if (status) updateData.status = status;
    if (status === "COMPLETED") updateData.confirmedAt = new Date();

    const payment = await prisma.payment.update({
      where: { id: parseInt(paymentId, 10) },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error("Error updating payment:", error);
    return NextResponse.json(
      { error: "Failed to update payment" },
      { status: 500 }
    );
  }
}
