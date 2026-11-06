import { useEffect, useState, type FormEvent } from 'react'
import { Eye, EyeOff, HeartPulse, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useTituloPagina } from '@/hooks/useTituloPagina'
import { dataNascimentoValida, formatarTelefone, somenteNumeros, telefoneValido } from '@/lib/dadosCadastro'
import { supabase } from '@/lib/supabase'

type Etapa = 'entrar' | 'cadastro' | 'recuperar' | 'verificar' | 'novaSenha'

const titulos: Record<Etapa, string> = {
  entrar: 'Entre na sua conta',
  cadastro: 'Crie sua conta',
  recuperar: 'Recupere sua senha',
  verificar: 'Confira seu e-mail',
  novaSenha: 'Escolha uma nova senha',
}

const campo = 'min-h-12 w-full min-w-0 border border-input bg-white px-3 py-2 text-base text-tinta outline-none focus:border-verde-posto focus:ring-1 focus:ring-verde-posto'
const rotulo = 'mb-2 block text-sm font-semibold text-tinta'
const link = 'font-semibold text-azul-cartilha underline underline-offset-4'

function dataDeHoje() {
  const hoje = new Date()
  const ano = hoje.getFullYear()
  const mes = String(hoje.getMonth() + 1).padStart(2, '0')
  const dia = String(hoje.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function Login() {
  const navegar = useNavigate()
  const localizacao = useLocation()
  const destino = (localizacao.state as { destino?: string } | null)?.destino || '/'
  const [etapa, setEtapa] = useState<Etapa>('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmacao, setConfirmacao] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [nascimento, setNascimento] = useState('')
  const [codigo, setCodigo] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [aviso, setAviso] = useState('')
  const [temErro, setTemErro] = useState(false)
  const [carregando, setCarregando] = useState(false)

  useTituloPagina(titulos[etapa])

  function abrirSite() {
    const caminho = destino.startsWith('/') && !destino.startsWith('//') ? destino : '/'
    navegar(caminho, { replace: true })
  }

  useEffect(() => {
    if (!supabase) return

    let ativo = true

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (ativo && user) {
        const caminho = destino.startsWith('/') && !destino.startsWith('//') ? destino : '/'
        navegar(caminho, { replace: true })
      }
    }).catch(() => {})

    return () => { ativo = false }
  }, [destino, navegar])

  function avisar(texto: string, erro = false) {
    setAviso(texto)
    setTemErro(erro)
  }

  function mudarEtapa(novaEtapa: Etapa) {
    setEtapa(novaEtapa)
    setSenha('')
    setConfirmacao('')
    setMostrarSenha(false)
    avisar('')
  }

  async function entrar() {
    if (!supabase) return

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: senha,
    })

    if (error) {
      avisar('Não foi possível entrar. Confira seu e-mail, sua senha e a confirmação do cadastro.', true)
      return
    }

    abrirSite()
  }

  async function cadastrar() {
    if (!supabase) return

    if (!telefoneValido(telefone)) {
      avisar('Informe um telefone com DDD, incluindo 10 ou 11 números.', true)
      return
    }

    if (endereco.trim().length < 10) {
      avisar('Informe seu endereço completo, com rua, número, bairro e cidade.', true)
      return
    }

    if (!dataNascimentoValida(nascimento)) {
      avisar('Confira sua data de nascimento.', true)
      return
    }

    if (senha.length < 8) {
      avisar('Sua senha precisa ter pelo menos 8 caracteres.', true)
      return
    }

    if (senha !== confirmacao) {
      avisar('As senhas não são iguais.', true)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: senha,
      options: {
        data: {
          telefone: somenteNumeros(telefone),
          endereco: endereco.trim(),
          data_nascimento: nascimento,
        },
      },
    })

    if (error) {
      avisar('Não foi possível criar sua conta. Confira os dados e tente novamente.', true)
      return
    }

    setSenha('')
    setConfirmacao('')

    if (data.session) {
      abrirSite()
      return
    }

    mudarEtapa('entrar')
    avisar('Conta criada! Enviamos um e-mail para você confirmar seu cadastro.')
  }

  async function enviarCodigo() {
    if (!supabase) return

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim())

    if (error) {
      avisar('Não foi possível enviar o código agora. Tente novamente em instantes.', true)
      return
    }

    setCodigo('')
    setEtapa('verificar')
    avisar('Se esse e-mail estiver cadastrado, você receberá um código. Confira também a caixa de spam.')
  }

  async function verificarCodigo() {
    if (!supabase) return

    if (!/^\d{6}$/.test(codigo)) {
      avisar('Digite o código de 6 números enviado para seu e-mail.', true)
      return
    }

    const { error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: codigo,
      type: 'recovery',
    })

    if (error) {
      avisar('Esse código é inválido ou expirou. Confira o e-mail ou peça outro.', true)
      return
    }

    mudarEtapa('novaSenha')
    avisar('Código confirmado! Agora você pode escolher sua nova senha.')
  }

  async function alterarSenha() {
    if (!supabase) return

    if (senha.length < 8) {
      avisar('Sua senha precisa ter pelo menos 8 caracteres.', true)
      return
    }

    if (senha !== confirmacao) {
      avisar('As senhas não são iguais.', true)
      return
    }

    const { error } = await supabase.auth.updateUser({ password: senha })

    if (error) {
      avisar('Não foi possível alterar sua senha. Solicite outro código e tente novamente.', true)
      return
    }

    await supabase.auth.signOut()
    mudarEtapa('entrar')
    avisar('Senha alterada com sucesso! Entre usando sua nova senha.')
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()

    if (!supabase) {
      avisar('O acesso ainda não está configurado. Verifique as credenciais do Supabase.', true)
      return
    }

    setCarregando(true)
    avisar('')

    try {
      switch (etapa) {
        case 'entrar':
          await entrar()
          break
        case 'cadastro':
          await cadastrar()
          break
        case 'recuperar':
          await enviarCodigo()
          break
        case 'verificar':
          await verificarCodigo()
          break
        case 'novaSenha':
          await alterarSenha()
          break
      }
    } catch {
      avisar('Não conseguimos concluir a solicitação. Verifique sua conexão e tente novamente.', true)
    } finally {
      setCarregando(false)
    }
  }

  async function reenviarCodigo() {
    if (!supabase || carregando) return

    setCarregando(true)
    avisar('')

    try {
      await enviarCodigo()
    } catch {
      avisar('Não conseguimos reenviar o código. Tente novamente.', true)
    } finally {
      setCarregando(false)
    }
  }

  const temEmail = etapa !== 'novaSenha'
  const temSenha = etapa === 'entrar' || etapa === 'cadastro' || etapa === 'novaSenha'
  const temConfirmacao = etapa === 'cadastro' || etapa === 'novaSenha'

  return (
    <section className="min-h-[calc(100dvh-13rem)] bg-papel px-4 py-10 md:py-16">
      <div className="mx-auto grid w-full max-w-5xl overflow-hidden border border-border bg-white md:grid-cols-2">
        <aside className="faixa-escura flex flex-col justify-between bg-verde-posto p-7 text-papel md:p-10">
          <div>
            <div className="inline-flex items-center gap-2 font-heading text-lg font-bold">
              <HeartPulse className="size-7" aria-hidden="true" />
              Saúde Perto
            </div>
            <div className="mt-16 max-w-sm md:mt-24">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-papel/75">
                Cuidado e informação
              </p>
              <h1 className="mt-4 font-heading text-3xl font-bold leading-tight md:text-4xl">
                Sua saúde merece atenção por perto.
              </h1>
              <p className="mt-5 text-base text-papel/85">
                Acesse sua conta e encontre informações de saúde em um só lugar.
              </p>
            </div>
          </div>
          <div className="mt-14 flex items-start gap-3 border-t border-papel/25 pt-5 text-sm text-papel/80">
            <ShieldCheck className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            <p>Este projeto é informativo e não substitui o atendimento de profissionais de saúde.</p>
          </div>
        </aside>

        <div className="flex flex-col justify-center p-6 sm:p-9 md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-verde-posto">
            Saúde Perto
          </p>
          <h2 className="mt-2 font-heading text-3xl font-bold text-tinta">{titulos[etapa]}</h2>
          <p className="mt-3 text-tinta-suave">
            {etapa === 'cadastro' && 'Preencha seus dados para começar.'}
            {etapa === 'entrar' && 'Que bom ter você por aqui. Informe seu e-mail e sua senha.'}
            {etapa === 'recuperar' && 'Digite seu e-mail para receber um código de recuperação.'}
            {etapa === 'verificar' && `Digite o código de 6 números enviado para ${email}.`}
            {etapa === 'novaSenha' && 'Crie uma senha com pelo menos 8 caracteres.'}
          </p>

          <form onSubmit={enviar} className="mt-8 space-y-5">
            {temEmail && (
              <div>
                <label htmlFor="email" className={rotulo}>E-mail</label>
                <div className="flex items-center border border-input bg-white focus-within:border-verde-posto">
                  <Mail className="ml-3 size-5 shrink-0 text-tinta-suave" aria-hidden="true" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    readOnly={etapa === 'verificar'}
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    placeholder="voce@exemplo.com"
                    className="min-h-12 w-full min-w-0 bg-transparent px-3 py-2 text-base text-tinta outline-none"
                  />
                </div>
              </div>
            )}

            {etapa === 'cadastro' && (
              <>
                <div>
                  <label htmlFor="telefone" className={rotulo}>Telefone com DDD</label>
                  <input
                    id="telefone"
                    name="tel"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    required
                    maxLength={15}
                    value={telefone}
                    onChange={(evento) => setTelefone(formatarTelefone(evento.target.value))}
                    placeholder="(81) 99999-9999"
                    className={campo}
                  />
                </div>

                <div>
                  <label htmlFor="endereco" className={rotulo}>Endereço completo</label>
                  <textarea
                    id="endereco"
                    name="street-address"
                    autoComplete="street-address"
                    required
                    minLength={10}
                    rows={2}
                    value={endereco}
                    onChange={(evento) => setEndereco(evento.target.value)}
                    placeholder="Rua, número, bairro, cidade e estado"
                    className={`${campo} resize-y`}
                  />
                </div>

                <div>
                  <label htmlFor="nascimento" className={rotulo}>Data de nascimento</label>
                  <input
                    id="nascimento"
                    name="bday"
                    type="date"
                    autoComplete="bday"
                    required
                    min="1900-01-01"
                    max={dataDeHoje()}
                    value={nascimento}
                    onChange={(evento) => setNascimento(evento.target.value)}
                    className={campo}
                  />
                </div>
              </>
            )}

            {etapa === 'verificar' && (
              <div>
                <label htmlFor="codigo" className={rotulo}>Código de verificação</label>
                <input
                  id="codigo"
                  name="one-time-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                  value={codigo}
                  onChange={(evento) => setCodigo(somenteNumeros(evento.target.value).slice(0, 6))}
                  placeholder="000000"
                  className={`${campo} text-center text-xl tracking-[0.3em]`}
                />
              </div>
            )}

            {temSenha && (
              <div>
                <label htmlFor="senha" className={rotulo}>
                  {etapa === 'novaSenha' ? 'Nova senha' : 'Senha'}
                </label>
                <div className="flex items-center border border-input bg-white focus-within:border-verde-posto">
                  <LockKeyhole className="ml-3 size-5 shrink-0 text-tinta-suave" aria-hidden="true" />
                  <input
                    id="senha"
                    name="password"
                    type={mostrarSenha ? 'text' : 'password'}
                    autoComplete={etapa === 'entrar' ? 'current-password' : 'new-password'}
                    minLength={etapa === 'entrar' ? 6 : 8}
                    required
                    value={senha}
                    onChange={(evento) => setSenha(evento.target.value)}
                    placeholder="Digite sua senha"
                    className="min-h-12 w-full min-w-0 bg-transparent px-3 py-2 text-base text-tinta outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setMostrarSenha((mostrar) => !mostrar)}
                    aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                    className="mr-2 p-2 text-tinta-suave"
                  >
                    {mostrarSenha ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </div>
            )}

            {temConfirmacao && (
              <div>
                <label htmlFor="confirmacao" className={rotulo}>Confirmar senha</label>
                <input
                  id="confirmacao"
                  name="confirm-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  required
                  value={confirmacao}
                  onChange={(evento) => setConfirmacao(evento.target.value)}
                  placeholder="Digite a senha novamente"
                  className={campo}
                />
              </div>
            )}

            {etapa === 'entrar' && (
              <div className="flex justify-end">
                <button type="button" onClick={() => mudarEtapa('recuperar')} className={`text-sm ${link}`}>
                  Esqueceu sua senha?
                </button>
              </div>
            )}

            {etapa === 'cadastro' && (
              <p className="text-xs leading-relaxed text-tinta-suave">
                Seus dados serão usados para criar sua conta no Saúde Perto.{' '}
                <Link to="/privacidade" className={link}>Saiba como são tratados.</Link>
              </p>
            )}

            <button
              type="submit"
              disabled={carregando}
              className="min-h-12 w-full bg-verde-posto px-5 py-3 font-semibold text-white transition-colors hover:bg-[#0b493a] disabled:opacity-60"
            >
              {carregando ? 'Aguarde...' : {
                entrar: 'Entrar',
                cadastro: 'Criar conta',
                recuperar: 'Enviar código por e-mail',
                verificar: 'Confirmar código',
                novaSenha: 'Salvar nova senha',
              }[etapa]}
            </button>

            {etapa === 'verificar' && (
              <button
                type="button"
                disabled={carregando}
                onClick={reenviarCodigo}
                className={`w-full text-sm disabled:opacity-60 ${link}`}
              >
                Reenviar código
              </button>
            )}
          </form>

          {aviso && (
            <p
              role={temErro ? 'alert' : 'status'}
              className="mt-5 border-l-4 border-amarelo-campanha bg-papel-2 p-3 text-sm text-tinta"
            >
              {aviso}
            </p>
          )}

          {etapa === 'entrar' ? (
            <p className="mt-8 border-t border-border pt-6 text-sm text-tinta-suave">
              Ainda não tem uma conta?{' '}
              <button type="button" onClick={() => mudarEtapa('cadastro')} className={link}>
                Criar cadastro
              </button>
            </p>
          ) : (
            <button
              type="button"
              onClick={() => mudarEtapa('entrar')}
              className={`mt-6 text-sm ${link}`}
            >
              Voltar para o login
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
