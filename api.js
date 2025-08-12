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

function renderProdutos(lista, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = ''; // limpa conteúdo anterior

  lista.forEach((item ,index ) => {
    const nunber = index + 1;
    const card = document.createElement('div');
    card.className = 'p-2 border rounded shadow-sm bg-white';
    card.innerHTML = `
      <h3 class="font-bold text-lg ">  <span class="mr-2">${nunber}.</span>${item.name}</h3>
      <p class="text-sm text-gray-600 break-words overflow-hidden text-md font-bold ">${item.description || ''}</p>
      <p class="text-yellow-600 font-semibold mt-1 bg-gray-100 w-24 p-2 ">R$ ${item.price.toFixed(2)}</p>
           <button 
              class="mt-2 bg-yellow-400 px-3 py-1 rounded" 
              onclick="abrirModal(
                '${item.name.replace(/'/g, "\\'")}', 
                '${(item.description || '').replace(/'/g, "\\'")}', 
                ${item.price}, 
                ${item.category_id === 1}
              )">
              Adicionar
            </button>
    `;
    console.log(item.name, item.category);
    container.appendChild(card);
  });
}
