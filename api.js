fetch('https://dougaolanches.com.br/products-api-vercel')
  .then(response => response.json())
  .then(data => {
    const { lanches, bebidas, combos, bomboniere, promocoes } = data;

    renderProdutos(lanches, 'lanches-container');
    renderProdutos(bebidas, 'bebidas-container');
    renderProdutos(combos, 'combos-container');
    renderProdutos(bomboniere, 'bomboniere-container');
    renderProdutos(promocoes, 'promocoes-container');
  })
  .catch(error => {
    console.error('Erro ao buscar os produtos:', error);
  });
console.log("PROMOÇÕES =>", promocoes);
function renderProdutos(lista, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // limpa conteúdo anterior

    // se não existir ou for vazio, não renderiza nada
  if (!lista || lista.length === 0) {
    container.parentElement.style.display = 'none'; // esconde a <section>
    return;
  }

  lista.forEach((item, index) => {
    const number = index + 1;
    const card = document.createElement('div');

    // Se for promoções, deixa um estilo diferente
    if (containerId === 'promocoes-container') {
      card.className = 'p-3 border-2 border-yellow-500 rounded-lg shadow-sm bg-wihite';
      card.innerHTML = `
        <h3 class="font-bold text-lg text-red-600">
          <span class="mr-2">${number}.</span>${item.name}
        </h3>
        <p class="text-sm text-gray-700 mb-2">${item.description || ''}</p>
        <p class="text-lg font-extrabold text-green-600 bg-yellow-300 inline-block px-2 py-1 rounded">
          R$ ${item.price.toFixed(2)}
        </p>
        <button 
          class="mt-3 bg-green-400 text-white px-3 py-1 rounded w-full" 
          onclick="abrirModal(
            '${item.name.replace(/'/g, "\\'")}', 
            '${(item.description || '').replace(/'/g, "\\'")}', 
            ${item.price}, 
            ${item.category_id === 1}
          )">
          Quero essa promoção 🔥
        </button>
      `;
    } else {
      // layout padrão
      card.className = 'p-2 border rounded shadow-sm bg-white';
      card.innerHTML = `
        <h3 class="font-bold text-lg"><span class="mr-2">${number}.</span>${item.name}</h3>
        <p class="text-sm text-gray-600">${item.description || ''}</p>
        <p class=" text-lg text-green-600 font-extrabold rounded  mt-1 bg-yellow-300 w-24 p-2">
           R$ ${item.price.toFixed(2)}
        </p>
        <button 
          class="mt-2 bg-green-400 px-3 py-1 rounded w-full text-white" 
          onclick="abrirModal(
            '${item.name.replace(/'/g, "\\'")}', 
            '${(item.description || '').replace(/'/g, "\\'")}', 
            ${item.price}, 
            ${item.category_id === 1}
          )">
          Adicionar
        </button>
      `;
    }

    container.appendChild(card);
  });
}

