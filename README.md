# **GitCourse Frontend (V2)**

Interface web moderna para o curso de Git, construída como uma **mini‑SPA** de alta performance, com foco em experiência do usuário e integração inteligente com o backend.



## 🌐 Deploy e Arquitetura

O projeto utiliza uma arquitetura **descentralizada**, garantindo custo zero no frontend e alta confiabilidade no backend:

- **Frontend:** Hospedado no GitHub Pages (CI/CD via GitHub Actions).

- **Backend:** API FastAPI rodando em VPS dedicada (`https://charles-gitcourse.duckdns.org`).

- **Arquitetura:** **SPA leve**, sem frameworks, com navegação dinâmica via JavaScript.

A página nunca recarrega — todo o conteúdo é trocado de forma assíncrona.



## 🛠️ Tecnologias

- HTML5 / CSS3 / JavaScript (ES6+)

- SPA Engine customizado

- Fetch API para comunicação com o backend

- Persistência segura de JWT via `localStorage`

- Design responsivo e tema dark

## 📘 Funcionalidades da Dashboard

A dashboard é o centro de controle do aluno:

1. **Cálculo de progresso dinâmico** 
   Atualização instantânea conforme o aluno conclui aulas.

2. **Sincronização assíncrona com o backend** 
   Comunicação direta com a API para registrar progresso real.

3. **Feedback visual inteligente**
   
   - Barra de progresso animada
   
   - Mensagens motivacionais
   
   - Detecção de lacunas
   
   - Próxima aula recomendada

4. **Integração com notificações** 
   Backend pode enviar alertas via Telegram.

## 🧠 Conceito Pedagógico

O GitCourse não apenas apresenta conteúdo — ele **orienta o aluno**.

### 🔹 Fluxo do Curso (oficial)

```gcode
1a-prefacio — Onboarding (não conta progresso)
↓
2-terminal-customization — Aula obrigatória inicial
↓
2a-introduction — Introdução ao Git
↓
3 → 16 — Aulas principais do curso
↓
Conclusão
```

### 🔹 Regras Importantes

- **1a-prefacio** → não conta progresso

- **2-terminal-customization** → aula oficial

- **2a-introduction** → aula oficial

- **Aulas válidas para progresso:** **2-terminal-customization, 2a-introduction e 3 → 16**

- **Total de aulas consideradas no progresso: 16**



## 📊 Sistema de Progresso

O backend calcula automaticamente:

```gcode
{
  "total": 16,
  "actual_count": 10,
  "pending_topics": [3, 5, 7],
  "percentage": 62.5
}
```

### ✔ Características

- Detecta aulas puladas

- Nunca retorna progresso falso

- Funciona mesmo fora de ordem

- Corrige inconsistências de navegação

### 🎯 Experiência do Usuário

- Saudação personalizada

- Barra de progresso animada

- Mensagens motivacionais

- Próxima aula recomendada

Exemplos de feedback:

- 🏆 Parabéns! Você concluiu o curso!

- 🔥 Você está muito perto de concluir!

- 🚀 Excelente progresso, continue assim!

## 🎨 Interface

- Tema dark moderno

- Botões com animação

- Gradiente animado na barra de progresso

- Layout responsivo

- Componentes reutilizáveis

🧱 Arquitetura do Frontend

```gcode
docs/
 ├── assets/
 │   ├── css/
 │   ├── js/
 │   │   ├── views/
 │   │   │   └── home-view.js
 │   │   ├── dashboard-router.js
 │   │   └── git-course-functions.js
```

- Mini‑SPA sem frameworks

- Renderização dinâmica via JS

- Estado controlado via `localStorage`

- Comunicação direta com o backend

## 🔌 Integração com o Backend

Endpoints utilizados:

- `POST /auth/login`

- `GET /progress/summary`

- `POST /progress/complete`

- `GET /topics/{slug}`

Backend implementado em FastAPI com:

- JWT Authentication

- Constraint única `(user_id, topic_id)`

- Cálculo inteligente de progresso

## 🧪 Testes Realizados

### 👤 Aluno A — fluxo ideal

✔ Conclusão linear
✔ 100% correto

### 👤 Aluno B — fluxo caótico

✔ Pula aulas
✔ Sistema detecta lacunas
✔ Navegação corrigida automaticamente

### 👤 Aluno C — uso parcial

✔ Entrada segura
✔ Sem quebra de fluxo

## 🚀 Status Atual

✔ Backend consistente
✔ Frontend funcional
✔ UX moderna
✔ Fluxo pedagógico validado
✔ Sistema resiliente
✔ Pronto para uso real com alunos

## 📌 Próximos Passos

- 🏆 Tela de conclusão avançada

- 📜 Certificado em PDF

- 📊 Histórico de progresso

- 🎯 Recomendações inteligentes

- 📈 Métricas de uso

## 💡 Filosofia do Projeto

> “O sistema não apenas mostra conteúdo — ele orienta o aluno.”

## 👨‍💻 Autor

Projeto desenvolvido como evolução prática em:

- Python / FastAPI

- JavaScript (SPA leve)

- UX aplicada à educação

## 🌐 Acesso ao Projeto

Frontend em produção:
👉 [Curso Git - Aprenda de forma prática e eficiente](https://linduarte.github.io/gitcourse-frontend-v2/)

Link curto (Bit.ly):
👉 [Curso Git - Aprenda de forma prática e eficiente](https://bit.ly/git-for-all)


