import { NextResponse } from 'next/server';

export async function GET() {
  // Public health check. Does not expose DB credentials or stack traces.
  // Useful for load balancers.
  return NextResponse.json(
    { status: 'ok', timestamp: new Date().toISOString() },
    { status: 200 }
  );
}
