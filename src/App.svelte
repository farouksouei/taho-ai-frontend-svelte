<script>
  import { Router, Route } from 'svelte-routing';
  import { navigate } from 'svelte-routing';
  import SpendingTable from './lib/components/SpendingsTable.svelte';
  import AddSpending from './lib/components/AddSpending.svelte';
  import SpendingChart from './lib/components/SpendingChart.svelte';

  const handleNavigate = (path) => {
    navigate(path);
  };
</script>

<main class="container mx-auto p-6 bg-gray-50 min-h-screen">
  <h1 class="text-3xl font-bold mb-6 text-center text-gray-800">Spending Dashboard</h1>

  <!-- Navigation -->
  <nav class="mb-6 flex justify-center space-x-4">
    <button on:click={() => handleNavigate('/')} class="text-blue-600 hover:text-blue-800 font-semibold">Dashboard</button>
    <button on:click={() => handleNavigate('/spendings/add')} class="text-blue-600 hover:text-blue-800 font-semibold">Add Spending</button>
    <button on:click={() => handleNavigate('/spendings/chart')} class="text-blue-600 hover:text-blue-800 font-semibold">View Charts</button>
  </nav>

  <!-- Router setup -->
  <Router basepath="/">
    <Route path="/" component={SpendingTable} />
    <Route path="/spendings/add" component={AddSpending} />
    <Route path="/spendings/chart" component={SpendingChart} />
    <Route path="/spendings/edit/:id" component={AddSpending} />
  </Router>
</main>
