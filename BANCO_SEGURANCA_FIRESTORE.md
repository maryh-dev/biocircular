# Plano seguro para o Firestore sem quebrar o que já existe

Este documento é um guia de adição segura para o banco Firestore do projeto. A ideia é SOMENTE acrescentar campos e coleções necessárias para o app funcionar, sem apagar, renomear, nem reescrever documentos já existentes.

## Regra geral

- Não apagar documentos antigos.
- Não remover campos antigos.
- Não renomear coleções existentes.
- Só adicionar campos novos quando o app pedir.
- Sempre publicar as regras e índices após alterar o banco.

As coleções que o app já usa são:

- users
- solicitacoes
- lotes
- recebimentos
- destinacoes
- movimentacoes

---

## 1) O que o app espera no Firestore

### 1.1) Documento de perfil do usuário: users/{uid}

Estrutura mínima esperada:

```json
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "role": "gerador",
  "ativo": true,
  "createdAt": "Timestamp do Firebase"
}
```

Valores válidos para role:

- admin
- operador
- gerador
- coletor
- destino

Se um usuário ainda não tem documento em users, o app tenta criar automaticamente ao fazer login.

Se o documento já existir, o app só lê e valida os campos `role` e `ativo`.

Importante:

- nunca apague um perfil de usuário do Firestore
- para remover acesso, use `ativo: false`
- o app não exige exclusão física do documento

---

### 1.2) Documento de solicitação: solicitacoes/{id}

Estrutura esperada para uma solicitação funcional:

```json
{
  "solicitanteUid": "UID_DO_USUARIO",
  "solicitanteNome": "Maria Silva",
  "dataPreferencial": "2026-10-10",
  "janela": "manha",
  "endereco": "Rua A, 123",
  "recipienteCodigo": "REC-00482",
  "latitude": -23.5505,
  "longitude": -46.6333,
  "volumeLitros": 120,
  "observacoes": "Solicitação de coleta para reciclagem.",
  "status": "solicitada",
  "createdAt": "Timestamp do Firebase",
  "updatedAt": "Timestamp do Firebase"
}
```

Campos que podem ser adicionados depois:

```json
{
  "coletorUid": "UID_DO_COLETOR",
  "coletorNome": "João",
  "rotaId": "ID_DA_ROTA",
  "loteId": "ID_DO_LOTE",
  "recipienteCodigoLido": "REC-00482",
  "volumeColetadoLitros": 120,
  "coletadoPorUid": "UID_DO_COLETOR",
  "coletadoPorNome": "João",
  "coletadaEm": "Timestamp do Firebase",
  "status": "coletada"
}
```

Estados possíveis de status:

- solicitada
- agendada
- em_rota
- coletada
- concluida
- cancelada

---

### 1.3) Documento de lote: lotes/{id}

```json
{
  "codigo": "LOT-20261010-ABC123",
  "rota": "ID_DA_ROTA",
  "volumeLitros": 340,
  "solicitacaoIds": ["id1", "id2", "id3"],
  "quantidadeColetas": 3,
  "status": "em_transporte",
  "responsavelUid": "UID_DO_OPERADOR",
  "createdAt": "Timestamp do Firebase",
  "updatedAt": "Timestamp do Firebase"
}
```

Depois da etapa de recebimento:

```json
{
  "status": "recebido",
  "quantidadeRecebidaLitros": 340,
  "recebidoEm": "Timestamp do Firebase"
}
```

Depois da etapa de destinação:

```json
{
  "status": "destinado",
  "quantidadeDestinadaLitros": 300,
  "destinadoEm": "Timestamp do Firebase"
}
```

---

### 1.4) Documento de recebimento: recebimentos/{id}

```json
{
  "loteId": "ID_DO_LOTE",
  "quantidadeLitros": 340,
  "resultado": "conforme",
  "observacoes": "Recebimento conforme padrão.",
  "responsavelUid": "UID_DO_OPERADOR",
  "createdAt": "Timestamp do Firebase"
}
```

---

### 1.5) Documento de destinação: destinacoes/{id}

```json
{
  "loteId": "ID_DO_LOTE",
  "destinatario": "Recicladora XYZ",
  "tipoDestino": "Reciclagem",
  "quantidadeLitros": 300,
  "observacoes": "Destino final validado.",
  "responsavelUid": "UID_DO_DESTINO",
  "destinadoEm": "Timestamp do Firebase",
  "createdAt": "Timestamp do Firebase"
}
```

---

### 1.6) Documento de histórico: movimentacoes/{id}

```json
{
  "solicitacaoId": "ID_DA_SOLICITACAO",
  "loteId": "ID_DO_LOTE",
  "tipo": "status_alterado",
  "statusAnterior": "solicitada",
  "statusNovo": "agendada",
  "responsavelUid": "UID_DO_USUARIO",
  "createdAt": "Timestamp do Firebase"
}
```

Este campo é usado apenas para auditoria e deve ser apenas criado, não alterado.

---

## 2) Regras do Firestore (código completo e seguro)

Use este conteúdo como base para o arquivo `firestore.rules`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function signedIn() {
      return request.auth != null;
    }

    function profilePath() {
      return /databases/$(database)/documents/users/$(request.auth.uid);
    }

    function hasRole(r) {
      return signedIn()
        && exists(profilePath())
        && get(profilePath()).data.ativo == true
        && get(profilePath()).data.role == r;
    }

    function isAdmin()       { return hasRole('admin'); }
    function isStaff()       { return hasRole('operador'); }
    function isCollector()   { return hasRole('coletor'); }
    function isGenerator()   { return hasRole('gerador'); }
    function isDestination() { return hasRole('destino'); }
    function isOperational() { return isStaff() || isCollector() || isDestination(); }

    match /users/{uid} {
      allow get: if signedIn() && (request.auth.uid == uid || isAdmin());
      allow list: if isAdmin()
        || (isStaff() && resource.data.role == 'coletor' && resource.data.ativo == true);
      allow create: if signedIn()
        && request.auth.uid == uid
        && request.resource.data.keys().hasOnly(['nome', 'email', 'role', 'ativo', 'createdAt'])
        && request.resource.data.keys().hasAll(['nome', 'email', 'role', 'ativo', 'createdAt'])
        && request.resource.data.nome is string
        && request.resource.data.nome.size() <= 120
        && request.resource.data.email == request.auth.token.email
        && request.resource.data.role == 'gerador'
        && request.resource.data.ativo == true
        && request.resource.data.createdAt == request.time;
      allow update: if isAdmin()
        && request.auth.uid != uid
        && request.resource.data.diff(resource.data).affectedKeys().hasOnly(['role', 'ativo'])
        && request.resource.data.role in ['admin', 'operador', 'gerador', 'coletor', 'destino']
        && request.resource.data.ativo is bool
        && (request.resource.data.role != 'admin' || request.resource.data.ativo == true)
        && (resource.data.role != 'admin'
          || (request.resource.data.role == 'admin' && request.resource.data.ativo == true));
      allow delete: if false;
    }

    match /solicitacoes/{id} {
      allow create: if isStaff()
        || (isGenerator()
            && request.resource.data.solicitanteUid == request.auth.uid
            && request.resource.data.status == 'solicitada'
            && request.resource.data.latitude is number
            && request.resource.data.latitude >= -90
            && request.resource.data.latitude <= 90
            && request.resource.data.longitude is number
            && request.resource.data.longitude >= -180
            && request.resource.data.longitude <= 180
            && request.resource.data.recipienteCodigo is string
            && request.resource.data.recipienteCodigo.matches('REC-[A-Z0-9-]+'));
      allow read: if isStaff()
        || (isCollector() && resource.data.coletorUid == request.auth.uid)
        || (isGenerator() && resource.data.solicitanteUid == request.auth.uid);
      allow update: if isStaff()
        || (isCollector()
            && resource.data.coletorUid == request.auth.uid
            && resource.data.status == 'agendada'
            && request.resource.data.diff(resource.data).affectedKeys()
              .hasOnly(['status', 'recipienteCodigoLido', 'volumeColetadoLitros', 'coletadoPorUid', 'coletadoPorNome', 'coletadaEm', 'updatedAt'])
            && request.resource.data.status == 'coletada'
            && request.resource.data.recipienteCodigoLido == resource.data.recipienteCodigo
            && request.resource.data.coletadoPorUid == request.auth.uid
            && request.resource.data.volumeColetadoLitros is number
            && request.resource.data.volumeColetadoLitros > 0
            && request.resource.data.coletadaEm == request.time
            && request.resource.data.updatedAt == request.time);
      allow delete: if isStaff();
    }

    match /lotes/{id} {
      allow read: if isOperational();
      allow create: if isStaff() || isCollector();
      allow update: if isStaff() || isCollector() || isDestination();
      allow delete: if false;
    }

    match /recebimentos/{id} {
      allow read: if isOperational();
      allow create: if isStaff() || isCollector();
      allow update: if isStaff();
      allow delete: if false;
    }

    match /destinacoes/{id} {
      allow read, create, update: if isStaff() || isDestination();
      allow delete: if false;
    }

    match /movimentacoes/{id} {
      allow read: if isOperational();
      allow create: if isOperational();
      allow update, delete: if false;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

O que isso faz:

- mantém usuários existentes estáveis
- permite auto-criação do perfil do usuário novo
- protege permissão por perfil
- impede exclusão de dados
- não toca em histórico nem em documentos existentes

---

## 3) Índices do Firestore (código completo)

O arquivo `firestore.indexes.json` já pode seguir este modelo:

```json
{
  "indexes": [
    {
      "collectionGroup": "users",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "role", "order": "ASCENDING" },
        { "fieldPath": "ativo", "order": "ASCENDING" }
      ]
    }
  ],
  "fieldOverrides": []
}
```

Se quiser reforçar mais filtros, pode adicionar também:

```json
{
  "collectionGroup": "solicitacoes",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "coletorUid", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" }
  ]
}
```

```json
{
  "collectionGroup": "solicitacoes",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "solicitanteUid", "order": "ASCENDING" },
    { "fieldPath": "status", "order": "ASCENDING" }
  ]
}
```

Mas o importante é não mexer em índices já existentes sem necessidade.

---

## 4) O que você deve fazer sem quebrar nada

### Passo 1 — backup

Antes de qualquer alteração:

- exporte os dados do Firestore
- salve os documentos atuais de users, solicitacoes, lotes, recebimentos e destinacoes
- confirme que seu projeto Firebase está correto no `.env.local`

### Passo 2 — publicar apenas regras e índices

No terminal:

```bash
firebase deploy --only firestore:rules,firestore:indexes --project SEU_PROJECT_ID
```

Troque `SEU_PROJECT_ID` pelo ID do projeto que realmente está no `.env.local`.

### Passo 3 — criar o primeiro admin manualmente

No Console do Firestore, no documento `users/{uid}` de uma conta válida, deixe assim:

```json
{
  "nome": "Administrador inicial",
  "email": "admin@empresa.com",
  "role": "admin",
  "ativo": true,
  "createdAt": "Timestamp atual"
}
```

Isso é o único ajuste manual necessário para liberar o painel de administração.

### Passo 4 — permitir cadastro de novos usuários

Os novos usuários se auto-criam em `users/{uid}` com:

```json
{
  "nome": "Nome do usuário",
  "email": "usuario@email.com",
  "role": "gerador",
  "ativo": true,
  "createdAt": "Timestamp atual"
}
```

Não é necessário criar todos manualmente.

### Passo 5 — deixar os perfis e funções por usuário

Depois de o primeiro admin entrar, ele pode gerir funções por usuário no app.

Sem esse passo, o usuário continua como gerador por padrão e o restante do app fica incompleto.

---

## 5) O que muda no sistema com essa estrutura

### Usuários

- cada usuário pode ter apenas um documento em `users/{uid}`
- o campo `role` define as telas que ele vê
- o campo `ativo` controla se a conta está habilitada

### Solicitações

- gerador cria solicitação ligada ao seu `uid`
- operador visualiza e administra
- coletor só vê as solicitações atribuídas a ele
- o status avança sem apagar registros antigos

### Lotes, recebimento e destinação

- lotes são criados a partir de coletas concluídas
- recebimento usa `recebimentos/{id}`
- destinação usa `destinacoes/{id}`
- tudo fica rastreável sem remover as solicitações originais

### Histórico

- `movimentacoes` guarda eventos importantes
- não é usado para manipular dados ativos
- funciona como auditoria operacional

---

## 6) O que NÃO fazer

Não faça isso em produção sem criar um backup:

- apagar a coleção `users`
- apagar `solicitacoes`
- renomear campos como `role` para `perfil`
- trocar `ativo` por outro nome sem migrar
- remover documentos antigos para “limpar” o banco
- publicar regras muito abertas sem validar acesso por perfil

---

## 7) Resumo final

Se você quiser manter tudo funcionando sem desmoronar o projeto atual, o caminho seguro é:

1. manter todas as coleções existentes
2. adicionar os campos e documentos necessários conforme o app usa
3. publicar as regras atualizadas
4. criar o primeiro usuário admin
5. deixar que os usuários novos se criem automaticamente
6. evitar exclusão de dados e manter `ativo` como controle de acesso

Esse é o modelo mais seguro para o sistema continuar funcionando com o mínimo de risco.