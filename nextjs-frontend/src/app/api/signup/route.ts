import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const data = await req.json();
  // Remove confirmPassword from data
  const { confirmPassword, diabetes, hypertension, ...userData } = data;
  // Validate required fields (basic)
  if (!userData.email || !userData.password || !userData.name) {
    return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
  }
  // Check for duplicate email
  const existing = await prisma.user.findUnique({ where: { email: userData.email } });
  if (existing) {
    return NextResponse.json({ success: false, error: 'Email already exists' }, { status: 400 });
  }
  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  try {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        age: Number(userData.age),
        height: Number(userData.height),
        weight: Number(userData.weight),
        bmi: Number(userData.bmi),
        sugarLevel: Number(userData.sugarLevel),
        hasDiabetes: Boolean(diabetes),
        hasHypertension: Boolean(hypertension),
        cholesterol: Boolean(userData.cholesterol),
      },
    });
    return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
} 