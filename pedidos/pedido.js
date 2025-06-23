
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("pedidoForm");
  const tabela = document.getElementById("tabelaPedidos").getElementsByTagName("tbody")[0];
  const btnPrincipal = document.getElementById("btnPrincipal");

  const endpoint = "http://localhost:3000/pedidos";
  let pedidoEditandoId = null;

  async function carregarPedidos() {
    const resposta = await fetch(endpoint);
    const pedidos = await resposta.json();
    exibirPedidos(pedidos);
  }

  function exibirPedidos(pedidos) {
    tabela.innerHTML = "";
    pedidos.forEach(pedido => {
      const linha = tabela.insertRow();
      linha.insertCell(0).textContent = pedido.produto;
      linha.insertCell(1).textContent = pedido.quantidade;
      linha.insertCell(2).textContent = pedido.fornecedor;

      const celulaAcao = linha.insertCell(3);

      const btnEditar = document.createElement("button");
      btnEditar.textContent = "Editar";
      btnEditar.className = "btn-editar";
      btnEditar.onclick = () => editarPedido(pedido);
      celulaAcao.appendChild(btnEditar);

      const btnExcluir = document.createElement("button");
      btnExcluir.textContent = "Excluir";
      btnExcluir.className = "btn-excluir";
      btnExcluir.onclick = () => excluirPedido(pedido.id);
      celulaAcao.appendChild(btnExcluir);
    });
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const novoPedido = {
      produto: document.getElementById("produto").value.trim(),
      quantidade: parseInt(document.getElementById("quantidade").value),
      fornecedor: document.getElementById("fornecedor").value.trim()
    };

    if (pedidoEditandoId) {
      await fetch(`${endpoint}/${pedidoEditandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPedido)
      });
      pedidoEditandoId = null;
      btnPrincipal.textContent = "Adicionar Pedido";
    } else {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(novoPedido)
      });
    }

    form.reset();
    carregarPedidos(); 
  });

  async function editarPedido(pedido) {
    document.getElementById("produto").value = pedido.produto;
    document.getElementById("quantidade").value = pedido.quantidade;
    document.getElementById("fornecedor").value = pedido.fornecedor;
    pedidoEditandoId = pedido.id;
    btnPrincipal.textContent = "Salvar Alteração";
  }

  async function excluirPedido(id) {
    await fetch(`${endpoint}/${id}`, { method: "DELETE" });
    carregarPedidos();
  }

  carregarPedidos();
});
