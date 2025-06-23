document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  if (loginForm) {
    loginForm.addEventListener("submit", processaFormLogin);
  }

  const btnSalvar = document.getElementById("btn_salvar");
  if (btnSalvar) {
    btnSalvar.addEventListener("click", salvarCadastro);
  }
});

function processaFormLogin(event) {
  event.preventDefault();

  const login = document.getElementById("username").value.trim();
  const senha = document.getElementById("password").value.trim();

  console.log("Tentando login com:", login, senha);

  fetch(`http://localhost:3001/users?login=${login}&senha=${senha}`)
  .then(res => res.json())
  .then(users => {
    if (users.length === 1) {
      const user = users[0];
      sessionStorage.setItem("usuarioCorrente", JSON.stringify(user));
      alert("Login realizado com sucesso!");
      window.location.href = "index.html";
    } else {
      throw new Error("Usuário ou senha incorretos");
    }
  })
  .catch(err => {
    console.error("Erro no login:", err.message);
    alert(err.message);
  });

}

document.getElementById("btn_salvar").addEventListener("click", async () => {
  const nome = document.getElementById("cad_nome").value.trim();
  const login = document.getElementById("cad_login").value.trim();
  const email = document.getElementById("cad_email").value.trim();
  const senha = document.getElementById("cad_senha").value;
  const senha2 = document.getElementById("cad_senha2").value;
  const cep = document.getElementById("cad_cep").value.trim();
  const cidade = document.getElementById("cad_cidade").value.trim();
  const uf = document.getElementById("cad_uf").value.trim();

  if (senha !== senha2) {
    alert("As senhas não coincidem.");
    return;
  }

  const novoUsuario = {
    nome,
    login,
    email,
    senha,
    cep,
    cidade,
    uf
  };

  try {
   const res = await fetch("http://localhost:3001/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(novoUsuario)
});

if (!res.ok) {
  const text = await res.text(); 
  throw new Error("Erro ao cadastrar: " + text);
}


    const usuarioCriado = await res.json();
    alert("Usuário cadastrado com sucesso!");
    console.log("Usuário:", usuarioCriado);
  } catch (err) {
    alert("Erro ao cadastrar: " + err.message);
    console.error(err);
  }
});

  function buscarEnderecoPorCep() {
    const cep = document.getElementById("cad_cep").value.replace(/\D/g, "");

    if (cep.length !== 8) {
      alert("CEP inválido.");
      return;
    }

    fetch(`https://viacep.com.br/ws/${cep}/json/`)
      .then(res => res.json())
      .then(data => {
        if (data.erro) {
          alert("CEP não encontrado.");
          return;
        }

        document.getElementById("cad_cidade").value = data.localidade || "";
        document.getElementById("cad_uf").value = data.uf || "";
      })
      .catch(() => {
        alert("Erro ao buscar o CEP.");
      });
  }

