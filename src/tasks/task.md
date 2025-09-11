Na rota de inico, adicionar algumas imagens explicando como por exemplo:
"Ja acessou o nosso site?" -> assets/imagens1
Depois em baixo tem:
Beneficios:
"O apoio ao desenvolvedor" ->
Nessa parte, tem a imagem em cima e uma descricao abaixo explicando do que se trata e logo abaixo um botao

---

Faltou fazer o download ou compartilhar o curriculo. Ai na tela inicial, vai ter um novo botao de meus curriculos e deve salvar no banco de dados do supabase e criar um novo script sql com a estrutura completa da tabela.

---

Em inicio, na parte de Atividade recente, deve pegar os posts que o usuario do perfil postou recentemente. Deve adicionar tambem um botao de metricas onde mostra de forma completa e profissional qual foi o alcance de cada post, porcentagem de seguidores na semana, porcentagem de vagas aplicadas, relatorio semanal, etc ...

---

Com base no nivel do usuario, puxar apenas vagas relacionada com o perfil dele.

---

Deve mudar agora a versao do SDK de 53 para 54
 ERROR  Project is incompatible with this version of Expo Go

• The installed version of Expo Go is for SDK 54.0.0.
• The project you opened uses SDK 53.

How to fix this error:

Either upgrade this project to SDK 54.0.0, or launch it in an iOS simulator. It is not possible to install an older version of Expo Go for iOS devices, only the latest version is supported.

[Learn how to upgrade to SDK 54.](https://docs.expo.dev/workflow/upgrading-expo-sdk-walkthrough/)

[https://expo.dev/go?sdkVersion=53&platform=ios&device=false](Learn how to install Expo Go for SDK 53 in an iOS Simulator.

a versao se encontra em package.json e tem que ver se nao vai quebrar o codigo do app

---

LOG  SerpAPI Featured Response status: 200
ERROR  SerpAPI Featured Error: Google hasn't returned any results for this query.

----

Na parte de perfil do usuario, deve mudar a tebela para adicionar os campos:

Projetos
Educacao
Idiomas
Licenças e certificados
Competencias
Recomendações
Cursos
Organizacoes
Interesses (Pessoas famosas da area, Tecnologias Como Node, Empresas, Governos)
Experiencias
Servicos
Linkar com redes sociais
Linkar o curriculo no perfil
Descricao do Perfil (Igual ao Linkedin (E deve colocar as copetencias abaixo da descricao do perfil igual ao linkedin))
Redes sociais profissionais como Github, Linkedin, Indeed
Habilidades -> Deve puxar os icones de tecnologias que estao no diretorio: assets/tecnologias e deve colocar igual ao persona, ira aparecer as tecnologias e salvar no banco de dados do supabase

E deve organizar certinho a interface

---

Expandir/Ocupar todas a tela, na parte onde escolhe a foto de perfil. Pois, ele esta muito em baixo

---

Apos 21 horas, escrever "Continuar" para ele concluir a implementacao das configuracoes do App/Perfil

---

Utilizar a nova api de vagas (https://theirstack.com/en/job-lookup) em conjunto com a API de vagas de emprego do SerpiAPI

API:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlc3RldmFtc291emFsYXVyZXRoQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjoidXNlciIsImNyZWF0ZWRfYXQiOiIyMDI1LTA5LTExVDIxOjU4OjI1LjYzMDYxOCswMDowMCJ9.SKQDWXfibhyfsMmtlkHgTa8-nA4NNq4uu7dAZ-NWKgo

URL: curl --request POST \
--url "https://api.theirstack.com/v1/jobs/search" \
--header "Accept: application/json" \
--header "Content-Type: application/json" \
--header "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlc3RldmFtc291emFsYXVyZXRoQGdtYWlsLmNvbSIsInBlcm1pc3Npb25zIjoidXNlciIsImNyZWF0ZWRfYXQiOiIyMDI1LTA5LTExVDIxOjU4OjI1LjYzMDYxOCswMDowMCJ9.SKQDWXfibhyfsMmtlkHgTa8-nA4NNq4uu7dAZ-NWKgo" \
-d "{
  \"page\": 0,
  \"limit\": 10,
  \"posted_at_max_age_days\": 15,
  \"blur_company_data\": false,
  \"order_by\": [
    {
      \"desc\": true,
      \"field\": \"date_posted\"
    }
  ],
  \"job_country_code_or\": [
    \"BR\"
  ],
  \"include_total_results\": false
}"

Utilizando essa API, sera possivel buscar vagas no Linkedin, Indeed, Google
Esta tudo na documentacao: https://api.theirstack.com/