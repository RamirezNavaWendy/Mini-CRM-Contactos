import { NextRequest, NextResponse } from 'next/server';
import { Status } from '@prisma/client'; 
import { prisma } from '@/lib/prisma';

// ENDPOINT GET
export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  const statusParam = request.nextUrl.searchParams.get('status');

  const contacts = await prisma.contact.findMany({
    where: {
      AND: [
        statusParam ? { status: statusParam as Status } : {},
        q
          ? {
              OR: [
                { name: { contains: q } },
                { email: { contains: q } },
              ],
            }
          : {},
      ],
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ data: contacts });
}

// Función para validar formato de correo electrónico
function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// ENDPOINT POST
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.phone) {
      return NextResponse.json({ error: "Faltan datos obligatorios" }, { status: 400 });
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json({ error: "Formato de correo electrónico inválido" }, { status: 400 });
    }

    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        status: body.status ?? "PROSPECTO",
      },
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (err) {
    console.error("Error al crear contacto:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
