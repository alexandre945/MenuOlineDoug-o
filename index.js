function abrirModal(nome, descricao, preco, exibirOpcionais = true) {
  document.getElementById('modal-nome').textContent = nome;
  document.getElementById('modal-descricao').textContent = descricao;
  document.getElementById('modal-preco').textContent = `R$ ${preco.toFixed(2)}`;
  document.getElementById('modal-quantidade').value = 1;

  const precosOpcionais = {
    Ovo: 2.50,
    Bacon: 3.00,
    Cheddar: 2.00,
    'Batata Palha': 1.50
  };

  const container = document.getElementById('modal-opcionais');
  container.innerHTML = ''; // Limpa antes

  if (exibirOpcionais) {
    container.style.display = 'block'; // Mostra opcionais
    const opcionais = ['Ovo', 'Bacon', 'Cheddar', 'Batata Palha'];
    opcionais.forEach(opcional => {
      const precoOpcional = precosOpcionais[opcional] || 0;
      const div = document.createElement('div');
      div.innerHTML = `
        <label>
          <input type="checkbox" value="${opcional}" data-preco="${precoOpcional}"> ${opcional} (R$ ${precoOpcional.toFixed(2)})
        </label>
      `;
      container.appendChild(div);
    });
  } else {
    container.style.display = 'none'; // Oculta opcionais
  }

  // Atualiza o preço total exibido ao mudar a quantidade ou opcionais
  function atualizarPrecoTotal() {
    let quantidade = parseInt(document.getElementById('modal-quantidade').value) || 1;
    let total = preco;

    const checkboxes = container.querySelectorAll('input[type=checkbox]:checked');
    checkboxes.forEach(cb => {
      total += parseFloat(cb.dataset.preco);
    });

    total *= quantidade;

    document.getElementById('modal-preco').textContent = `R$ ${total.toFixed(2)}`;
  }

  document.getElementById('modal-quantidade').addEventListener('input', atualizarPrecoTotal);
  container.querySelectorAll('input[type=checkbox]').forEach(cb => {
    cb.addEventListener('change', atualizarPrecoTotal);
  });

  atualizarPrecoTotal();

  document.getElementById('dialog-lanche').showModal();
}
function fecharModal() {
  const dialog = document.getElementById('dialog-lanche');
  if (dialog && dialog.open) {
    dialog.close();
  }
}

//adicionar ao carrinho 

  function adicionarAoCarrinho() {
    const nome = document.getElementById('modal-nome').textContent;
    const descricao = document.getElementById('modal-descricao').textContent;
    const preco = parseFloat(document.getElementById('modal-preco').textContent.replace('R$', '').trim());
    const quantidade = parseInt(document.getElementById('modal-quantidade').value);

    // Captura os opcionais marcados (se houver)
    const opcionais = [];
    document.querySelectorAll('#modal-opcionais input[type="checkbox"]:checked').forEach(checkbox => {
      opcionais.push(checkbox.value);
    });

    const item = {
      nome,
      descricao,
      preco,
      quantidade,
      opcionais
    };

    // Pega o carrinho atual do localStorage ou cria um novo
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.push(item);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));

    exibirCarrinho()
    document.getElementById('carrinho').scrollIntoView({ behavior: 'smooth' });
    alert('Item adicionado ao carrinho!');
    fecharModal();
  }

  //exibir o carrinho 
    function exibirCarrinho() {
  const container = document.getElementById('carrinho');
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

  if (carrinho.length === 0) {
    container.innerHTML = '<p class="text-gray-600">Carrinho vazio</p>';
    return;
  }

  // 🔸 Verifica se já havia um tipo de pedido selecionado
  const tipoSelecionadoAnterior = document.querySelector('input[name="tipoPedido"]:checked');
  const tipoPedidoValor = tipoSelecionadoAnterior ? tipoSelecionadoAnterior.value : 'retirar';

  let html = '<h3 class="text-lg font-bold mb-2 text-center">Carrinho</h3>';
  let total = 0;

  carrinho.forEach((item, index) => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;
    html += `
      <div class="mb-2 p-2 bg-white rounded shadow">
        <p><strong>${item.nome}</strong> <br/>quantidade:${item.quantidade}</p>
        ${item.opcionais.length > 0 ? `<p>Adicionais: ${item.opcionais.join(', ')}</p>` : ''}
        <p>Subtotal: R$ ${(subtotal).toFixed(2)}</p>
        <button onclick="removerDoCarrinho(${index})" class="text-red-500 text-sm mt-1">Remover</button>
      </div>
    `;
  });

  // 🔸 Tipo de Pedido
  html += `
    <div class="mt-4">
      <label class="block font-bold mb-1">Tipo de Pedido:</label>
      <label>
        <input type="radio" name="tipoPedido" value="retirar" ${tipoPedidoValor === 'retirar' ? 'checked' : ''} onchange="toggleEntrega()"> Retirar na lanchonete
      </label><br>
      <label>
        <input type="radio" name="tipoPedido" value="entrega" ${tipoPedidoValor === 'entrega' ? 'checked' : ''} onchange="toggleEntrega()"> Entrega (R$ 7,00)
      </label>
    </div>

    <div id="campos-retirada" class="mt-4 ${tipoPedidoValor === 'retirar' ? '' : 'hidden'}">
      <label class="block mt-2">Nome: <input type="text" id="nomeCliente" class="border p-1 w-full"></label>
      <label class="block mt-2">WhatsApp: <input type="text" id="zapCliente" class="border p-1 w-full"></label>
    </div>

    <div id="campos-entrega" class="mt-4 ${tipoPedidoValor === 'entrega' ? '' : 'hidden'}">
      <label class="block mt-2">Nome: <input type="text" id="nomeClienteEntrega" class="border p-1 w-full"></label>
      <label class="block mt-2">WhatsApp: <input type="text" id="zapClienteEntrega" class="border p-1 w-full"></label>
      <label class="block mt-2">Bairro: <input type="text" id="bairro" class="border p-1 w-full"></label>
      <label class="block mt-2">Rua: <input type="text" id="rua" class="border p-1 w-full"></label>
      <label class="block mt-2">Número: <input type="text" id="numero" class="border p-1 w-full"></label>
      <label class="block mt-2">Referência: <input type="text" id="referencia" class="border p-1 w-full"></label>
    </div>
  `;

  // 🔸 Soma a taxa de entrega se estiver selecionado
  if (tipoPedidoValor === 'entrega') {
    total += 7;
  }

  html += `<p class="font-bold mt-2 bg-white p-2">Total: R$ ${total.toFixed(2)}</p>`;
  html += `<button onclick="enviarPedido()" class="bg-green-500 text-white px-4 py-2 rounded mt-2">Enviar Pedido</button>`;

  container.innerHTML = html;
}



  function removerDoCarrinho(index) {
    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    carrinho.splice(index, 1);
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    exibirCarrinho();
  }

  // Exibir carrinho ao carregar a página
  window.onload = exibirCarrinho;

  function toggleEntrega() {
  const tipo = document.querySelector('input[name="tipoPedido"]:checked').value;
  const entregaCampos = document.getElementById('campos-entrega');
  const retiradaCampos = document.getElementById('campos-retirada');

  if (tipo === 'entrega') {
    entregaCampos.classList.remove('hidden');
    retiradaCampos.classList.add('hidden');
  } else {
    entregaCampos.classList.add('hidden');
    retiradaCampos.classList.remove('hidden');
  }

  // Reexibir carrinho para recalcular total com ou sem entrega
  exibirCarrinho();
}

function enviarPedido() {
  const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
  if (carrinho.length === 0) return alert('Carrinho vazio');

  let mensagem = '*🛒 Pedido DOUGÃO LANCHES*%0A%0A';
  let total = 0;

  carrinho.forEach(item => {
    const subtotal = item.preco * item.quantidade;
    total += subtotal;

    mensagem += ` ${item.nome}%0A`;

    mensagem+= ` quantidade ${item.quantidade}%0A`;

    if (item.opcionais.length > 0) {
      mensagem += `  Adicionais: ${item.opcionais.join(', ')}%0A`;
    }

    mensagem += `    Subtotal: R$ ${subtotal.toFixed(2).replace('.', ',')}%0A%0A`;
  });

  // Tipo de pedido
  const tipoPedido = document.querySelector('input[name="tipoPedido"]:checked').value;
  mensagem += `*Tipo de Pedido:* ${tipoPedido === 'entrega' ? 'Entrega' : 'Retirar na lanchonete'}%0A`;

  if (tipoPedido === 'entrega') {
    total += 7;

    const nome = document.getElementById('nomeClienteEntrega').value;
    const zap = document.getElementById('zapClienteEntrega').value;
    const bairro = document.getElementById('bairro').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const referencia = document.getElementById('referencia').value;

    if (!nome || !zap || !bairro || !rua || !numero) {
      alert('Preencha todos os campos de entrega.');
      return;
    }

    mensagem += `*Nome:* ${nome}%0A`;
    mensagem += `*WhatsApp:* ${zap}%0A`;
    mensagem += `*Endereço:* Rua ${rua}, nº ${numero}, Bairro ${bairro}%0A`;
    if (referencia) mensagem += `*Referência:* ${referencia}%0A`;
  } else {
    const nome = document.getElementById('nomeCliente').value;
    const zap = document.getElementById('zapCliente').value;

    if (!nome || !zap) {
      alert('Preencha nome e WhatsApp.');
      return;
    }

    mensagem += `*Nome:* ${nome}%0A`;
    mensagem += `*WhatsApp:* ${zap}%0A`;
  }

  mensagem += `%0A*Total: R$ ${total.toFixed(2).replace('.', ',')}*`;

  // Número do seu WhatsApp com DDI + DDD + número (ex: 55 11 91234-5678 → 5511912345678)
  const numeroLanchonete = '553588009835'; 

  const url = `https://wa.me/${numeroLanchonete}?text=${mensagem}`;
  window.open(url, '_blank');

  //  limpar carrinho
  localStorage.removeItem('carrinho');
  exibirCarrinho();
}
