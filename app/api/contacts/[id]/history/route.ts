import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> } // ⚠️ params como Promise
) {
  try {
    const { id } = await context.params; // ⚠️ await necesario

    if (!id) {
      return NextResponse.json({ error: 'ID de contacto no proporcionado' }, { status: 400 });
    }

    const contactId = Number(id);
    if (isNaN(contactId)) {
      return NextResponse.json({ error: 'ID de contacto inválido' }, { status: 400 });
    }

    const contact = await prisma.contact.findUnique({
      where: { id: contactId },
      include: {
        histories: {
          orderBy: { changedAt: 'desc' },
        },
      },
    });

    if (!contact) {
      return NextResponse.json({ error: 'Contacto no encontrado' }, { status: 404 });
    }

    return NextResponse.json(contact);
  } catch (err) {
    console.error('ERROR HISTORIAL:', err);
    return NextResponse.json({ error: 'Error al obtener historial' }, { status: 500 });
  }
}
