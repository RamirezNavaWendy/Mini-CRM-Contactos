import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const contacts = await prisma.contact.findMany();

    const headers = ['id', 'name', 'email', 'phone', 'status', 'createdAt'];
    const csvRows = [
      headers.join(','), // encabezados
      ...contacts.map(c =>
        [c.id, c.name, c.email, c.phone, c.status, c.createdAt].join(',')
      ),
    ];

    const csvContent = csvRows.join('\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="contacts.csv"',
      },
    });
  } catch (err) {
    console.error('Error exportando CSV:', err);
    return NextResponse.json({ error: 'Error exportando CSV' }, { status: 500 });
  }
}
