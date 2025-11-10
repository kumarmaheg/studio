import { up } from '@/lib/migrations';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    await up();
    return NextResponse.json({ message: 'Migration completed successfully' });
  } catch (error) {
    return NextResponse.json({ message: 'Migration failed', error }, { status: 500 });
  }
}
