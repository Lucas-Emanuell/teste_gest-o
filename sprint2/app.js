const API_URL = "http://localhost:3000/fornecedores";

document.addEventListener("DOMContentLoaded", async () => {
  const path = window.location.pathname;

  if (path.includes("index.html") || path === "/" || path === "/index.html") {
    listarFornecedores();
  } else if (path.includes("cadastro.html")) {
    const form = document.querySelector("form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fornecedor = coletarDadosDoFormulario();
      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedor)
      });
      window.location.href = "index.html";
    });
  } else if (path.includes("update.html")) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) {
      const fornecedor = await buscarFornecedor(id);
      preencherFormulario(fornecedor);

      const form = document.querySelector("form");
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const dadosAtualizados = coletarDadosDoFormulario();
        await fetch(`${API_URL}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dadosAtualizados)
        });
        window.location.href = "index.html";
      });
    }
  }
});

async function listarFornecedores() {
  const container = document.querySelector("#fornecedores-container");
  if (!container) return;

  container.innerHTML = ""; // Limpa os cards antes de listar

  const res = await fetch(API_URL);
  const fornecedores = await res.json();

  fornecedores.forEach(fornecedor => {
    const card = document.createElement("div");
    card.className = "col-12";
    card.innerHTML = `
      <div class="card-fornecedor">
        <h5>${fornecedor.nome}</h5>
        <p>${fornecedor.descricao}</p>
        <p>${fornecedor.endereco}</p>
        <p class="text-muted">${fornecedor.email}</p>
        <div class="mt-3 d-flex gap-2">
          <a href="update.html?id=${fornecedor.id}" class="btn btn-sm btn-primary">Atualizar</a>
          <button class="btn btn-sm btn-outline-danger" onclick="excluirFornecedor('${fornecedor.id}')">Excluir</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

async function buscarFornecedor(id) {
  const res = await fetch(`${API_URL}/${id}`);
  return await res.json();
}

function preencherFormulario(fornecedor) {
  document.getElementById("nome").value = fornecedor.nome;
  document.getElementById("descricao").value = fornecedor.descricao;
  document.getElementById("endereco").value = fornecedor.endereco;
  document.getElementById("email").value = fornecedor.email;
}

function coletarDadosDoFormulario() {
  return {
    nome: document.getElementById("nome").value,
    descricao: document.getElementById("descricao").value,
    endereco: document.getElementById("endereco").value,
    email: document.getElementById("email").value
  };
}

async function excluirFornecedor(id) {
  if (!confirm("Tem certeza que deseja excluir este fornecedor?")) return;

  await fetch(`${API_URL}/${id}`, { method: "DELETE" });

  // Atualiza a lista removendo os cards da tela
  listarFornecedores();
}
