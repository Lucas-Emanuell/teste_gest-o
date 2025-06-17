const apiUrl = 'http://localhost:3000/';

    const tableVendas = document.getElementById("tableVendas");
    const mensagem = document.getElementById("msg");

    function displayMessage(text, tipo = 'warning') {
      mensagem.innerHTML = `<div class="alert alert-${tipo}">${text}</div>`;
    }

    function criarLinhaVazia() {
        const existeLinhaVazia = [...tableVendas.querySelectorAll('input.inputNome')]
            .some(input => input.value.trim() === '');
        if(existeLinhaVazia) return; 
    
    const row = document.createElement('tr');
    row.innerHTML = `
    <td><input type="text" class="form-control inputNome" placeholder="Descrição"></td>
    <td colspan="1"><input type="number" class="form-control inputCodigo" placeholder="Código "></td>
    <td></td>
    <td><input type="number" class="form-control" value="1" min="1"></td>
    <td></td>
    <td></td>
    <td></td>
    `;
        tableVendas.appendChild(row);
      row.querySelector('.inputNome').focus();
    }

    function inserirCodigo(input) {
      const codigo = input.value;
      if (!codigo) return;

      fetch(`${apiUrl}produtos?codigo=${codigo}`)
        .then(res => res.json())
        .then(produtos => {
          const linha = input.closest('tr');
          if (produtos.length > 0) {
            const produto = produtos[0];
            const preco = parseFloat(produto.preco);
            const quantidade = 1;
            const total = preco * quantidade;

            linha.innerHTML = `
                <td>${produto.descricao}</td>
                <td>${produto.codigo}</td>
                <td>${produto.und}</td>
                <td><input type="text" class="form-control" value="${quantidade}" min="1" onchange="atualizarTotal(this, ${preco})"></td>
                <td>${preco.toFixed(2)}</td>
                <td class="total">${total.toFixed(2)}</td>
                <td><button type="button" class="btn btn-danger btn-sm btnExcluir">Excluir</button></td>
            `;
            criarLinhaVazia();
          } else {
            linha.innerHTML = `
              <td><input type="number" class="form-control inputNome" placeholder="${codigo}"></td>
              <td colspan="5" class="text-danger text-center">Produto não encontrado</td>
            `;
            linha.querySelector('.inputNome').focus();
          }
        })
        .catch(() => {
          const linha = input.closest('tr');
          linha.innerHTML = `
            <td><input type="number" class="form-control inputNome" placeholder="Código"></td>
            <td colspan="5" class="text-danger text-center">Erro ao buscar produto</td>
          `;
        });
    }

    function inserirNome(input){
        const descricao = input.value.trim().toLowerCase();
        
      if (!descricao) return;

      fetch(`${apiUrl}produtos`)
        .then(res => res.json())
        .then(produtos => {
            const resultados = produtos.filter(prod => 
      prod.descricao.toLowerCase() === descricao
    );

    if (resultados.length > 0) {
      const produto = resultados[0];
    }

            const linha = input.closest('tr');
            if(!linha) return;
            
            if (resultados.length > 0) {
                let produto = resultados[0];
                const preco = parseFloat(produto.preco);
                const quantidade = 1;
                const total = preco * quantidade;

                linha.innerHTML = `
                <td>${produto.descricao}</td>
                <td>${produto.codigo}</td>
                <td>${produto.und}</td>
                <td><input type="text" class="form-control" value="${quantidade}" min="1" onchange="atualizarTotal(this, ${preco})"></td>
                <td>${preco.toFixed(2)}</td>
                <td class="total">${total.toFixed(2)}</td>
                <td><button type="button" class="btn btn-danger btn-sm btnExcluir">Excluir</button></td>
                `;
                
                criarLinhaVazia();
                
            } else {
                linha.innerHTML = `
                    <td><input type="text" class="form-control inputNome" placeholder="Produto não encontrado"></td>
                    <td colspan="6" class="text-danger text-center">Produto não encontrado</td>
                `;
                linha.querySelector('.inputNome').focus();
          }
        })
        .catch(() => {
          const linha = input.closest('tr');
          linha.innerHTML = `
            <td><input type="text" class="form-control inputNome" placeholder="Código"></td>
            <td colspan="5" class="text-danger text-center">Erro ao buscar produto</td>
          `;
        });
    }
    
    function atualizarTotal(input, preco) {
      const quantidade = parseInt(input.value);
      const linha = input.closest('tr');
      const totalTd = linha.querySelector('.total');
      totalTd.textContent = (quantidade * preco).toFixed(2);
    }
    
    let formaPagamentoSelecionada = "";

    document.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        formaPagamentoSelecionada = item.textContent;
        console.log("Forma de pagamento escolhida:", formaPagamentoSelecionada);
      });
    });

    function salvarVenda() {
      console.log("Forma de pagamento atual:", `"${formaPagamentoSelecionada}"`);
      const linhas = tableVendas.querySelectorAll('tr');
      let itens = [];
      
      linhas.forEach((linha, index) => {
        const celulas = linha.querySelectorAll('td');
        if (celulas.length < 7) {
          console.warn(`Linha ${index} ignorada: menos de 7 células.`);
          return;
        }
        
        const inputDescricao = celulas[0].querySelector('input');
        const descricao = inputDescricao ? inputDescricao.value.trim() : celulas[0].textContent.trim();
        
        const inputCodigo = celulas[1].querySelector('input');
        const codigo = inputCodigo ? inputCodigo.value.trim() : celulas[1].textContent.trim();

        const und = celulas[2].textContent.trim();

        const inputQuantidade = celulas[3].querySelector('input');
        const quantidade = inputQuantidade ? parseInt(inputQuantidade.value) || 0 : 0;

        const preco = parseFloat(celulas[4].textContent.trim());
        const total = parseFloat(celulas[5].textContent.trim());

           if (
    index === linhas.length - 1 &&
    (!descricao && !codigo && !und && quantidade === 0 && isNaN(preco) && isNaN(total))
  ) {
    return;
  }

if (!descricao || !codigo || quantidade <= 0 || isNaN(preco) || isNaN(total)) {
      return;
    }
    itens.push({ codigo, descricao, und, quantidade, preco, total });
  });
  
  if (!formaPagamentoSelecionada) {
    displayMessage("Escolha uma forma de pagamento.");
    return;
  }
  
  if (itens.length === 0) {
    displayMessage("Nenhum item válido para salvar.", "warning");
    return;
  }
  
  const venda = {
    vendedor: "joão",
    num_pedido: Date.now().toString().slice(-6),
    data: new Date().toLocaleDateString('pt-BR'),
    pagamento: formaPagamentoSelecionada,
    itens
  };
  
  fetch(`${apiUrl}vendas`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(venda)
  })
  .then(res => {
    if (!res.ok) throw new Error("Erro ao salvar venda.");
    return res.json();
  })
  .then(() => {
    tableVendas.innerHTML = '';
    criarLinhaVazia();
    displayMessage("Venda salva com sucesso!", "success");
    formaPagamentoSelecionada = "";
  })
  .catch(() => {
    displayMessage("Erro ao salvar venda. Tente novamente.", "danger");
  });
  
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('btnSalvar').addEventListener('click', salvarVenda);
  
  
  const params = new URLSearchParams(window.location.search);
  const descricaoSelecionada = params.get('descricao');
  
  if (descricaoSelecionada) {
    const novaLinha = document.createElement('tr');
    novaLinha.innerHTML = `
    <td><input type="text" class="form-control inputNome" value="${descricaoSelecionada}"></td>
    <td colspan="1"></td>
    <td></td>
    <td><input type="number" class="form-control" value="1" min="1"></td>
    <td></td>
    <td></td>
        <td></td>
        `;

        tableVendas.appendChild(novaLinha);
        
        const novoInput = novaLinha.querySelector('.inputNome');
        if (novoInput) inserirNome(novoInput);
        
        history.replaceState(null, '', 'index.html');
    }

    criarLinhaVazia();
        
        tableVendas.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('inputCodigo') && e.key === 'Enter') {
                const valor = e.target.value.trim();
                
                if (valor === '') {
                    window.location.href = `${apiUrl}listaProdutos.html`;
                } else {
                    inserirCodigo(e.target);
                }
            }
        });

        tableVendas.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('inputNome') && e.key === 'Enter') {
                const valor = e.target.value.trim();
                
                if (valor === '') {
                    window.location.href = `${apiUrl}listaProdutos.html`;
                } else {
                    inserirNome(e.target);
                }
            }
        });
    });
    
    tableVendas.addEventListener('click', (e) => {
      if (e.target.classList.contains('btnExcluir')) {
        const linha = e.target.closest('tr');
        if (linha) {
          linha.remove();
        }
      }
});