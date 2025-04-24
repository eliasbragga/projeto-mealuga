<script lang="ts">
    import { goto } from '$app/navigation'; // Importa a função goto para redirecionar

</script>
<h2>outra pagina</h2>
<button
  on:click={() => goto('/')}
  class="bg-blue-500 text-white py-2 px-4 rounded"
>
  voltar
</button>