// src/components/MascotaItem.jsx
import React, { useEffect, useState } from 'react';

function MascotaItem({ mascota, clientes = [], onEliminar, onGuardar }) {
  // Detectamos el ID del cliente según los atributos devueltos por la API o relación de TypeORM
  const clienteAsignadoId = mascota.clienteId ?? mascota.cliente_id ?? mascota.cliente?.id;
  const [isEditing, setIsEditing] = useState(false);

  // Estados individuales para la edición de campos de la mascota
  const [nombreEditado, setNombreEditado] = useState(mascota.nombre);
  const [especieEditada, setEspecieEditada] = useState(mascota.especie || '');
  const [razaEditada, setRazaEditada] = useState(mascota.raza || '');
  const [historiaClinicaEditada, setHistoriaClinicaEditada] = useState(mascota.historia_clinica || '');
  const [clienteIdEditado, setClienteIdEditado] = useState(clienteAsignadoId || '');

  // Manejo de la foto elegida para preview
  const [fotoSeleccionada, setFotoSeleccionada] = useState(null);
  const fotoPreview = fotoSeleccionada?.url || '';

  useEffect(() => {
    return () => {
      if (fotoSeleccionada?.url) URL.revokeObjectURL(fotoSeleccionada.url);
    };
  }, [fotoSeleccionada]);

  // Ruta de imagen apuntando al endpoint/carpeta de mascotas
  const fotoUrl = mascota.foto
    ? (/^(https?:|data:|blob:)/i.test(mascota.foto)
      ? mascota.foto
      : `http://localhost:3000/uploads/mascotas/${mascota.foto.replace(/^\/+/, '')}`)
    : '';

  // Función helper para obtener el nombre del dueño/cliente asignado
  const getNombreDuenio = (id) => {
    if (mascota.cliente?.nombre) {
      return `${mascota.cliente.nombre} ${mascota.cliente.apellido || ''}`.trim();
    }
    if (!clientes || clientes.length === 0 || !id) return 'Sin asignar';
    const cliente = clientes.find(c => Number(c.id) === Number(id));
    return cliente ? `${cliente.nombre} ${cliente.apellido || ''}`.trim() : 'Sin cliente';
  };

  const handleEditClick = () => {
    setNombreEditado(mascota.nombre);
    setEspecieEditada(mascota.especie || '');
    setRazaEditada(mascota.raza || '');
    setHistoriaClinicaEditada(mascota.historia_clinica || '');
    setClienteIdEditado(clienteAsignadoId || '');
    setFotoSeleccionada(null);
    setIsEditing(true);
  };

  const handleGuardar = (e) => {
    e.preventDefault();

    // 🟢 1. Armamos un FormData limpio SIN incluir la propiedad 'id' en el body
    const formData = new FormData();
    formData.append('nombre', nombreEditado);
    formData.append('especie', especieEditada);
    formData.append('raza', razaEditada);

    if (historiaClinicaEditada) {
      formData.append('historia_clinica', historiaClinicaEditada);
    }

    if (clienteIdEditado && clienteIdEditado !== '') {
      formData.append('clienteId', clienteIdEditado);
    }

    if (fotoSeleccionada?.file) {
      formData.append('foto', fotoSeleccionada.file);
    }

    // 🟢 2. Enviamos el ID por separado como primer argumento y el FormData como segundo
    onGuardar(mascota.id, formData);
    setIsEditing(false);
  };

  const handleCancelar = () => {
    setFotoSeleccionada(null);
    setIsEditing(false);
  };

  const handleEliminarClick = () => {
    if (window.confirm(`¿Seguro que quieres eliminar a ${mascota.nombre}?`)) {
      onEliminar(mascota.id);
    }
  };

  const tieneImagen = Boolean(fotoPreview || fotoUrl);
  const imagenSrc = fotoPreview || fotoUrl;

  return (
    <article className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow duration-300">
      {isEditing ? (
        <form onSubmit={handleGuardar} className="p-4 bg-emerald-50 dark:bg-emerald-900/10 h-full flex flex-col gap-3">

          {tieneImagen ? (
            <img
              src={imagenSrc}
              alt={`Foto de ${mascota.nombre}`}
              className="w-full h-36 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-24 rounded-lg bg-emerald-100 dark:bg-slate-700 flex items-center justify-center text-4xl" aria-hidden="true">🐾</div>
          )}

          <input
            type="text"
            value={nombreEditado}
            onChange={(e) => setNombreEditado(e.target.value)}
            className="w-full px-3 py-2 rounded border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-white"
            placeholder="Nombre"
            aria-label="Nombre de la mascota"
            required
          />

          <input
            type="text"
            value={especieEditada}
            onChange={(e) => setEspecieEditada(e.target.value)}
            className="w-full px-3 py-2 rounded border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-white"
            placeholder="Especie"
            aria-label="Especie"
            required
          />

          <input
            type="text"
            value={razaEditada}
            onChange={(e) => setRazaEditada(e.target.value)}
            className="w-full px-3 py-2 rounded border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-white"
            placeholder="Raza"
            aria-label="Raza"
            required
          />

          <input
            type="text"
            value={historiaClinicaEditada}
            onChange={(e) => setHistoriaClinicaEditada(e.target.value)}
            className="w-full px-3 py-2 rounded border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-white"
            placeholder="Historia clínica"
            aria-label="Historia clínica"
          />

          {clientes && (
            <select
              value={clienteIdEditado}
              onChange={(e) => setClienteIdEditado(e.target.value)}
              className="w-full px-3 py-2 rounded border border-emerald-300 focus:ring-2 focus:ring-emerald-500 outline-none text-sm dark:bg-slate-900 dark:border-slate-600 dark:text-white"
              aria-label="Cliente asignado"
            >
              <option value="">-- Selecciona un dueño/cliente --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido || ''}
                </option>
              ))}
            </select>
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFotoSeleccionada(file ? { file, url: URL.createObjectURL(file) } : null);
            }}
            aria-label="Cambiar foto de la mascota"
            className="w-full text-sm text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-100 file:px-3 file:py-2 file:font-medium file:text-emerald-700 hover:file:bg-emerald-200"
          />

          <div className="flex gap-2 justify-end pt-2">
            <button type="button" onClick={handleCancelar} className="text-xs font-semibold text-slate-500 hover:text-slate-700 px-3 py-1.5 bg-white border border-slate-300 rounded shadow-sm hover:bg-slate-50">Cancelar</button>
            <button type="submit" className="text-xs font-semibold text-white px-3 py-1.5 bg-emerald-600 rounded shadow-sm hover:bg-emerald-700">Guardar</button>
          </div>
        </form>
      ) : (
        <div className="p-5 flex flex-col h-full">
          {fotoUrl ? (
            <img src={fotoUrl} alt={`Foto de ${mascota.nombre}`} className="w-full h-44 object-cover rounded-lg mb-4" />
          ) : (
            <div className="w-full h-32 rounded-lg bg-emerald-50 dark:bg-slate-700 flex items-center justify-center text-5xl mb-4" aria-label="Sin foto disponible">🐾</div>
          )}

          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-3">
              <div>
                <h4 className="font-bold text-lg text-slate-800 dark:text-white leading-tight">
                  {mascota.nombre}
                </h4>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700 space-y-1">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">Especie:</span> {mascota.especie || 'S/D'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">Raza:</span> {mascota.raza || 'S/D'}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">Historia Clínica:</span> {mascota.historia_clinica || 'S/D'}
            </p>
            {clienteAsignadoId && (
              <p className="text-sm text-slate-500 dark:text-slate-400">
                <span className="font-medium text-slate-700 dark:text-slate-300">Dueño:</span> {getNombreDuenio(clienteAsignadoId)}
              </p>
            )}
          </div>

          <div className="mt-4 flex justify-end gap-2">
            <button
              onClick={handleEditClick}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-colors"
              title="Editar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
            </button>
            <button
              onClick={handleEliminarClick}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Eliminar"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            </button>
          </div>
        </div>
      )}
    </article>
  );
}

export default MascotaItem;