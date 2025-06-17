let produtos = [];
let editandoId = null;

function carregarProdutos() {
  fetch('http://localhost:3000/produtos')
    .then(response => response.json())
    .then(dados => {
      produtos = dados;
      renderizarProdutos(produtos);
    });
}

function renderizarProdutos(lista = produtos) {
  const tabela = document.getElementById("tabela-produtos");
  tabela.innerHTML = "";

  lista.forEach(produto => {
    const dataFormatada = formatarData(produto.dataEntrada);

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${produto.sku}</td>
      <td>${produto.nome}</td>
      <td>${produto.categoria}</td>
      <td>R$ ${produto.precoVenda.toFixed(2)}</td>
      <td>${produto.estoque}</td>
      <td>${produto.fornecedor}</td>
      <td>${dataFormatada}</td>
      <td>
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button class="btn-editar" data-id="${produto.id}">Editar</button>
          <button class="btn-excluir" data-id="${produto.id}">Excluir</button>
        </div>
      </td>
    `;
    tabela.appendChild(row);
  });

  adicionarEventosBotoes(); 
}

function adicionarEventosBotoes() {
  document.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      fetch(`http://localhost:3000/produtos/${id}`, {
        method: 'DELETE'
      }).then(() => carregarProdutos());
    });
  });

  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-id');
      fetch(`http://localhost:3000/produtos/${id}`)
        .then(response => response.json())
        .then(produto => preencherFormulario(produto));
    });
  });
}

function preencherFormulario(produto) {
  document.getElementById("nome").value = produto.nome;
  document.getElementById("sku").value = produto.sku;
  document.getElementById("categoria").value = produto.categoria;
  document.getElementById("preco-venda").value = produto.precoVenda;
  document.getElementById("estoque").value = produto.estoque;
  document.getElementById("fornecedor").value = produto.fornecedor;
  document.getElementById("data-entrada").value = produto.dataEntrada;

  editandoId = produto.id;
}

document.getElementById('produtoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const produto = {
    id: document.getElementById('sku').value,
    nome: document.getElementById('nome').value,
    sku: document.getElementById('sku').value,
    categoria: document.getElementById('categoria').value,
    precoVenda: parseFloat(document.getElementById('preco-venda').value),
    estoque: parseInt(document.getElementById('estoque').value),
    fornecedor: document.getElementById('fornecedor').value,
    dataEntrada: document.getElementById('data-entrada').value
  };

  const metodo = editandoId ? 'PUT' : 'POST';
  const url = editandoId
    ? `http://localhost:3000/produtos/${editandoId}`
    : 'http://localhost:3000/produtos';

  fetch(url, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(produto)
  }).then(() => {
    carregarProdutos();
    document.getElementById('produtoForm').reset();
    editandoId = null;
  });
});

document.getElementById('campoBusca').addEventListener('input', function () {
  const termo = this.value.toLowerCase();

  const filtrados = produtos.filter(produto =>
    produto.nome.toLowerCase().includes(termo) ||
    produto.categoria.toLowerCase().includes(termo)
  );

  renderizarProdutos(filtrados);
});

function formatarData(dataISO) {
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR');
}

document.addEventListener('DOMContentLoaded', carregarProdutos);
