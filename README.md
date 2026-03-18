# MASTER ELEVADORES - Landing Page

Landing page institucional para a empresa **MASTER ELEVADORES**, focada em instalação e manutenção de elevadores em **Brasília-DF**.

## Preview

Abra no navegador após rodar o servidor local:

```text
http://localhost:3000
```

## Tecnologias

- Node.js + Express (servidor)
- HTML semântico
- CSS moderno (layout responsivo, grid/flexbox)
- JavaScript (scroll suave + envio de formulário)

## Estrutura de pastas

```text
Master_Elevador/
├── package.json
├── server.js
├── .gitignore
├── README.md
└── public/
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
```

## Como rodar o projeto

1. Instale as dependências (apenas uma vez):

   ```bash
   npm install
   ```

2. Inicie o servidor em ambiente local:

   ```bash
   npm start
   ```

3. Acesse no navegador:

   ```text
   http://localhost:3000
   ```

## Funcionalidades

- **Primeira dobra clara**: título, descrição objetiva da empresa e botões de ação.
- **Seção de serviços**: instalação, manutenção preventiva/corretiva e inspeções/laudos.
- **Seção sobre**: posicionamento da empresa, números e foco em Brasília-DF.
- **Contato**:
  - Telefone fixo
  - Link direto para **WhatsApp** com mensagem pré-preenchida
  - Formulário que envia os dados para `/api/contato` (Node/Express)

## Boas práticas aplicadas

- HTML semântico (`header`, `main`, `section`, `footer`)
- Separação de responsabilidades (HTML / CSS / JS)
- CSS organizado por seções (layout, componentes, formulários)
- Layout responsivo (desktop e mobile)
- Tipografia consistente e hierarquia visual clara
- Imagens otimizadas via Unsplash (com `w` e `q` na URL)
- `.gitignore` incluindo `node_modules`, logs, builds e `.env`

## Próximos passos sugeridos

- Integrar o formulário de contato com envio de e-mail ou CRM.
- Adicionar testes básicos de acessibilidade (cores, contraste, navegação por teclado).
- Implementar uma página de “Obrigado” ou alerta visual após envio do formulário.

