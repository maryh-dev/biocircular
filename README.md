# BIOCIRCULAR

Aplicação web para rastreabilidade e gestão do fluxo de resíduos, desde a solicitação de coleta até a destinação final. O sistema organiza geradores, operação, coletores, recebimento, lotes e unidades de destino em um único fluxo operacional.

## Funcionalidades

- Página inicial institucional e autenticação por e-mail e senha.
- Perfis de acesso:
  - **Gerador:** solicita coletas, acompanha solicitações e consulta recipientes.
  - **Operação:** gerencia solicitações, planeja rotas, cria lotes, registra indicadores e recebimentos.
  - **Coletor:** visualiza a rota, valida o recipiente por QR Code e registra o volume coletado.
  - **Destino final:** registra a destinação dos lotes recebidos.
  - **Administrador:** gerencia funções e acesso dos usuários.
- Solicitações com endereço, data preferencial, janela, volume, código do recipiente e coordenadas.
- Planejamento de rota com mapa e ordenação local das paradas.
- Visualização de rotas com Leaflet e mapas do OpenStreetMap.
- Leitura de QR Code pela câmera ou entrada manual do código.
- Agrupamento de coletas em lotes.
- Registro de recebimento e destinação.
- Indicadores operacionais e exportação em CSV.
- Histórico de movimentações no Firestore.

## Tecnologias

- React 19
- Vite
- Firebase Authentication
- Cloud Firestore
- React Leaflet e Leaflet
- Three.js
- Tailwind CSS
- `html5-qrcode`
- `qrcode.react`
- `lucide-react`

## Pré-requisitos

- Node.js com npm.
- Um projeto Firebase configurado.
- Firebase CLI, caso seja necessário publicar regras e índices:

  ```powershell
  npm install -g firebase-tools
  ```

## Instalação

Clone ou copie o projeto e instale as dependências:

```powershell
npm ci
```

Se o arquivo `package-lock.json` precisar ser regenerado após alterações nas dependências, use:

```powershell
npm install
```

## Configuração do Firebase

1. Copie `.env.example` para `.env.local`.
2. Preencha as variáveis com as credenciais do aplicativo Web no Firebase Console:

   ```dotenv
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```

3. Ative o Firebase Authentication com o provedor de e-mail e senha.
4. Configure o Cloud Firestore.
5. Publique as regras e os índices deste projeto:

   ```powershell
   firebase deploy --only firestore:rules,firestore:indexes --project SEU_PROJECT_ID
   ```

6. Defina o primeiro administrador no Firebase Console, alterando o documento `users/{uid}` para conter:

   ```json
   {
     "role": "admin",
     "ativo": true
   }
   ```

Consulte [COMO-CONFIGURAR.md](./COMO-CONFIGURAR.md) para o procedimento completo, o fluxo de teste e a solução de problemas.

## Executando localmente

Inicie o servidor de desenvolvimento:

```powershell
npm run dev
```

Depois, abra a URL exibida pelo Vite, normalmente `http://localhost:5173`.

Para gerar a versão de produção:

```powershell
npm run build
```

Para visualizar localmente a versão compilada:

```powershell
npm run preview
```

## Testes

Os testes unitários das funções de rotas podem ser executados com:

```powershell
node --test src\utils\geoRotas.test.js
```

## Fluxo operacional

1. O gerador informa os dados da coleta, o código do recipiente e sua localização.
2. A operação seleciona solicitações e publica uma rota para um coletor ativo.
3. O coletor valida o recipiente por QR Code e registra a quantidade coletada.
4. A operação agrupa as coletas concluídas em um lote.
5. O recebimento registra a quantidade recebida e altera o status do lote.
6. O destino registra a unidade, o processo e a quantidade destinada.
7. A operação acompanha os resultados nos indicadores.

## Rotas e geolocalização

A ordenação das paradas é estimada localmente pela distância em linha reta. O sistema não calcula ruas, trânsito ou tempo de viagem. O navegador precisa de permissão de localização e câmera quando esses recursos forem utilizados.

Geolocalização e câmera funcionam em `localhost` ou em uma aplicação publicada com HTTPS. O mapa usa tiles do OpenStreetMap e, portanto, precisa de conexão com a internet.

## Segurança e dados

- As credenciais do Firebase devem permanecer em `.env.local`, que não deve ser versionado.
- As regras do Firestore restringem o acesso conforme o perfil e o status ativo do usuário.
- Perfis não são apagados pelo aplicativo; o acesso pode ser suspenso com `ativo: false`.
- O código do recipiente é validado durante o registro da coleta.
- Solicitações antigas sem código ou coordenadas não entram em novas rotas automaticamente.

Para detalhes sobre regras, coleções, limitações e cuidados de publicação, consulte [BANCO_SEGURANCA_FIRESTORE.md](./BANCO_SEGURANCA_FIRESTORE.md).

## Estrutura

```text
.
├── public/                 # Arquivos públicos e ícones
├── src/
│   ├── components/         # Componentes reutilizáveis
│   ├── pages/              # Telas separadas por perfil
│   ├── services/           # Firebase, Firestore e regras de negócio
│   ├── utils/              # Utilitários e testes
│   ├── App.jsx             # Shell da aplicação e controle de sessão
│   └── main.jsx            # Ponto de entrada do React
├── firestore.rules         # Regras de segurança do Firestore
├── firestore.indexes.json  # Índices compostos
├── firebase.json            # Configuração do Firebase CLI
└── package.json             # Scripts e dependências
```

## Licença

Este projeto não define uma licença pública.

boraaa
