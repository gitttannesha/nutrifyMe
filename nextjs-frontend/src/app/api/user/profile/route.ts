import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  // Fetch user profile from MongoDB via Prisma
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      id: true,
      name: true,
      email: true,
      age: true,
      weight: true,
      height: true,
      sugarLevel: true,
      hasDiabetes: true,
      hasHypertension: true,
      gender: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  let body;
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  // Basic validation
  const { age, height, weight, sugarLevel, hasDiabetes, hasHypertension } = body;
  if (
    typeof age !== "number" ||
    typeof height !== "number" ||
    typeof weight !== "number" ||
    typeof sugarLevel !== "number" ||
    typeof hasDiabetes !== "boolean" ||
    typeof hasHypertension !== "boolean"
  ) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        age,
        height,
        weight,
        sugarLevel,
        hasDiabetes,
        hasHypertension,
      },
    });
    return NextResponse.json({ message: "Profile updated successfully!" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
} 