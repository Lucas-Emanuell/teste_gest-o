document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  // Usa a função buscarFornecedor do app.js (ela já existe)
  const fornecedor = await buscarFornecedor(id);

  if (!fornecedor) return;

  document.getElementById("nome").value = fornecedor.nome;
  document.getElementById("descricao").value = fornecedor.descricao;
  document.getElementById("endereco").value = fornecedor.endereco;
  document.getElementById("email").value = fornecedor.email;
});
