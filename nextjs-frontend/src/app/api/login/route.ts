import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ success: false, error: 'Missing credentials' }, { status: 400 });
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ success: false, error: 'No such user found' }, { status: 404 });
  }
  const valid = await bcrypt.compare(password, String(user.password));
  if (!valid) {
    return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
  }
  // You can add session/JWT logic here
  return NextResponse.json({ success: true, user: { id: user.id, email: user.email } });
} 