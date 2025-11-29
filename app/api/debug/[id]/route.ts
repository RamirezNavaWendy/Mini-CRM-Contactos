import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  return NextResponse.json({
    recibido: context.params.id,
    tipo: typeof context.params.id,
  });
}
