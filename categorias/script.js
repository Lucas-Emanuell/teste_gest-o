
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('categoriaForm');
  const tabela = document.getElementById('categoriaTabela');
  const busca = document.getElementById('busca');

  const endpoint = 'http://localhost:3000/categorias';
  let categoriaEditandoId = null;

  async function carregarCategorias() {
      const resposta = await fetch(endpoint);
      const categorias = await resposta.json();
      exibirCategorias(categorias);
  }

  function exibirCategorias(categorias) {
      const termo = (busca?.value || "").toLowerCase();
      tabela.innerHTML = "";

      categorias
          .filter(c => c.nome.toLowerCase().includes(termo))
          .forEach(categoria => {
              const linha = document.createElement('tr');
              linha.innerHTML = `
                  <td>${categoria.nome}</td>
                  <td>${categoria.descricao}</td>
                  <td>${categoria.data || ''}</td>
                  <td>
                      <button class="btn btn-sm btn-warning editar" data-id="${categoria.id}">Editar</button>
                      <button class="btn btn-sm btn-danger excluir" data-id="${categoria.id}">Excluir</button>
                  </td>
              `;
              tabela.appendChild(linha);
          });

      document.querySelectorAll(".editar").forEach(btn => {
          btn.addEventListener("click", () => editarCategoria(btn.dataset.id));
      });
      document.querySelectorAll(".excluir").forEach(btn => {
          btn.addEventListener("click", () => excluirCategoria(btn.dataset.id));
      });
  }

  form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const nome = document.getElementById('nome').value.trim();
      const descricao = document.getElementById('descricao').value.trim();
      const data = document.getElementById('data')?.value;

      if (!nome) return;

      const novaCategoria = { nome, descricao, data };

      if (categoriaEditandoId) {
          await fetch(`${endpoint}/${categoriaEditandoId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(novaCategoria)
          });
          categoriaEditandoId = null;
      } else {
          await fetch(endpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(novaCategoria)
          });
      }

      form.reset();
      carregarCategorias();
  });

  async function editarCategoria(id) {
      const resposta = await fetch(`${endpoint}/${id}`);
      const categoria = await resposta.json();

      document.getElementById('nome').value = categoria.nome;
      document.getElementById('descricao').value = categoria.descricao;
      if (document.getElementById('data')) {
          document.getElementById('data').value = categoria.data || "";
      }

      categoriaEditandoId = id;
  }

  async function excluirCategoria(id) {
          await fetch(`${endpoint}/${id}`, { method: "DELETE" });
          carregarCategorias();
  }

  busca?.addEventListener("input", carregarCategorias);
  carregarCategorias();
});
