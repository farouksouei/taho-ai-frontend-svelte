export interface Spending {
    id: number;
    userid: number;
    count: number;
    type: string;
    model: string;
    createdat: string;
}

// Define the filter structure
export interface SpendingFilters {
    userid?: number;
    startdate?: string;
    enddate?: string;
    type?: string;
    model?: string;
}

export interface SpendingsState {
    spendings: Spending[];
    loading: boolean;
    error: string | null;
    filters: SpendingFilters;
    currentPage: number;
    totalPages: number;
}

export const initialState: SpendingsState = {
    spendings: [],
    loading: false,
    error: null,
    filters: {},
    currentPage: 1,
    totalPages: 1,
};
