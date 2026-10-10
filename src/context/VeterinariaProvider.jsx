// src/context/VeterinariaProvider.jsx

import React, { useState, useEffect } from 'react';
import { VeterinariaContext } from './VeterinariaContext';
import { useApi } from '../hooks/useApi';

export const VeterinariaProvider = ({ children }) => {
    const [clientes, setClientes] = useState([]);
    const [mascotas, setMascotas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const clientesApi = useApi('/clientes');
    const mascotasApi = useApi('/mascotas');

    // 1. CARGA INICIAL (GET)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientesData, mascotasData] = await Promise.all([
                    clientesApi.get(),
                    mascotasApi.get()
                ]);

                setClientes(clientesData);
                setMascotas(mascotasData);
            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // ----------------------------------------------------
    // 2. FUNCIONES DE CLIENTES
    // ----------------------------------------------------
    const agregarCliente = async (nuevoCliente) => {
        try {
            const data = await clientesApi.create(nuevoCliente);
            setClientes(prev => [...prev, data]);
        } catch (error) {
            console.error("Error al agregar cliente:", error);
        }
    };

    const actualizarCliente = async (param1, param2) => {
        try {
            // 🟢 Soporta ser llamado como actualizarCliente(id, formData) o actualizarCliente(clienteObj)
            const id = param2 !== undefined ? param1 : (param1?.id || param1?.get?.('id'));
            const payload = param2 !== undefined ? param2 : param1;

            // Envia la petición PATCH a la API
            const clienteGuardado = await clientesApi.update(id, payload);

            // 🟢 Actualizamos el estado con los datos reales que devuelve el backend
            setClientes(prevClientes =>
                prevClientes.map(cl => Number(cl.id) === Number(id) ? { ...cl, ...clienteGuardado } : cl)
            );
        } catch (error) {
            console.error("Error al actualizar cliente:", error);
        }
    };

    const eliminarCliente = async (id) => {
        try {
            await clientesApi.remove(id);
            setClientes(prev => prev.filter(cl => Number(cl.id) !== Number(id)));
        } catch (error) {
            console.error("Error al eliminar cliente:", error);
        }
    };

    // ----------------------------------------------------
    // 3. FUNCIONES DE MASCOTAS
    // ----------------------------------------------------    
    const agregarMascota = async (nuevoMascota) => {
        try {
            const data = await mascotasApi.create(nuevoMascota);
            setMascotas(prev => [...prev, data]);
        } catch (error) {
            console.error("Error al agregar mascota:", error);
        }
    };

    const actualizarMascota = async (param1, param2) => {
        try {
            const id = param2 !== undefined ? param1 : (param1?.id || param1?.get?.('id'));
            const payload = param2 !== undefined ? param2 : param1;

            const mascotaGuardada = await mascotasApi.update(id, payload);

            setMascotas(prevMascotas =>
                prevMascotas.map(m => Number(m.id) === Number(id) ? { ...m, ...mascotaGuardada } : m)
            );
        } catch (error) {
            console.error("Error al actualizar mascota:", error);
        }
    };

    const eliminarMascota = async (id) => {
        try {
            await mascotasApi.remove(id);
            setMascotas(prev => prev.filter(m => Number(m.id) !== Number(id)));
        } catch (error) {
            console.error("Error al eliminar mascota:", error);
        }
    };

    const value = {
        clientes,
        agregarCliente,
        actualizarCliente,
        eliminarCliente,
        mascotas,
        agregarMascota,
        actualizarMascota,
        eliminarMascota,
        isLoading,
    };

    if (isLoading) {
        return <h1 className="p-4 text-center">Cargando datos del servidor...</h1>;
    }

    return (
        <VeterinariaContext.Provider value={value}>
            {children}
        </VeterinariaContext.Provider>
    );
};