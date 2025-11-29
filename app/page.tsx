'use client';
import { useState, useEffect } from 'react';

type HistoryItem = {
  id: number;
  oldStatus: string;
  newStatus: string;
  changedAt: string;
};

type Contact = {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  histories?: HistoryItem[];
};

export default function ContactManager() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'PROSPECTO',
  });
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('TODOS');

  // Modal historial
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [historyContactName, setHistoryContactName] = useState('');

  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => setContacts(data.data))
      .catch(() => setError('Error al cargar contactos'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const url = editingId ? `/api/contacts/${editingId}` : '/api/contacts';
    const method = editingId ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const contact: Contact = await res.json();
      setContacts(prev =>
        editingId
          ? prev.map(c => (c.id === editingId ? contact : c))
          : [contact, ...prev]
      );
      setForm({ name: '', email: '', phone: '', status: 'PROSPECTO' });
      setEditingId(null);
    } else {
      const errData = await res.json();
      setError(errData.error || 'Error al guardar contacto');
    }
  };

  const filteredContacts = contacts.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === 'TODOS' ? true : c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Abrir historial
  const openHistory = async (contact: Contact) => {
    try {
      const res = await fetch(`/api/contacts/${contact.id}/history`);
      if (!res.ok) {
        setError('Error al obtener historial');
        return;
      }
      const data = await res.json();
      setHistoryData(data.histories || []);
      setHistoryContactName(contact.name);
      setHistoryModalOpen(true);
    } catch (err) {
      console.error('Error al cargar historial:', err);
      setError('Error al cargar historial');
    }
  };

  // Exportar CSV
  const exportCSV = async () => {
    try {
      const res = await fetch('/api/contacts/download');
      if (!res.ok) {
        setError('Error al exportar CSV');
        return;
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'contacts.csv';
      a.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exportando CSV:', err);
      setError('Error al exportar CSV');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8 tracking-wide">
        CONTACTOS
      </h1>

      {/* Formulario */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
      >
        <input
          type="text"
          placeholder="Nombre"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className="border border-gray-700 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
        <input
          type="email"
          placeholder="Correo"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="border border-gray-700 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={form.phone}
          onChange={e => setForm({ ...form, phone: e.target.value })}
          className="border border-gray-700 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          required
        />
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          className="border border-gray-700 bg-gray-700 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
        >
          <option value="PROSPECTO">Prospecto</option>
          <option value="ACTIVO">Activo</option>
          <option value="INACTIVO">Inactivo</option>
        </select>
        <button
          type="submit"
          className="sm:col-span-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          {editingId ? 'Actualizar contacto' : 'Guardar contacto'}
        </button>
        {error && <p className="text-red-400 sm:col-span-2">{error}</p>}
      </form>

      {/* Filtros + Exportar CSV */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between items-center">
        <div className="flex flex-1 gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre o correo"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          />
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="border border-gray-700 bg-gray-800 text-white p-2 rounded focus:outline-none focus:ring focus:ring-blue-400"
          >
            <option value="TODOS">Todos</option>
            <option value="PROSPECTO">Prospecto</option>
            <option value="ACTIVO">Activo</option>
            <option value="INACTIVO">Inactivo</option>
          </select>
        </div>
        <button
          onClick={exportCSV}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Exportar CSV
        </button>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow-lg">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-700 text-gray-200">
            <tr>
              <th className="border-b border-gray-600 p-3 text-left">Nombre</th>
              <th className="border-b border-gray-600 p-3 text-left">Correo</th>
              <th className="border-b border-gray-600 p-3 text-left">Teléfono</th>
              <th className="border-b border-gray-600 p-3 text-left">Estado</th>
              <th className="border-b border-gray-600 p-3 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map(c => (
              <tr key={c.id} className="hover:bg-gray-700 transition-colors text-gray-100">
                <td className="border-b border-gray-700 p-3">{c.name}</td>
                <td className="border-b border-gray-700 p-3">{c.email}</td>
                <td className="border-b border-gray-700 p-3">{c.phone}</td>
                <td className="border-b border-gray-700 p-3">{c.status}</td>
                <td className="border-b border-gray-700 p-3 flex gap-2">
                  <button
                    onClick={() => openHistory(c)}
                    className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition"
                  >
                    Historial
                  </button>
                  <button
                    onClick={() => {
                      setForm({ name: c.name, email: c.email, phone: c.phone, status: c.status });
                      setEditingId(c.id);
                    }}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={async () => {
                      const res = await fetch(`/api/contacts/${c.id}`, { method: 'DELETE' });
                      if (res.ok) setContacts(prev => prev.filter(contact => contact.id !== c.id));
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal historial */}
      {historyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-80">
            <h2 className="text-xl font-bold mb-4">
              Historial de {historyContactName}
            </h2>
            {historyData.length === 0 ? (
              <p className="text-gray-400">Sin cambios registrados</p>
            ) : (
              <ul className="space-y-2 max-h-60 overflow-y-auto">
                {historyData.map(h => (
                  <li key={h.id} className="bg-gray-700 p-2 rounded">
                    <p className="font-semibold">{h.oldStatus} → {h.newStatus}</p>
                    <p className="text-sm text-gray-300">{new Date(h.changedAt).toLocaleString()}</p>
                  </li>
                ))}
              </ul>
            )}
            <button
              onClick={() => setHistoryModalOpen(false)}
              className="mt-4 w-full bg-red-600 py-2 rounded hover:bg-red-700"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
