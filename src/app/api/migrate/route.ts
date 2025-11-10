import { up } from '@/lib/migrations';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  try {
    await up();
    return NextResponse.json({ message: 'Migration completed successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: 'Migration failed', error: error.message }, { status: 500 });
  }
}
