# Configurar login, cadastro e recuperação de senha

1. Crie um projeto em https://supabase.com/dashboard.
2. No Supabase, em Project Settings > API (ou Connect), copie a URL do projeto e a chave **publishable/anon**. Nunca use a chave `service_role` no navegador.
3. Na raiz do Saúde Perto, crie `.env.local` baseado em `.env.example` e preencha os dois valores.
4. No Supabase, abra Authentication > Providers > Email e habilite o provedor de e-mail. Para cadastro com confirmação, mantenha a confirmação por e-mail ativada.
5. **Essencial para receber um código de 6 dígitos:** em Authentication > Email Templates > Reset Password, altere o modelo para mostrar `{{ .Token }}` em vez de usar apenas `{{ .ConfirmationURL }}`. Exemplo de corpo: `Seu código de recuperação Saúde Perto é: {{ .Token }}`. O fluxo no site verifica esse código com `verifyOtp` do tipo `recovery`.
6. Em Authentication > URL Configuration, ajuste Site URL para a URL onde seu site roda. Para desenvolvimento, `http://localhost:5173`.
7. Instale as dependências com `npm.cmd install` (em vez de `npm.cmd ci`, pois foi adicionada uma dependência e o lockfile precisa ser atualizado). Depois rode `npm.cmd run dev`.
8. Acesse `http://localhost:5173/login`, crie uma conta com e-mail real, confirme o cadastro e teste “Esqueceu sua senha?”.

## Atenção
- O Supabase pode limitar envio de e-mails com seu serviço padrão. Para publicar para usuários reais, configure SMTP próprio e revise limites/rate limiting no painel.
- Nunca envie senhas nem códigos para um banco de dados próprio. O Supabase Auth valida o código e gerencia a sessão.
- O login autentica, mas **as páginas de agendamento e solicitações ainda não foram integradas à conta**; é uma etapa separada.
- Se o usuário clicar no link padrão de recuperação em vez de digitar o código, o fluxo de link não está implementado nesta versão. Configure o modelo para mostrar o código.

## Dados do cadastro

O formulário solicita telefone, endereço completo e data de nascimento. Esses valores são armazenados em `user_metadata` no Supabase Auth, junto à conta criada. Não é necessária uma tabela adicional para este cadastro inicial.

Antes de publicar o site para pessoas reais, revise a política de privacidade, a finalidade da coleta desses dados e as configurações de proteção do projeto. Para demonstrações acadêmicas, prefira contas e informações fictícias.
