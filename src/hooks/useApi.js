// src/hooks/useApi.js

import api from '../api/axios';

/**
 * Hook personalizado para envolver las llamadas a la API
 * @param {string} endpoint 
 * @returns 
 */
export const useApi = (endpoint) => {
    
    /**
     * Función genérica GET
     * @param {string|number} id 
     * @returns 
     */
    const get = async (id = '') => {
        try {
            const url = id ? `${endpoint}/${id}` : endpoint;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            console.error(`Error al obtener ${endpoint}:`, error);
            throw error;
        }
    };

    /**
     * Función genérica POST
     * @param {Object|FormData} data 
     * @returns 
     */
    const create = async (data) => {
        try {
            const response = await api.post(endpoint, data);
            return response.data;
        } catch (error) {
            console.error(`Error al crear ${endpoint}:`, error);
            throw error;
        }
    };
    
    /**
     * Función genérica PATCH/PUT
     * Soporta recibir update(id, data) o update(dataConId)
     * @param {string|number|Object|FormData} param1 - ID o el Objeto/FormData completo
     * @param {Object|FormData} param2 - Datos a actualizar (opcional si param1 es el payload)
     * @returns 
     */
    const update = async (param1, param2) => {
        let targetId = param1;
        let payload = param2;

        // Si se envió un único argumento (ej. update(clienteObjeto) o update(formData))
        if (param2 === undefined) {
            if (param1 instanceof FormData) {
                targetId = param1.get('id');
                // Eliminamos la clave 'id' del FormData para evitar 'property id should not exist' en NestJS
                param1.delete('id');
                payload = param1;
            } else if (typeof param1 === 'object' && param1 !== null) {
                const { id, ...rest } = param1;
                targetId = id;
                payload = rest; // Cuerpo limpio sin la propiedad 'id'
            }
        } else if (typeof payload === 'object' && !(payload instanceof FormData) && payload !== null) {
            // Si pasaron (id, data), aseguramos remover 'id' del cuerpo por precaución
            const { id, ...rest } = payload;
            payload = rest;
        } else if (payload instanceof FormData) {
            // Si pasaron (id, formData)
            payload.delete('id');
        }

        if (!targetId) {
            throw new Error(`[useApi] No se proporcionó un ID válido para actualizar en ${endpoint}`);
        }

        try {
            const response = await api.patch(`${endpoint}/${targetId}`, payload);
            return response.data;
        } catch (error) {
            console.error(`Error al actualizar ${endpoint}/${targetId}:`, error);
            throw error;
        }
    };
    
    /**
     * Función genérica DELETE
     * @param {string|number} id 
     */
    const remove = async (id) => {
        if (!id) {
            throw new Error(`[useApi] No se proporcionó un ID válido para eliminar en ${endpoint}`);
        }
        try {
            await api.delete(`${endpoint}/${id}`);
        } catch (error) {
            console.error(`Error al eliminar ${endpoint}:`, error);
            throw error;
        }
    };

    return { get, create, update, remove };
};