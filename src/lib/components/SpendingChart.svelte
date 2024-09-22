<script lang="ts">
    import { onDestroy } from 'svelte';
    import { spendingsStore } from '../stores/spendingsStore';
    import { fetchSpendings } from '../stores/spendingsActions';
    import Swal from 'sweetalert2';
    import { Chart } from 'svelte-echarts';
    import { init, use } from 'echarts/core';
    import { BarChart } from 'echarts/charts';
    import { GridComponent, TitleComponent } from 'echarts/components';
    import { CanvasRenderer } from 'echarts/renderers';

    let userId: number | string = '';
    let showChart: boolean = false;
    let spendings: Array<any> = [];
    let isLoading: boolean = false;

    const unsubscribe = spendingsStore.subscribe(state => {
        spendings = state.spendings;
        isLoading = state.loading;
    });

    onDestroy(() => {
        unsubscribe();
    });

    const handleUserIdChange = (e: Event) => {
        const target = e.target as HTMLInputElement;
        userId = target.value;
        showChart = false;
    };

    use([BarChart, GridComponent, CanvasRenderer, TitleComponent]);

    const handleFetchData = async () => {
        if (!userId) {
            Swal.fire({
                icon: 'warning',
                title: 'User ID Required',
                text: 'Please enter a User ID to fetch data.',
            });
            return;
        }

        isLoading = true;
        await fetchSpendings({ filters: { userid: Number(userId) }, page: 1 });
        showChart = true;
        isLoading = false;
    };

    const getChartDataByType = () => {
        if (!spendings || spendings.length === 0) return { types: [], counts: [] };

        const spendingByType: Record<string, number> = {};

        spendings.forEach(spending => {
            if (spending.type in spendingByType) {
                spendingByType[spending.type] += spending.count;
            } else {
                spendingByType[spending.type] = spending.count;
            }
        });

        const types = Object.keys(spendingByType);
        const counts = Object.values(spendingByType);

        return { types, counts };
    };

    const { types, counts } = getChartDataByType();

    let options = {
        title: {
            text: `Spending Overview for User ID: ${userId}`,
            left: 'center',
            textStyle: {
                color: '#333',
                fontSize: 18,
            },
        },
        tooltip: {},
        xAxis: {
            type: 'category',
            data: types,
            axisLabel: {
                rotate: 45,
                color: '#888',
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc',
                },
            },
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                color: '#888',
            },
            axisLine: {
                lineStyle: {
                    color: '#ccc',
                },
            },
        },
        grid: {
            top: '20%',
            bottom: '15%',
            left: '10%',
            right: '10%',
        },
        series: [
            {
                name: 'Count',
                type: 'bar',
                data: counts,
                itemStyle: {
                    color: '#4A90E2',
                },
                barWidth: '40%',
            },
        ],
    };
</script>

{#if isLoading}
    <div>Loading...</div>
{:else}
    <div class="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4">Spending Chart</h2>
        <div class="mb-4">
            <label class="block mb-1 text-gray-600">User ID</label>
            <input
                    type="number"
                    bind:value={userId}
                    class="border rounded-lg p-2 w-full"
                    placeholder="Enter User ID"
                    on:input={handleUserIdChange}
            />
            <button
                    on:click={handleFetchData}
                    class="bg-blue-500 text-white p-2 rounded-lg w-full mt-2"
            >
                Fetch Data
            </button>
        </div>

        {#if showChart && types.length > 0}
            <div class="chart-container">
                <Chart {init} {options} />
            </div>
        {:else if showChart && types.length === 0}
            <p>No data available for this User ID.</p>
        {/if}
    </div>
{/if}

<style>
    .chart-container {
        width: 100%;
        height: 400px;
        margin-top: 20px;
    }
</style>
