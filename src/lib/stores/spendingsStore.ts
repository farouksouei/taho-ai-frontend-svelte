// src/store/spendingsStore.ts
import { writable } from 'svelte/store';
import type { Spending, SpendingsState, SpendingFilters } from '../types/spendingTypes';

// Initial state for the store
const initialState: SpendingsState = {
    spendings: [],
    loading: false,
    error: null,
    filters: {},
    currentPage: 1,
    totalPages: 1
};

// Create Svelte store
export const spendingsStore = writable<SpendingsState>(initialState);

// Function to set filters and reset page to 1
export const setFilters = (newFilters: Partial<SpendingFilters>) => {
    spendingsStore.update((state) => ({
        ...state,
        filters: { ...state.filters, ...newFilters },
        currentPage: 1 // Reset to page 1 when filters change
    }));
};

// Function to set current page
export const setCurrentPage = (page: number) => {
    spendingsStore.update((state) => ({
        ...state,
        currentPage: page
    }));
};
