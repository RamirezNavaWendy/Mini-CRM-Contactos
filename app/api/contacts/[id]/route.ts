import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';


// ENDPOINT EDITAR
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params; // ya no se usa await
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
    console.error(error);
    return NextResponse.json(
      { error: "No se pudo actualizar el contacto" },
      { status: 500 }
    );
  }
}

// ENDPOINT ELIMINAR
export async function DELETE(
  req: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params; // ya no se usa await
  const contactId = Number(id);

  if (isNaN(contactId)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
  }

  try {
    await prisma.contact.delete({
      where: { id: contactId },
    });

    return NextResponse.json(
      { message: 'Contacto eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: 'No se pudo eliminar el contacto' },
      { status: 500 }
    );
  }
}
