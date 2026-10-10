// src/components/FormularioMascota.jsx
import React, { useState } from 'react';

function FormularioMascota({ clientes, onMascotaAgregada }) {
  const [nombre, setNombre] = useState('');
  const [especie, setEspecie] = useState('');
  const [raza, setRaza] = useState('');
  const [historiaClinica, setHistoriaClinica] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [foto, setFoto] = useState(null);

  const handleNombreChange = (e) => setNombre(e.target.value);
  const handleEspecieChange = (e) => setEspecie(e.target.value);
  const handleRazaChange = (e) => setRaza(e.target.value);
  const handleHistoriaClinicaChange = (e) => setHistoriaClinica(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !especie || !raza || !clienteId) {
      alert('Por favor, completa Nombre, Especie, Raza y Cliente Asignado.');
      return;
    }

    const nuevaMascota = new FormData();
    nuevaMascota.append('nombre', nombre);
    nuevaMascota.append('especie', especie);
    nuevaMascota.append('raza', raza);

    // SOLO adjuntamos historia_clinica si realmente se ingresó información
    if (historiaClinica && historiaClinica !== '') {
      nuevaMascota.append('historia_clinica', historiaClinica);
    }

    // SOLO adjuntamos clienteId si realmente se seleccionó uno
    if (clienteId && clienteId !== '') {
      nuevaMascota.append('clienteId', clienteId);
    }

    // SOLO adjuntamos foto si se cargó un archivo
    if (foto) {
      nuevaMascota.append('foto', foto);
    }

    onMascotaAgregada(nuevaMascota);

    // Limpiar campos
    setNombre('');
    setEspecie('');
    setRaza('');
    setHistoriaClinica('');
    setClienteId('');
    setFoto(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-emerald-100 dark:bg-emerald-900/30 p-2 rounded-lg text-2xl">
          🐾
        </div>
        <h3 className="text-xl font-bold text-slate-800 dark:text-white">Nueva Mascota</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Selector de Cliente / clienteId */}
        {clientes && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Cliente Asignado
            </label>
            <select
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
              required
            >
              <option value="">-- Selecciona un cliente --</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nombre} {c.apellido ? c.apellido : ''}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={nombre}
            onChange={handleNombreChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
            placeholder="FIRULAIS"
            required
          />
        </div>

        {/* Especie y Raza */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Especie
            </label>
            <input
              type="text"
              value={especie}
              onChange={handleEspecieChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
              placeholder="Perro"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Raza
            </label>
            <input
              type="text"
              value={raza}
              onChange={handleRazaChange}
              className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
              placeholder="Labrador"
              required
            />
          </div>
        </div>

        {/* Historia Clínica (opcional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Historia Clínica (opcional)
          </label>
          <textarea
            value={historiaClinica}
            onChange={handleHistoriaClinicaChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all dark:text-white"
            placeholder="Sin antecedentes de salud relevantes..."
            rows={3}
          />
        </div>

        {/* Foto (opcional) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Foto (opcional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files?.[0] || null)}
            className="w-full text-sm text-slate-600 dark:text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
          />
        </div>

        {/* Botón Submit */}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:scale-95 flex justify-center items-center gap-2"
        >
          <span>🐾</span> Registrar Mascota
        </button>
      </form>
    </div>
  );
}

export default FormularioMascota;