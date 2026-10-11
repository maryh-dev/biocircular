import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertCircle,
  Check,
  LoaderCircle,
  Search,
  ShieldCheck,
  Users,
  UserMinus,
} from 'lucide-react';
import {
  alterarFuncaoUsuario,
  alterarStatusUsuario,
  FUNCOES_USUARIO,
  observarUsuarios,
} from '../../services/admin.js';

function mensagemErro(error) {
  const code = error?.code || '';

  if (code.includes('permission-denied') || code.includes('unauthenticated')) {
    return 'Ação não autorizada. Entre novamente com uma conta administradora.';
  }
  if (code.includes('unavailable')) {
    return 'Não foi possível conectar ao Firestore. Confira sua conexão e tente novamente.';
  }
  return 'Não foi possível concluir a alteração. Confira as regras do Firestore e tente novamente.';
}

export default function UsuariosAdmin({ session }) {
  const [usuarios, setUsuarios] = useState(null);
  const [busca, setBusca] = useState('');
  const [ocupado, setOcupado] = useState(null);
  const [erro, setErro] = useState('');
  const [aviso, setAviso] = useState('');
  const uidAtual = session?.user?.uid;

  useEffect(() => {
    return observarUsuarios(
      setUsuarios,
      (error) => {
        console.error('Não foi possível carregar usuários:', error);
        setErro(mensagemErro(error));
      }
    );
  }, []);

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase('pt-BR');
    if (!termo) return usuarios || [];
    return (usuarios || []).filter((usuario) =>
      [usuario.nome, usuario.email, usuario.role]
        .filter(Boolean)
        .some((valor) => valor.toLocaleLowerCase('pt-BR').includes(termo))
    );
  }, [busca, usuarios]);

  async function executar(uid, acao, sucesso) {
    setErro('');
    setAviso('');
    setOcupado(`${uid}:${acao}`);
    try {
      await sucesso();
      setAviso('Alteração concluída.');
    } catch (error) {
      console.error(`Não foi possível executar ${acao} para ${uid}:`, error);
      setErro(mensagemErro(error));
    } finally {
      setOcupado(null);
    }
  }

  function confirmarRemocaoAcesso(usuario) {
    const identificacao = usuario.nome || usuario.email || usuario.id;
    if (!window.confirm(
      `Remover o acesso de ${identificacao}? A conta continuará no Firebase Authentication e poderá ser reativada por um administrador.`
    )) return;

    executar(usuario.id, 'status', () => alterarStatusUsuario(usuario.id, false));
  }

  const ativos = (usuarios || []).filter((usuario) => usuario.ativo === true).length;

  return (
    <div className="min-h-screen bg-bioclube-light px-4 py-6 text-bioclube-textMain sm:px-6 sm:py-9 lg:px-10">
      <main className="mx-auto max-w-7xl space-y-7">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-amber-700">
              Administração
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-bioclube-dark sm:text-3xl">
              Controle de usuários
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-bioclube-textSub">
              Gerencie quem tem acesso à plataforma e qual área cada pessoa pode utilizar.
            </p>
          </div>
          <div className="flex w-fit items-center gap-3 rounded-2xl border border-bioclube-border bg-white px-4 py-3 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <Users aria-hidden="true" className="h-5 w-5" />
            </span>
            <span>
              <span className="block text-xl font-extrabold text-bioclube-dark">{ativos}</span>
              <span className="block text-xs text-bioclube-textSub">contas ativas</span>
            </span>
          </div>
        </section>

        <section className="rounded-2xl border border-bioclube-border bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-bioclube-border p-4 sm:flex-row sm:items-center sm:px-6 sm:py-5">
            <div>
              <h2 className="font-bold text-bioclube-dark">Pessoas cadastradas</h2>
              <p className="mt-1 text-xs text-bioclube-textSub">
                Altere a função, remova o acesso ao app ou reative uma conta.
              </p>
            </div>
            <label className="relative block w-full sm:max-w-xs">
              <Search aria-hidden="true" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por nome, e-mail ou função"
                aria-label="Buscar usuários"
                className="w-full rounded-xl border border-bioclube-border py-2.5 pl-9 pr-3 text-sm outline-none transition focus:border-bioclube-amber focus:ring-4 focus:ring-amber-500/10"
              />
            </label>
          </div>

          {erro && (
            <p role="alert" className="mx-4 mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 sm:mx-6">
              <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
              {erro}
            </p>
          )}
          {aviso && !erro && (
            <p role="status" className="mx-4 mt-4 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800 sm:mx-6">
              <Check aria-hidden="true" className="h-4 w-4 shrink-0" />
              {aviso}
            </p>
          )}

          <div className="space-y-3 p-4 lg:hidden">
            {usuarios === null && !erro && (
              <div className="rounded-xl border border-bioclube-border p-6 text-center text-sm text-bioclube-textSub">
                <LoaderCircle aria-hidden="true" className="mx-auto mb-2 h-5 w-5 animate-spin" />
                Carregando usuários…
              </div>
            )}
            {usuarios !== null && listaFiltrada.length === 0 && (
              <p className="rounded-xl border border-bioclube-border p-6 text-center text-sm text-bioclube-textSub">
                {busca ? 'Nenhum usuário corresponde à busca.' : 'Nenhum usuário cadastrado.'}
              </p>
            )}
            {listaFiltrada.map((usuario) => {
              const proprioUsuario = usuario.id === uidAtual;
              const estaAtivo = usuario.ativo === true;
              const administrador = usuario.role === 'admin';
              const administradorAtivo = administrador && estaAtivo;
              const alterando = ocupado?.startsWith(`${usuario.id}:`);

              return (
                <article key={usuario.id} className="space-y-4 rounded-xl border border-bioclube-border bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bioclube-dark text-xs font-bold text-bioclube-amber">
                        {(usuario.nome || usuario.email || '?')
                          .split(/[\s@.]+/)
                          .filter(Boolean)
                          .slice(0, 2)
                          .map((parte) => parte[0])
                          .join('')
                          .toUpperCase()}
                      </span>
                      <span className="min-w-0">
                        <span className="block break-words text-sm font-semibold text-bioclube-textMain">
                          {usuario.nome || 'Sem nome'}
                          {proprioUsuario && <span className="ml-1 text-[10px] font-medium text-bioclube-textSub">(você)</span>}
                        </span>
                        <span className="mt-1 block break-all text-xs text-bioclube-textSub">
                          {usuario.email || 'Sem e-mail'}
                        </span>
                      </span>
                    </div>
                    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-bold ${
                      estaAtivo ? 'bg-emerald-50 text-emerald-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${estaAtivo ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                      {estaAtivo ? 'Ativo' : 'Inativo'}
                    </span>
                  </div>

                  <label className="block text-xs font-semibold text-bioclube-textSub">
                    Função
                    <select
                      value={FUNCOES_USUARIO.some(({ valor }) => valor === usuario.role) ? usuario.role : 'gerador'}
                      disabled={proprioUsuario || administrador || Boolean(alterando)}
                      aria-label={`Função de ${usuario.nome || usuario.email || usuario.id}`}
                      onChange={(event) => executar(
                        usuario.id,
                        'funcao',
                        () => alterarFuncaoUsuario(usuario.id, event.target.value)
                      )}
                      className="mt-1.5 w-full rounded-lg border border-bioclube-border bg-white px-3 py-2.5 text-sm font-semibold text-bioclube-dark disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                    >
                      {FUNCOES_USUARIO.map(({ valor, rotulo }) => (
                        <option key={valor} value={valor}>{rotulo}</option>
                      ))}
                    </select>
                  </label>

                  <button
                    type="button"
                    disabled={proprioUsuario || administradorAtivo || Boolean(alterando)}
                    onClick={() => estaAtivo
                      ? confirmarRemocaoAcesso(usuario)
                      : executar(
                        usuario.id,
                        'status',
                        () => alterarStatusUsuario(usuario.id, true)
                      )}
                    className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-bioclube-border px-3 py-2 text-xs font-semibold text-bioclube-dark transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {estaAtivo
                      ? <UserMinus aria-hidden="true" className="h-4 w-4" />
                      : <ShieldCheck aria-hidden="true" className="h-4 w-4" />}
                    {estaAtivo ? 'Remover acesso' : 'Reativar acesso'}
                  </button>
                </article>
              );
            })}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-[10px] font-bold uppercase tracking-[0.12em] text-bioclube-textSub">
                <tr>
                  <th scope="col" className="px-6 py-3">Usuário</th>
                  <th scope="col" className="px-4 py-3">Função</th>
                  <th scope="col" className="px-4 py-3">Acesso</th>
                  <th scope="col" className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-bioclube-border">
                {usuarios === null && !erro && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-bioclube-textSub">
                      <LoaderCircle aria-hidden="true" className="mx-auto mb-2 h-5 w-5 animate-spin" />
                      Carregando usuários…
                    </td>
                  </tr>
                )}
                {usuarios !== null && listaFiltrada.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-sm text-bioclube-textSub">
                      {busca ? 'Nenhum usuário corresponde à busca.' : 'Nenhum usuário cadastrado.'}
                    </td>
                  </tr>
                )}
                {listaFiltrada.map((usuario) => {
                  const proprioUsuario = usuario.id === uidAtual;
                  const estaAtivo = usuario.ativo === true;
                  const administrador = usuario.role === 'admin';
                  const administradorAtivo = administrador && estaAtivo;
                  const alterando = ocupado?.startsWith(`${usuario.id}:`);
                  return (
                    <tr key={usuario.id} className="transition hover:bg-slate-50/70">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-bioclube-dark text-xs font-bold text-bioclube-amber">
                            {(usuario.nome || usuario.email || '?')
                              .split(/[\s@.]+/)
                              .filter(Boolean)
                              .slice(0, 2)
                              .map((parte) => parte[0])
                              .join('')
                              .toUpperCase()}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-bioclube-textMain">
                              {usuario.nome || 'Sem nome'}
                              {proprioUsuario && <span className="ml-2 text-[10px] font-medium text-bioclube-textSub">(você)</span>}
                            </span>
                            <span className="mt-1 block truncate text-xs text-bioclube-textSub">
                              {usuario.email || 'Sem e-mail'}
                            </span>
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          value={FUNCOES_USUARIO.some(({ valor }) => valor === usuario.role) ? usuario.role : 'gerador'}
                          disabled={proprioUsuario || administrador || Boolean(alterando)}
                          aria-label={`Função de ${usuario.nome || usuario.email || usuario.id}`}
                          onChange={(event) => executar(
                            usuario.id,
                            'funcao',
                            () => alterarFuncaoUsuario(usuario.id, event.target.value)
                          )}
                          className="rounded-lg border border-bioclube-border bg-white px-2.5 py-2 text-xs font-semibold text-bioclube-dark disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                        >
                          {FUNCOES_USUARIO.map(({ valor, rotulo }) => (
                            <option key={valor} value={valor}>{rotulo}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          estaAtivo
                            ? 'bg-emerald-50 text-emerald-800'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${estaAtivo ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                          {estaAtivo ? 'Ativo' : 'Acesso removido'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            disabled={proprioUsuario || administradorAtivo || Boolean(alterando)}
                            onClick={() => estaAtivo
                              ? confirmarRemocaoAcesso(usuario)
                              : executar(
                                usuario.id,
                                'status',
                                () => alterarStatusUsuario(usuario.id, true)
                              )}
                            title={estaAtivo ? 'Remover acesso' : 'Reativar acesso'}
                            aria-label={`${estaAtivo ? 'Remover acesso de' : 'Reativar'} ${usuario.nome || usuario.email || 'usuário'}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-bioclube-border px-3 py-2 text-xs font-semibold text-bioclube-dark transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            {estaAtivo
                              ? <UserMinus aria-hidden="true" className="h-4 w-4" />
                              : <ShieldCheck aria-hidden="true" className="h-4 w-4" />}
                            <span className="hidden xl:inline">{estaAtivo ? 'Remover acesso' : 'Reativar'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-start gap-2 border-t border-bioclube-border bg-slate-50/70 px-4 py-4 text-xs leading-5 text-bioclube-textSub sm:px-6">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
            <p>
              Contas de administrador ativo são protegidas contra remoção de acesso e troca de função. “Remover acesso” bloqueia o uso do app, mas não apaga a conta do Firebase Authentication.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
