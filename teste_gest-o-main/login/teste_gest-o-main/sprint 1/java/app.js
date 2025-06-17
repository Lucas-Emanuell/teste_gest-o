const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(bodyParser.json());

const DB_PATH = path.join(__dirname, 'db.json');

// Helper para ler o db.json
function readDb() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

// Helper para escrever no db.json
function writeDb(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Rota para comprar um plano
app.post('/purchase-plan', (req, res) => {
  const { userId, planId } = req.body;
  const db = readDb();
  
  // Verificar se o plano existe
  const planExists = db.plans.some(plan => plan.id === planId);
  if (!planExists) {
    return res.status(404).json({ success: false, message: 'Plano não encontrado' });
  }
  
  // Verificar se o usuário já tem esse plano ativo
  const now = new Date();
  const existingPlan = db.userPlans.find(up => 
    up.userId === userId && 
    up.planId === planId && 
    up.isActive && 
    new Date(up.expiryDate) > now
  );
  
  if (existingPlan) {
    return res.json({ success: false, message: 'Você já possui este plano ativo.' });
  }
  
  // Adicionar o plano ao usuário (1 mês de validade)
  const expiryDate = new Date();
  expiryDate.setMonth(expiryDate.getMonth() + 1);
  
  const newUserPlan = {
    id: db.userPlans.length > 0 ? Math.max(...db.userPlans.map(up => up.id)) + 1 : 1,
    userId,
    planId,
    purchaseDate: new Date().toISOString(),
    expiryDate: expiryDate.toISOString(),
    isActive: true
  };
  
  db.userPlans.push(newUserPlan);
  writeDb(db);
  
  res.json({ success: true, plan: newUserPlan });
});

// Rota para verificar os planos do usuário
app.get('/user-plans/:userId', (req, res) => {
  const { userId } = req.params;
  const db = readDb();
  const now = new Date();
  
  const activePlans = db.userPlans
    .filter(up => up.userId === parseInt(userId) && up.isActive && new Date(up.expiryDate) > now)
    .map(up => {
      const planDetails = db.plans.find(p => p.id === up.planId);
      return { ...up, planDetails };
    });
  
  res.json({ success: true, plans: activePlans });
});

// Rota para listar todos os planos disponíveis
app.get('/plans', (req, res) => {
  const db = readDb();
  res.json({ success: true, plans: db.plans });
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));