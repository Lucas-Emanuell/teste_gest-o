const API_URL = "http://localhost:3000/locais";

async function carregarLocais(filtro = "") {
  const resposta = await fetch(API_URL);
  let locais = await resposta.json();

  if (filtro.trim() !== "") {
    const termo = filtro.trim().toLowerCase();
    locais = locais.filter(local =>
      local.nome.toLowerCase().includes(termo) ||
      local.responsavel.toLowerCase().includes(termo) ||
      local.status.toLowerCase().includes(termo)
    );
  }

  const tabela = document.getElementById("localTable");
  tabela.innerHTML = "";

  locais.forEach(local => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${local.id}</td>
      <td>${local.nome}</td>
      <td>${local.responsavel}</td>
      <td>${local.capacidade}</td>
      <td>${local.status}</td>
      <td>${local.produto}</td>
      <td>${local.descricao}</td>
      <td>
        <button class="btn btn-warning btn-sm" onclick='editarLocal("${local.id}")'>Editar</button>
        <button class="btn btn-danger btn-sm" onclick='deletarLocal("${local.id}")'>Excluir</button>
      </td>
    `;
    tabela.appendChild(tr);
  });
}

document.getElementById("localForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const id = document.getElementById("idLocal").value;
  const nome = document.getElementById("nomeLocal").value;
  const responsavel = document.getElementById("responsavel").value;
  const capacidade = document.getElementById("capacidade").value;
  const status = document.getElementById("status").value;
  const produto = document.getElementById("produto").value;
  const descricao = document.getElementById("descricaoLocal").value;

  const local = { id, nome, responsavel, capacidade, status, produto, descricao };

  const existe = await fetch(`${API_URL}/${id}`);
  if (existe.ok) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local)
    });
  } else {
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local)
    });
  }

  document.getElementById("localForm").reset();
  carregarLocais();
});

async function editarLocal(id) {
  const resposta = await fetch(`${API_URL}/${id}`);
  const local = await resposta.json();

  document.getElementById("idLocal").value = local.id;
  document.getElementById("nomeLocal").value = local.nome;
  document.getElementById("responsavel").value = local.responsavel;
  document.getElementById("capacidade").value = local.capacidade;
  document.getElementById("status").value = local.status;
  document.getElementById("produto").value = local.produto;
  document.getElementById("descricaoLocal").value = local.descricao;
}

async function deletarLocal(id) {
  if (confirm("Deseja realmente excluir este local?")) {
    await fetch(`${API_URL}/${id}`, {
      method: "DELETE"
    });
    carregarLocais();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  carregarLocais();

  document.getElementById("pesquisaLocal").addEventListener("input", e => {
    const termo = e.target.value;
    carregarLocais(termo);
  });
});