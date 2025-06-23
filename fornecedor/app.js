document.addEventListener("DOMContentLoaded", () => {
  const API_URL = "http://localhost:3000/fornecedores";
  const container = document.getElementById("fornecedores-container");

  if (container && !container.dataset.populado) {
    container.dataset.populado = "true";
    carregarFornecedores();
  }

  async function carregarFornecedores() {
    try {
      const res = await fetch(API_URL);
      const fornecedores = await res.json();
      container.replaceChildren();

      fornecedores.forEach(f => {
        if (!f.nome || !f.email || !f.endereco || !f.descricao) return;

        const card = document.createElement("div");
        card.className = "card p-3 d-flex flex-row align-items-center justify-content-between";

card.innerHTML = `
  <div class="card-info">
    <h2>${f.nome}</h2>
    <p><strong>Email:</strong> ${f.email}</p>
    <p><strong>Endereço:</strong> ${f.endereco}</p>
    <p><strong>Descrição:</strong> ${f.descricao}</p>
  </div>
  <div class="d-flex flex-column gap-2">
    <button class="btn-editar" data-id="${f.id}" data-action="editar">Editar</button>
    <button class="btn-excluir" data-id="${f.id}" data-action="excluir">Excluir</button>
  </div>
`;

        container.appendChild(card);
      });

      container.querySelectorAll("button[data-action='editar']").forEach(btn => {
        btn.onclick = () => {
          const id = btn.getAttribute("data-id");
          localStorage.setItem("idFornecedorEditar", id);
          window.location.href = "update.html";
        };
      });

      container.querySelectorAll("button[data-action='excluir']").forEach(btn => {
        btn.onclick = async () => {
          const id = btn.getAttribute("data-id");
          if (confirm("Tem certeza que deseja excluir este fornecedor?")) {
            await fetch(`${API_URL}/${id}`, { method: "DELETE" });
            carregarFornecedores();
          }
        };
      });
    } catch (err) {
      console.error("Erro ao carregar fornecedores:", err);
    }
  }

  const formCadastro = document.getElementById("form-cadastro-1");
  if (formCadastro && !formCadastro.dataset.bound) {
    formCadastro.dataset.bound = "true";
    formCadastro.addEventListener("submit", async (e) => {
      e.preventDefault();
      const nome = document.getElementById("nome").value.trim();
      const descricao = document.getElementById("descricao").value.trim();
      const endereco = document.getElementById("endereco").value.trim();
      const email = document.getElementById("email").value.trim();

      if (!nome || !descricao || !endereco || !email) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      const novo = { nome, descricao, endereco, email };

      await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novo)
      });

      window.location.href = "fornecedores.html";
    });
  }

  const formUpdate = document.querySelector("form[action='#']");
  if (formUpdate) {
    const id = localStorage.getItem("idFornecedorEditar");
    if (!id) {
      alert("Fornecedor não selecionado.");
      window.location.href = "fornecedores.html";
      return;
    }

    fetch(`${API_URL}/${id}`)
      .then(res => res.json())
      .then(f => {
        document.getElementById("nome").value = f.nome;
        document.getElementById("descricao").value = f.descricao;
        document.getElementById("endereco").value = f.endereco;
        document.getElementById("email").value = f.email;
      });

    formUpdate.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fornecedorAtualizado = {
        nome: document.getElementById("nome").value.trim(),
        descricao: document.getElementById("descricao").value.trim(),
        endereco: document.getElementById("endereco").value.trim(),
        email: document.getElementById("email").value.trim()
      };

      if (!fornecedorAtualizado.nome || !fornecedorAtualizado.descricao || !fornecedorAtualizado.endereco || !fornecedorAtualizado.email) {
        alert("Todos os campos são obrigatórios.");
        return;
      }

      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fornecedorAtualizado)
      });

      localStorage.removeItem("idFornecedorEditar");
      window.location.href = "fornecedores.html";
    });
  }
});
