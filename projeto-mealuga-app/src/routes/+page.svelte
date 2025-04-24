<script lang="ts">
      import { goto } from '$app/navigation';

    let mostrarConteudoExtra = false;
    let conteudoExtra = "";
  
    async function carregarConteudoExtra() {
      const resposta = await fetch('/pages/about.html');
      conteudoExtra = await resposta.text();
      mostrarConteudoExtra = true;
    }
  </script>
  
  <style>
    .logo {
        display: inline-flex;
        align-items: center;
      }
      .logo-icon {
        transition: all 0.3s ease;
      }
      .logo:hover .logo-icon {
        transform: rotate(-15deg);
      }
  
    #conteudo-extra {
      padding: 2rem;
      animation: fadeIn 0.5s ease-in-out;
    }
  
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
  </style>
  
  <div class="min-h-screen flex flex-col items-center justify-center px-4" id="content-master" class:hidden={mostrarConteudoExtra}>
    <div class="text-center max-w-2xl mx-auto">
      <div class="mb-12">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-800 mb-2">
          <span class="logo">
            Me<i class="fas fa-home text-indigo-600 mx-1 logo-icon"></i>luga
          </span>
        </h1>
        <div class="w-24 h-1.5 bg-yellow-400 rounded-full mx-auto mt-4"></div>
      </div>
  
      <p class="text-xl text-gray-600 mb-10 leading-relaxed max-w-lg mx-auto">
        Transformamos a busca por imóveis em uma experiência mágica! Receba as melhores opções da OLX direto no seu celular e encontre seu lar perfeito sem estresse.
      </p>
  
      <button
      on:click={() => goto('/form')}
        class="relative bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-lg font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg group"
      >
        <span class="relative z-10 flex items-center">
          <i class="fas fa-play mr-2"></i> Comece a jornada
        </span>
        <span class="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
      </button>
  
      <div class="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto">
        <div class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div class="text-indigo-600 mb-2">
            <i class="fas fa-bolt text-2xl"></i>
          </div>
          <p class="text-sm font-medium">Rápido</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div class="text-yellow-500 mb-2">
            <i class="fas fa-gem text-2xl"></i>
          </div>
          <p class="text-sm font-medium">Exclusivo</p>
        </div>
        <div class="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
          <div class="text-green-500 mb-2">
            <i class="fas fa-heart text-2xl"></i>
          </div>
          <p class="text-sm font-medium">Personalizado</p>
        </div>
      </div>
  
      <div class="fixed bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
    </div>
    <button
      class="mt-6 relative bg-white text-indigo-600 border border-indigo-600 hover:bg-indigo-50 text-base font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow group"
      on:click={() => goto('/about')}
    >
      <span class="relative z-10 flex items-center">
        <i class="fas fa-search mr-2"></i> Conhecer o Mealuga
      </span>
      <span class="absolute inset-0 bg-indigo-90 rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-300"></span>
    </button>
  </div>
  
  