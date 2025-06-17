
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  const busca = document.getElementById("busca");
  const lista = document.querySelector("ul[class*=list-group]") || document.getElementById("lista-registros");

  if (!form || !lista) return;

  // Detecta a entidade com base em algum campo ou pelo próprio HTML
  const detectarEntidade = () => {
    const url = window.location.href.toLowerCase();
    const campos = Array.from(form.querySelectorAll("input, textarea, select"));
    if (url.includes("produto")) return "produtos";
    if (url.includes("fornecedor")) return "fornecedores";
    if (url.includes("categoria")) return "categorias";
    if (url.includes("local")) return "locais";
    if (url.includes("venda")) return "vendas";
    if (url.includes("pedido")) return "pedidos";
    return form.dataset.entidade || "dados";
  };

  const entidade = detectarEntidade();
  const endpoint = `http://localhost:3000/${entidade}`;

  const carregarDados = async () => {
    try {
      const res = await fetch(endpoint);
      const dados = await res.json();
      const termo = (busca?.value || "").toLowerCase();
      lista.innerHTML = "";

      dados
        .filter(item => JSON.stringify(item).toLowerCase().includes(termo))
        .forEach(item => {
          const li = document.createElement("li");
          li.className = "list-group-item";
          li.textContent = Object.values(item).join(" - ");
          lista.appendChild(li);
        });
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    }
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dados = {};
    form.querySelectorAll("input, select, textarea").forEach(el => {
      const key = el.name || el.id;
      if (key) dados[key] = el.value;
    });

    try {
      await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
      });
      form.reset();
      carregarDados();
    } catch (err) {
      console.error("Erro ao salvar dados:", err);
    }
  });

  busca?.addEventListener("input", carregarDados);

  carregarDados();
});
