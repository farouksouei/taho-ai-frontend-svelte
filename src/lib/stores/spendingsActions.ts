// src/store/spendingsActions.ts
import { spendingsStore } from './spendingsStore';
import type { SpendingFilters } from '../types/spendingTypes';
import axios from 'axios';
import type {Spending} from "../../models/Spendings";

export const fetchSpendings = async (params: { filters: SpendingFilters, page: number }) => {
    const { filters, page } = params;
    spendingsStore.update((state) => ({ ...state, loading: true, error: null }));

    try {
        const filterParams = new URLSearchParams(
            Object.entries(filters).reduce((acc, [key, value]) => {
                if (value) acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();

        const response = await axios.get(`http://localhost:5000/api/v1/spendings?${filterParams}&page=${page}`);
        spendingsStore.update((state) => ({
            ...state,
            spendings: response.data.data,
            totalPages: response.data.totalPages,
            loading: false,
        }));
    } catch (error: any) {
        spendingsStore.update((state) => ({
            ...state,
            loading: false,
            error: error.message || 'Failed to fetch spendings',
        }));
    }
};

// Fetch a spending by ID
export const fetchSpendingById = async (id: number) => {
    spendingsStore.update((state) => ({ ...state, loading: true, error: null }));

    try {
        const response = await axios.get(`http://localhost:5000/api/v1/spendings/${id}`);
        spendingsStore.update((state) => {
            const updatedSpendings = state.spendings.map((spending) =>
                spending.id === id ? response.data : spending
            );
            return { ...state, spendings: updatedSpendings, loading: false };
        });
    } catch (error: any) {
        spendingsStore.update((state) => ({ ...state, loading: false, error: error.message || 'Failed to fetch spending by ID' }));
    }
};

// Add new spending
export const addSpending = async (newSpending: Omit<Spending, 'id' | 'createdat'>) => {
    spendingsStore.update((state) => ({ ...state, loading: true, error: null }));

    try {
        const response = await axios.post('http://localhost:5000/api/v1/spendings', newSpending);
        spendingsStore.update((state) => ({
            ...state,
            spendings: [...state.spendings, response.data],
            loading: false,
        }));
    } catch (error: any) {
        spendingsStore.update((state) => ({ ...state, loading: false, error: error.message || 'Failed to add spending' }));
    }
};

// Update spending
export const updateSpending = async (id: number, data: Partial<Spending>) => {
    spendingsStore.update((state) => ({ ...state, loading: true, error: null }));

    try {
        const payload = {
            userid: data.userid,
            count: data.count,
            type: data.type,
            model: data.model,
        };
        const response = await axios.put(`http://localhost:5000/api/v1/spendings/${id}`, payload);
        spendingsStore.update((state) => {
            const updatedSpendings = state.spendings.map((spending) =>
                spending.id === id ? response.data : spending
            );
            return { ...state, spendings: updatedSpendings, loading: false };
        });
    } catch (error: any) {
        spendingsStore.update((state) => ({ ...state, loading: false, error: error.message || 'Failed to update spending' }));
    }
};

// Delete spending
export const deleteSpending = async (id: number) => {
    spendingsStore.update((state) => ({ ...state, loading: true, error: null }));

    try {
        await axios.delete(`http://localhost:5000/api/v1/spendings/${id}`);
        spendingsStore.update((state) => ({
            ...state,
            spendings: state.spendings.filter((spending) => spending.id !== id),
            loading: false,
        }));
    } catch (error: any) {
        spendingsStore.update((state) => ({ ...state, loading: false, error: error.message || 'Failed to delete spending' }));
    }
};
