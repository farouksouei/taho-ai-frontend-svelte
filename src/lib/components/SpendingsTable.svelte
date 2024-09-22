<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { spendingsStore, setCurrentPage, setFilters } from '../stores/spendingsStore';
    import { fetchSpendings, deleteSpending } from '../stores/spendingsActions';
    import Swal from 'sweetalert2';
    import { navigate } from "svelte-routing";

    let spendings = [];
    let loading = false;
    let error = null;
    let filters = {};
    let currentPage = 1;
    let totalPages = 1;

    const unsubscribe = spendingsStore.subscribe(state => {
        spendings = state.spendings;
        loading = state.loading;
        error = state.error;
        filters = state.filters;
        currentPage = state.currentPage;
        totalPages = state.totalPages;
    });

    onMount(() => {
        fetchSpendings({ filters, page: currentPage });
    });

    onDestroy(() => {
        unsubscribe();
    });

    const handleFilterChange = (e: Event) => {
        const target = e.target as HTMLInputElement | HTMLSelectElement;
        const { name, value } = target;

        setFilters({ [name]: value });
        setCurrentPage(1);
        fetchSpendings({ filters: { ...filters, [name]: value }, page: 1 });
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        fetchSpendings({ filters, page });
    };

    const handleDelete = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteSpending(id);
                Swal.fire('Deleted!', 'Your spending has been deleted.', 'success');
            }
        });
    };

    const handleEdit = (id: number) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You will be redirected to edit this spending.",
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, edit it!',
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(`/spendings/edit/${id}`);
            }
        });
    };
</script>

<div class="bg-white shadow-md rounded-lg p-6">
    <h1 class="text-2xl font-bold mb-4">Spendings</h1>

    <div class="mb-4 flex flex-wrap gap-4">
        <input
                type="text"
                name="userid"
                placeholder="User ID"
                class="border rounded-lg p-2 w-1/4"
                on:change={handleFilterChange}
        />
        <input
                type="date"
                name="startdate"
                class="border rounded-lg p-2 w-1/4"
                on:change={handleFilterChange}
        />
        <input
                type="date"
                name="enddate"
                class="border rounded-lg p-2 w-1/4"
                on:change={handleFilterChange}
        />
        <select
                name="type"
                class="border rounded-lg p-2 w-1/4"
                on:change={handleFilterChange}
        >
            <option value="">Select Type</option>
            <option value="Food">Food</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Transportation">Transportation</option>
            <option value="Utilities">Utilities</option>
            <option value="Healthcare">Healthcare</option>
        </select>
        <select
                name="model"
                class="border rounded-lg p-2 w-1/4"
                on:change={handleFilterChange}
        >
            <option value="">Select Model</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash">Cash</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Mobile Payment">Mobile Payment</option>
        </select>
    </div>

    {#if loading}
        <p class="text-center text-blue-600">Loading...</p>
    {:else if error}
        <p class="text-center text-red-500">Error: {error}</p>
    {:else}
        <table class="min-w-full bg-white border border-gray-300">
            <thead>
            <tr class="bg-gray-100">
                <th class="py-2 px-4 border">ID</th>
                <th class="py-2 px-4 border">User ID</th>
                <th class="py-2 px-4 border">Count</th>
                <th class="py-2 px-4 border">Type</th>
                <th class="py-2 px-4 border">Model</th>
                <th class="py-2 px-4 border">Date</th>
                <th class="py-2 px-4 border">Actions</th>
            </tr>
            </thead>
            <tbody>
            {#each spendings as spending (spending.id)}
                <tr class="hover:bg-gray-50">
                    <td class="py-2 px-4 border">{spending.id}</td>
                    <td class="py-2 px-4 border">{spending.userid}</td>
                    <td class="py-2 px-4 border">{spending.count}</td>
                    <td class="py-2 px-4 border">{spending.type}</td>
                    <td class="py-2 px-4 border">{spending.model}</td>
                    <td class="py-2 px-4 border">{spending.createdat}</td>
                    <td class="py-2 px-4 border">
                        <button
                                on:click={() => handleEdit(spending.id)}
                                class="bg-blue-500 text-white rounded-lg px-2 py-1 hover:bg-blue-600 transition duration-200 mr-2"
                        >
                            Edit
                        </button>
                        <button
                                on:click={() => handleDelete(spending.id)}
                                class="bg-red-500 text-white rounded-lg px-2 py-1 hover:bg-red-600 transition duration-200"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            {/each}
            </tbody>
        </table>

        <div class="mt-4 flex justify-between items-center">
            <button
                    on:click={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    class={`px-4 py-2 rounded-lg ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button
                    on:click={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    class={`px-4 py-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`}
            >
                Next
            </button>
        </div>
    {/if}
</div>

