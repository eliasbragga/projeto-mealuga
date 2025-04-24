<script lang="ts">
     import { goto } from '$app/navigation';

    let mostrarBalão = true;
    let formData = {
      nome: '',
      whatsapp: '',
      email: '',
      bairros: '',
      quartos: '',
      valorMinimo: '',
      valorMaximo: '',
      preferencias: {
        valorCondominio: false,
        valorIptu: false,
        aceitaPet: false,
        calcao: false
      },
      configuracoes: {
        receberWhatsapp: false,
        receberEmail: false,
        mensagemAutomatica: false
      }
    };
  
    const formatarMoeda = (valor: string) => {
      let valorLimpo = valor.replace(/\D/g, '');
      
      while (valorLimpo.length < 3) {
        valorLimpo = '0' + valorLimpo;
      }
      
      const valorFormatado = 
        Number(valorLimpo.slice(0, -2)).toLocaleString('pt-BR') + 
        ',' + 
        valorLimpo.slice(-2);
      
      return valorFormatado === '0,00' ? '' : valorFormatado;
    };
  
    const handleValorMinimo = (e: Event) => {
      const target = e.target as HTMLInputElement;
      formData.valorMinimo = formatarMoeda(target.value);
    };
  
    const handleValorMaximo = (e: Event) => {
      const target = e.target as HTMLInputElement;
      formData.valorMaximo = formatarMoeda(target.value);
    };
  
    const handleWhatsappInput = (e: Event) => {
      const target = e.target as HTMLInputElement;
    };
  
    const handleSubmit = (e: Event) => {
      e.preventDefault();
      console.log('Dados enviados:', formData);
    };
  </script>
  
  <style>
  .assistente-container {
    position: fixed;
    left: 20px;
    bottom: 20px;
    z-index: 50;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .balão-mensagem {
    position: relative;
    background: white;
    padding: 12px 16px;
    border-radius: 18px;
    margin-bottom: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 250px;
    animation: fadeIn 0.5s ease-in-out;
  }

  .balão-mensagem:after {
    content: '';
    position: absolute;
    left: 30px;
    bottom: -10px;
    width: 0;
    height: 0;
    border: 10px solid transparent;
    border-top-color: white;
    border-bottom: 0;
    margin-left: -10px;
    margin-bottom: 0;
  }

  .assistente-avatar {
    width: 70px;
    height: 70px;
    background-color: #6366f1;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .assistente-avatar:hover {
    transform: scale(1.05);
  }

  .assistente-avatar i {
    font-size: 32px;
    color: white;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }

  .pulse {
    animation: pulse 2s infinite;
  }
    .logo {
      display: inline-flex;
      align-items: center;
      position: relative;
    }
    .key-icon {
      position: absolute;
      color: #f59e0b;
      right: -8px;
      bottom: -5px;
      font-size: 0.6em;
      transform-origin: top right;
      transition: transform 0.5s ease;
    }
    .logo-icon {
        transition: all 0.3s ease;
      }
    .logo:hover .logo-icon {
        transform: rotate(-15deg);
      }
  </style>
  
  <div class="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="mb-8 mt-5 text-center">
      <h1 class="text-5xl font-bold text-gray-800 mb-2">
        <span class="logo">
          Me<i class="fas fa-home text-indigo-600 mx-1 logo-icon"></i>
          luga
        </span>
      </h1>
      <div class="w-24 h-1.5 bg-yellow-400 rounded-full mx-auto"></div>
    </div>
  
    <div class="max-w-2xl w-full bg-white rounded-xl shadow-lg overflow-hidden">
        <div class="p-4 border-b flex justify-between items-center">
            <button 
              on:click={() => goto('/')} 
              class="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              Voltar
            </button>
            <h2 class="text-2xl font-bold text-gray-800">Encontre seu imóvel ideal</h2>
            <div class="w-6"></div> 
          </div>
      <h2 class="text-2xl font-bold text-gray-800 p-6 border-b">Encontre seu imóvel ideal</h2>
      
      <form on:submit={handleSubmit} class="p-6 space-y-6">
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-indigo-600 border-b pb-2">Informações Pessoais</h3>
          
          <div>
            <label for="nome" class="block text-sm font-medium text-gray-700 mb-1">Nome completo</label>
            <input
              id="nome"
              type="text"
              bind:value={formData.nome}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>
          
          <div>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                bind:checked={formData.configuracoes.receberWhatsapp}
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Receber propostas por WhatsApp</span>
            </label>

            <label class="ml-4 inline-flex items-center">
                <input
                  type="checkbox"
                  bind:checked={formData.configuracoes.receberEmail}
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-700">Receber propostas por E-mail</span>
              </label>
            
            {#if formData.configuracoes.receberWhatsapp}
              <div class="mt-2">
                <label for="whatsapp" class="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input
                  id="whatsapp"
                  type="text"
                  bind:value={formData.whatsapp}
                  on:input={handleWhatsappInput}
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  required
                  placeholder="(00) 00000-0000"
                />
              </div>
            {/if}
          </div>
          
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">E-mail</label>
            <input
              id="email"
              type="email"
              bind:value={formData.email}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              required
            />
          </div>
        </div>
        
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-indigo-600 border-b pb-2">Preferências do Imóvel</h3>
          
          <div>
            <label for="bairros" class="block text-sm font-medium text-gray-700 mb-1">Bairros de interesse (separados por vírgula)</label>
            <input
              id="bairros"
              type="text"
              bind:value={formData.bairros}
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="quartos" class="block text-sm font-medium text-gray-700 mb-1">Quantidade de quartos</label>
              <input
                id="quartos"
                type="number"
                min="1"
                bind:value={formData.quartos}
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>
          </div>
  
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label for="valorMinimo" class="block text-sm font-medium text-gray-700 mb-1">Valor Mínimo (R$)</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                <input
                  id="valorMinimo"
                  type="text"
                  bind:value={formData.valorMinimo}
                  on:input={handleValorMinimo}
                  class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="0,00"
                />
              </div>
            </div>
            
            <div>
              <label for="valorMaximo" class="block text-sm font-medium text-gray-700 mb-1">Valor Máximo (R$)</label>
              <div class="relative">
                <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">R$</span>
                <input
                  id="valorMaximo"
                  type="text"
                  bind:value={formData.valorMaximo}
                  on:input={handleValorMaximo}
                  class="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="0,00"
                />
              </div>
            </div>
          </div>
          
          <div class="space-y-2">
            <p class="text-sm font-medium text-gray-700">Preferências:</p>
            <div class="grid grid-cols-2 gap-4">
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  bind:checked={formData.preferencias.valorCondominio}
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-700">Valor do condomínio</span>
              </label>
              
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  bind:checked={formData.preferencias.valorIptu}
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-700">Valor do IPTU</span>
              </label>
              
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  bind:checked={formData.preferencias.aceitaPet}
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-700">Aceita pet</span>
              </label>
              
              <label class="inline-flex items-center">
                <input
                  type="checkbox"
                  bind:checked={formData.preferencias.calcao}
                  class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
                />
                <span class="ml-2 text-sm text-gray-700">Calção</span>
              </label>
            </div>
          </div>
        </div>
        
        <!-- Seção de Configurações -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-indigo-600 border-b pb-2">Configurações</h3>
          
          <div class="space-y-3">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                bind:checked={formData.configuracoes.receberWhatsapp}
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Receber propostas por WhatsApp</span>
            </label>
            
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                bind:checked={formData.configuracoes.mensagemAutomatica}
                class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-700">Enviar mensagem automática para anunciante</span>
            </label>
          </div>
        </div>
        
        <!-- Botão de Envio -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-4 rounded-lg shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Encontrar Imóvel
          </button>
        </div>
      </form>
    </div>
    <!-- Assistente Virtual -->
  <div class="assistente-container">
    {#if mostrarBalão}
    <div class="balão-mensagem">
        <p class="text-sm font-medium text-gray-800">
          ✨ <span class="text-indigo-600 font-semibold">Vamos encontrar seu lar ideal!</span> ✨
          <br><br>
          Preencha este formulário seguro e nosso sistema inteligente vai buscar <span class="text-indigo-600 font-semibold">as melhores opções</span> que combinam com suas necessidades.
          <br><br>
          🔒 <span class="text-sm">Seus dados estão seguros conosco</span>
        </p>
      </div>
    {/if}
    <div class="assistente-avatar" on:click={() => mostrarBalão = !mostrarBalão}>
      <i class="fas fa-smile-wink"></i> 
    </div>
  </div>
  </div>