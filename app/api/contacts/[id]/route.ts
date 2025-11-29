import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ENDPOINT EDITAR
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const contactId = Number(id);

  if (isNaN(contactId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    const body = await request.json();

    const previous = await prisma.contact.findUnique({
      where: { id: contactId },
    });

    if (!previous) {
      return NextResponse.json({ error: "No existe el contacto" }, { status: 404 });
    }

    const updated = await prisma.contact.update({
      where: { id: contactId },
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        status: body.status,
      },
    });

    if (previous.status !== body.status) {
      await prisma.statusHistory.create({
        data: {
          contactId,
          oldStatus: previous.status,
          newStatus: body.status,
        },
      });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    return NextResponse.json(
      { error: "No se pudo actualizar el contacto" },
      { status: 500 }
    );
  }
}

// ENDPOINT ELIMINAR

// ENDPOINT ELIMINAR
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const contactId = Number(id);

  if (isNaN(contactId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  try {
    // 🔹 Primero elimina el historial asociado
    await prisma.statusHistory.deleteMany({
      where: { contactId },
    });

    // 🔹 Luego elimina el contacto
    await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json(
      { message: "Contacto e historial eliminados correctamente" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
    return NextResponse.json(
      { error: "No se pudo eliminar el contacto" },
      { status: 500 }
    );
  }
}
