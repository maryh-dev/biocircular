# BIOCIRCULAR — configuração do aplicativo sem plano Blaze

O Firebase, o Authentication, o Firestore e o `.env.local` já estão configurados. **Não é necessário criar projeto, banco, coleções nem ativar o plano Blaze.** O aplicativo usa Authentication e as coleções já existentes. Solicitações novas passam a guardar código do recipiente e coordenadas; as rotas e os registros de coleta também ficam nos documentos de solicitação existentes.

## O que mudou

- O cadastro cria a conta no Firebase Authentication e, ao entrar, o próprio usuário cria seu perfil inicial `gerador` em `users/{uid}`.
- O administrador lista usuários e pode mudar a função ou remover/restaurar o acesso ao aplicativo.
- **Remover acesso não apaga a conta do Firebase Authentication.** O perfil permanece com `ativo: false`, impedindo acesso às telas e aos dados protegidos. Um administrador pode reativá-lo.
- A exclusão física da conta do Authentication não é oferecida: sem um serviço de servidor, o SDK do navegador não pode excluir com segurança a conta de outra pessoa.
- Um administrador não pode alterar o próprio perfil nem remover o acesso ou rebaixar um administrador ativo. Assim, a interface não consegue deixar o sistema sem um administrador ativo.
- O gerador precisa informar o código do recipiente e marcar o ponto no mapa (ou usar a localização do dispositivo) ao solicitar uma coleta.
- A operação pode selecionar solicitações com esses dados, atribuir uma sequência a um coletor e publicá-la. O coletor lê o QR, registra o volume e conclui a parada.
- A sequência é estimada localmente pela distância em linha reta entre os pontos. Ela **não** calcula ruas, trânsito ou tempo de viagem.
- Coletas registradas podem ser agrupadas em lotes; a operação registra o recebimento e o perfil de destino registra a destinação. O fluxo usa as coleções `lotes`, `recebimentos` e `destinacoes` existentes.
- Os indicadores são calculados com as solicitações do Firestore e podem ser exportados em CSV; não dependem mais dos valores fictícios usados anteriormente na tela.

## O que precisa ser publicado

1. Publique as regras e o índice composto do Firestore deste projeto:

   ```powershell
   firebase deploy --only firestore:rules,firestore:indexes --project SEU_PROJECT_ID
   ```

2. Publique o frontend atualizado pelo mesmo processo de publicação/hosting já usado neste projeto.

Substitua `SEU_PROJECT_ID` pelo ID do projeto Firebase já configurado no `.env.local`. O índice permite listar somente coletores ativos sem expor perfis inativos à operação. A criação dele pode levar alguns minutos. Não é necessário publicar Cloud Functions, instalar dependências de Functions nem alterar os documentos existentes.

As regras permitem que uma conta nova crie somente o próprio perfil como `gerador`. Também restringem a gestão de funções e acesso a administradores autenticados; perfis não podem ser apagados do Firestore pelo aplicativo. Coletores só leem as solicitações atribuídas a eles e só podem concluir uma parada após validar o código do recipiente e informar um volume.

## Localização, QR Code e rotas

- A geolocalização do navegador precisa de permissão e de HTTPS (ou `localhost`). Ela é opcional: também é possível clicar no mapa e arrastar o marcador. As coordenadas ficam no documento da solicitação.
- O mapa carrega imagens de tiles do OpenStreetMap pela internet; como em qualquer mapa online, o serviço de tiles recebe requisições da área visualizada. O aplicativo não envia a rota para um serviço de otimização externo.
- A câmera para ler QR Code também precisa de permissão e de HTTPS (ou `localhost`). Há entrada manual do código como alternativa.
- `REC-00482` é apenas um QR de demonstração imprimível em **Recipientes**. O app ainda não possui cadastro/estoque de recipientes: use esse código no gerador para testar ponta a ponta ou informe um código real cujo QR já exista.
- Solicitações antigas, sem coordenadas ou código de recipiente, continuam no Firestore e no histórico, mas não podem entrar numa rota nova até serem substituídas por uma solicitação com os dados necessários. Não há migração automática.
- Não foi feita publicação no Firebase durante a implementação. Para ativar a versão nova, publique as regras atualizadas e o frontend pelo processo já usado no projeto.

## Primeiro administrador

Se ainda não existe um perfil com `role: admin`, escolha uma conta existente no Console do Firestore e altere uma única vez o campo `role` em `users/{uid}` para `admin`. Confirme que `ativo` está como `true`, depois saia e entre novamente. Essa configuração inicial é manual; a partir daí, use a página **Usuários** para gerenciar as demais funções.

Contas de administrador não podem ser rebaixadas ou suspensas pelo aplicativo. Para recuperar ou alterar um administrador, use o Console do Firebase com cuidado.

## Verificação

- Cadastre uma conta de teste. Ela deve aparecer no Authentication e em `users` como `gerador` e `ativo: true`.
- Entre como administrador. A conta deve ver somente a área **Usuários**.
- Mude a função da conta de teste e confirme que as páginas disponíveis mudam ao entrar com ela.
- Remova o acesso da conta. O perfil deve permanecer em `users` com `ativo: false`; a pessoa não deve conseguir usar o app.
- Reative a conta para devolver o acesso.
- Crie uma solicitação como gerador com o código `REC-00482`, selecione o local e envie.
- Como operador, selecione a solicitação, ordene as paradas e atribua a rota a um usuário ativo com função `coletor`.
- Como coletor, confira se a parada aparece, leia ou digite `REC-00482`, informe a quantidade coletada e confirme. A solicitação deve ficar com status `coletada`.
- Como operador, em **Lotes**, agrupe uma ou mais coletas concluídas e registre o recebimento do lote.
- Como destino, selecione um lote recebido, informe a unidade, o processo e o volume destinado, e confirme.
- Em **Indicadores**, escolha um mês com atividade e exporte o CSV.

A conta ainda poderá autenticar no Firebase Authentication depois de ter o acesso ao aplicativo removido; o app a desconectará ao detectar o perfil inativo. Os registros operacionais associados não são apagados.

## Se algo falhar

- **Cadastro não cria o documento em `users`:** confira se as regras acima foram publicadas no projeto configurado no `.env.local` e se a pessoa concluiu o cadastro com o e-mail.
- **Administrador não consegue listar ou mudar funções:** confira se o documento dele tem exatamente `role: admin` e `ativo: true`, e se as regras foram publicadas.
- **A operação não lista coletores:** confirme que os perfis em `users` têm `role: coletor` e `ativo: true`, e publique as regras atualizadas.
- **Coletor não vê a rota ou não conclui a coleta:** confirme que a solicitação foi publicada para o UID do coletor e que ele entrou com a conta correspondente; publique as regras atualizadas.
- **Mapa ou câmera não abre:** confira a conexão, a permissão do navegador e se o site está em HTTPS ou `localhost`.
- **A conta entra e volta para o login:** confira se `ativo` está como `true` no perfil em `users/{uid}`.
