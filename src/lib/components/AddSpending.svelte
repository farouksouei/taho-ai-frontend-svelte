<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fetchSpendings, addSpending, updateSpending } from '../stores/spendingsActions';
    import { spendingsStore } from '../stores/spendingsStore';
    import { get } from 'svelte/store';
    import Swal from 'sweetalert2';

    export let id = null;
    let spendingData = { userid: 0, count: 0, type: '', model: '' };
    let error = null;

    onMount(() => {
        fetchSpendings();

        if (id) {
            console.log('Edit mode, id:', id);
            let spendings = get(spendingsStore).spendings;
            let spending = spendings.find(s => s.id === Number(id));
            if (spending) {
                spendingData = { ...spending };
            }
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        spendingData = { ...spendingData, [name]: name === 'userid' || name === 'count' ? parseInt(value) : value };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        error = null;
        try {
            if (id) {
                await updateSpending(Number(id), spendingData);
                await Swal.fire({ icon: 'success', title: 'Success', text: 'Spending entry updated successfully!' });
            } else {
                await addSpending(spendingData);
                await Swal.fire({ icon: 'success', title: 'Success', text: 'Spending entry added successfully!' });
            }
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } catch (err) {
            error = 'An error occurred while processing the request.';
            await Swal.fire({ icon: 'error', title: 'Error', text: error });
        }
    };
</script>

<!-- Form structure -->
<div class="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
    <h2 class="text-2xl font-bold mb-4">{id ? 'Edit Spending' : 'Add New Spending'}</h2>
    {#if error}<p class="text-red-500 mb-4">{error}</p>{/if}
    <form on:submit={handleSubmit}>
        <div class="mb-4">
            <label class="block mb-1 text-gray-600">User ID</label>
            <input type="number" name="userid" bind:value={spendingData.userid} on:input={handleChange}
                   class="border rounded-lg p-2 w-full" required/>
        </div>

        <div class="mb-4">
            <label class="block mb-1 text-gray-600">Count</label>
            <input type="number" name="count" bind:value={spendingData.count} on:input={handleChange}
                   class="border rounded-lg p-2 w-full" required/>
        </div>

        <div class="mb-4">
            <label class="block mb-1 text-gray-600">Type</label>
            <select name="type" bind:value={spendingData.type} on:change={handleChange}
                    class="border rounded-lg p-2 w-full" required>
                <option value="">Select Type</option>
                <option value="Food">Food</option>
                <option value="Entertainment">Entertainment</option>
                <option value="Transportation">Transportation</option>
                <option value="Utilities">Utilities</option>
                <option value="Healthcare">Healthcare</option>
            </select>
        </div>

        <div class="mb-4">
            <label class="block mb-1 text-gray-600">Model</label>
            <select name="model" bind:value={spendingData.model} on:change={handleChange}
                    class="border rounded-lg p-2 w-full" required>
                <option value="">Select Model</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash">Cash</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Mobile Payment">Mobile Payment</option>
            </select>
        </div>

        <button type="submit" class="bg-blue-500 text-white p-2 rounded-lg w-full hover:bg-blue-600">
            {id ? 'Update Spending' : 'Add Spending'}
        </button>
    </form>
</div>
