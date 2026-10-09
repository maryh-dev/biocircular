# BIOCIRCULAR — como colocar o banco para funcionar

Faça os passos na ordem. Leva uns 10 minutos.

## 1. Projeto no Firebase
1. Entre em https://console.firebase.google.com e crie (ou abra) o projeto.
2. **Build › Authentication › Começar › Método de login › E-mail/senha › Ativar › Salvar.**
3. **Build › Firestore Database › Criar banco de dados.** Escolha uma região (ex.: `southamerica-east1`, São Paulo) e o modo de produção.

## 2. Publicar as regras
1. Em **Firestore Database**, abra a aba **Regras** (não é a do Realtime Database nem a do Storage).
2. Apague tudo o que estiver no editor (Ctrl+A, Delete).
3. Abra o arquivo `firestore.rules` deste projeto, copie **todo** o conteúdo e cole. A primeira linha tem que ser c.
4. Clique em **Publicar**.

## 3. Ligar o app ao projeto
1. **Configurações do projeto (engrenagem) › Seus apps › `</>` (Web)** e registre o app.
2. Copie `.env.example` para `.env.local` e preencha com os valores que o Firebase mostrar.
3. No terminal, dentro da pasta do projeto:
   ```
   npm install
   npm run dev
   ```
   Reinicie o `npm run dev` sempre que mudar o `.env.local`.

## 4. Criar o primeiro administrador
1. Abra o app, clique em **Entrar › Não tenho conta — criar agora** e cadastre seu e-mail e senha. Toda conta nova entra como **gerador**.
2. No Firebase: **Firestore Database › Dados › coleção `users`**. Já existe um documento com o seu perfil (o app o cria sozinho).
3. Abra esse documento e troque o campo `role` de `gerador` para `admin`.
4. Saia do app e entre de novo. Agora você vê todas as telas.

Para dar outro perfil a alguém (`operador`, `coletor`, `destino`), a pessoa cria a conta no app e você troca o `role` no mesmo lugar. Valores aceitos: `admin`, `operador`, `gerador`, `coletor`, `destino`.

## O que já grava no banco
- **Gerador:** solicitar coleta e ver as próprias solicitações.
- **Operação (admin/operador):** ver todas as solicitações e mudar o status.
- As demais telas (lotes, recebimento, rota, indicadores, coletor, destinação) ainda mostram dados de exemplo. As funções para elas já existem em `src/services/db.js` e as regras já liberam as coleções.

## Coleções do banco
| Coleção | Para que serve | Quem lê | Quem grava |
|---|---|---|---|
| `users/{uid}` | perfil e `role` | o próprio / admin | cria o próprio (só como gerador); admin altera |
| `solicitacoes` | pedidos de coleta | operação; gerador vê as suas | gerador cria; operação altera |
| `lotes` | lotes em transporte | perfis operacionais | operação/coletor criam; destino atualiza status |
| `recebimentos` | conferência no recebimento | perfis operacionais | operação/coletor |
| `destinacoes` | destino final | operação/destino | operação/destino |
| `movimentacoes` | histórico (nunca editado) | perfis operacionais | perfis operacionais |

## Problemas comuns
- **"permission-denied" / "Missing or insufficient permissions":** as regras não foram publicadas, ou o `role` do `users/{uid}` está errado.
- **Tela pede `.env.local`:** o arquivo não foi preenchido ou o servidor não foi reiniciado.
- **"operation-not-allowed" no login:** falta ativar E-mail/senha no passo 1.
- **Erro na linha 1 ao publicar as regras:** você colou em outra aba (Realtime Database/Storage) ou veio texto extra junto. Refaça o passo 2.
