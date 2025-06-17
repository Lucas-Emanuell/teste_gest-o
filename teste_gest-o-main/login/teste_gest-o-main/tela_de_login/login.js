// Função para fazer login
async function loginUser(username, password) {
    try {
        const response = await fetch(`http://localhost:3000/users?login=${username}&senha=${password}`);
        const users = await response.json();
        
        if (users.length === 1) {
            // Salva o usuário no localStorage
            localStorage.setItem('currentUser', JSON.stringify(users[0]));
            return true;
        }
        return false;
    } catch (error) {
        console.error('Erro no login:', error);
        return false;
    }
}

// Função para adicionar novo usuário
async function addUser(nome, login, senha, email) {
    try {
        const newUser = {
            nome: nome,
            login: login,
            senha: senha,
            email: email,
            createdAt: new Date().toISOString(),
            planId: null
        };

        const response = await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newUser)
        });

        return await response.json();
    } catch (error) {
        console.error('Erro ao cadastrar:', error);
        throw error;
    }
}