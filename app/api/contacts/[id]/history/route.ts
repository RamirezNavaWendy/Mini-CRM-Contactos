import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

//ENDPOINT PARA EL HISTORIAL
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ← AQUÍ ESTÁ EL FIX

    const contact = await prisma.contact.findUnique({
      where: { id: Number(id) },
      include: {
        histories: {
          orderBy: { changedAt: "desc" },
        },
      },
    });

    if (!contact) {
      return NextResponse.json(
        { error: "Contacto no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(contact);
  } catch (err) {
    console.error("ERROR HISTORIAL:", err);
    return NextResponse.json(
      { error: "Error al obtener historial" },
      { status: 500 }
    );
  }
}
