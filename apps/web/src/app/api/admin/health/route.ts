import { NextResponse } from 'next/server';
import { getSystemHealth } from '@/actions/operations';
import { adminAuth } from '@/lib/firebase-admin';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    // getSystemHealth enforces 'operations.view' internally
    const health = await getSystemHealth(decodedToken.uid);

    return NextResponse.json(health, { status: 200 });
  } catch (error: any) {
    // Only return safe error message, no internal stack traces
    return NextResponse.json(
      { error: 'Unauthorized or forbidden' },
      { status: 403 }
    );
  }
}
