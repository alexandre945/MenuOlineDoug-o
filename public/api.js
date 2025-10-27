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


  lista.forEach((item, index) => {
    const number = index + 1;
    const card = document.createElement('div');

    if (containerId === 'promocoes-container') {
      // estilo diferenciado, mas sem quebrar layout
      card.className = 'p-2 border border-yellow-500  rounded shadow-sm bg-white'; // padding igual aos outros cards
      card.innerHTML = `
        <h3 class="font-bold text-lg text-red-600">
          <span class="mr-2">${number}.</span>${item.name}
        </h3>
        <p class="text-sm text-gray-700 mb-2 break-words overflow-hidden">${item.description || ''}</p>
        <p class="text-lg font-extrabold text-green-600 bg-yellow-300 inline-block px-2 py-1 rounded">
          R$ ${item.price.toFixed(2)}
        </p>
        <button 
          class="mt-2 bg-red-500 text-white px-3 py-1 rounded w-[calc(100%-1rem)] mx-2" 
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
card.className = 'p-3 border border-yellow-300 rounded-xl shadow-sm bg-gradient-to-b from-yellow-50 to-white hover:shadow-md transition-all duration-200';

card.innerHTML = `
  <h3 class="font-extrabold text-lg text-red-600 flex items-center gap-2">
    <span class="text-yellow-500">${number}.</span> ${item.name}
  </h3>
  <p class="text-sm text-gray-700 italic mb-2 break-words overflow-hidden">${item.description || ''}</p>

  <p class="font-extrabold text-yellow-700 bg-yellow-100 border-2 border-yellow-400 rounded-lg inline-block px-3 py-1 mb-3 shadow-sm">
    R$ ${item.price.toFixed(2)}
  </p>

  <button 
    class="w-full font-extrabold text-yellow-700 bg-yellow-100 border-2 border-yellow-400 p-2 rounded-lg  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    onclick="abrirModal(
      '${item.name.replace(/'/g, "\\'")}', 
      '${(item.description || '').replace(/'/g, "\\'")}', 
      ${item.price}, 
      ${item.category_id === 1}
    )">
    Adicionar ao Carrinho 🛒
  </button>
`;


    }

    container.appendChild(card);
  });
 
  // Se for container de promoções, esconde a seção se não houver itens
  if (containerId === 'promocoes-container') {
    const sectionPromotion = document.getElementById('secao-promocoes');
    if (lista.length === 0) {
      sectionPromotion.classList.add('hidden'); // esconde
    } else {
      sectionPromotion.classList.remove('hidden'); // mostra
    }
  }

}
