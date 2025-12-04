import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta =3000;
var listaTime = [];
var listaJogador = [];
//var usuarioLogado = false; // isso é errado

const server = express ();


//Preparar o servidor para processar dados vindo no corpo da requisicao

//aula 04 nos vamos estudar o uso de sessão e de cookies para o servidor e ao cliente
//capacidade de manter informações entre requisições e resposta
//nesta aula iremos implementar o uso de cookies: Informações sobre o ultimo acesso
//uso de sessão: login no sistema
// para manipular cookies será necessario instalar o modulo cookie-parser
//para gerenciar uma sessão, sera necessario instalar o modulo express-session

//preparar o servidor a fim de identificar se um determinado esta logado ou nao
//sera preciso criar sessões na aplicacão
server.use(session({
    secret:"Minh4Ch4v3S3cre3t4",
    resave: true, //Não vai salvar se nao mudar a sessão
    saveUninitialized: true, //não salvar sessão vazia
    cookie: {
        maxAge: 1000 * 60 * 30   //1000 ms = 1 segundo * 60 = 1 minuto * 15 = 15 minutos, sempre começa de ms para hora
    }

}))


server.use(express.urlencoded({extended: true}));
//qs se for true
//querystring se for false

//preparar o servidor a fim de processar os cookies
server.use(cookieParser());

server.get("/",verificarUsuarioLogado, (requisicao, resposta) =>{
//disponilizar o menu para o usuario
//verificar a existencia do cookie
    let ultimoAcesso = requisicao.cookies?.ultimoAcesso;

    /*if(usuarioLogado)
    {
        resposta.redirect("/cadastroFornecedor");
    }
    //criando o cookie que será devolvido para o cliente/usuario*/

    const data = new Date();
    resposta.cookie("ultimoAcesso", data.toLocaleString());
    resposta.setHeader("Content-Type", "text/html");
    resposta.write(`  
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Menu</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: "Segoe UI", sans-serif;
        }

        .navbar {
            background-color: #000;
            border-bottom: 2px solid #ffffff;
            box-shadow: 0 0 10px #ffffff33;
        }

        .navbar-brand, .nav-link {
            color: #ffffff;
            font-weight: 600;
        }

        .nav-link:hover {
            color: #fff;
            text-shadow: 0 0 8px #ffffffbb;
        }

        .dropdown-menu {
            background-color: #000;
            border: 1px solid #fff;
        }

        .dropdown-menu a {
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
            border: 2px solid #ffffff;
            background-color: #111111;
            text-shadow: 0 0 12px #ffffff55;
        }

        .bg-light {
            background-color: #111111;
            color: #ffffff;
            border: 2px solid #ffffff33;
        }

        input {
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #555;
        }

        input::placeholder {
            color: #bbbbbb;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #000000;
            border: none;
            font-weight: bold;
        }

        .btn-primary:hover {
            background-color: #e6e6e6;
            box-shadow: 0 0 10px #ffffffaa;
        }

        .btn-secondary {
            background-color: #222222;
            border: 1px solid #ffffff;
            color: #ffffff;
        }

        .btn-secondary:hover {
            background-color: #111111;
            box-shadow: 0 0 10px #ffffff88;
        }
</style>

</head>
<body>

    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Menu</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" href="/">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Cadastro</a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/cadastroEquipes">Cadastro Times</a></li>
                            <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                            <li><a class="dropdown-item" href="/listaTime">Listar Times</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="container-fluid mt-2">
            <p class="ms-3">Usuário logado: ${requisicao.session.dadosLogin?.nome} ultimo acesso: ${ultimoAcesso || "Primeiro Acesso"}</p>
        </div>
    </nav>
    <div class="container">
        <h1 class="text-center m-3 p-3">Menu Principal</h1>
        <div class="box-dark mt-4 col-md-6 mx-auto text-center">
            <h2 class="mb-3">Bem-vindo!</h2>
            <h3>Olá, ${requisicao.session.dadosLogin?.nome}</h3>
            <p class="fs-5 mt-3">
                Seja bem-vindo ao sistema! Use o menu acima para navegar entre as opções.
            </p>
            <div class="mt-4">
                <a href="/cadastroEquipes" class="btn btn-primary m-2">Cadastro Equipes</a>
                <a href="/cadastroJogadores" class="btn btn-primary m-2">Cadastro Jogador</a>
                <a href="/listaTime" class="btn btn-secondary m-2">Listar Times</a>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
        `);

        resposta.end();
});

server.get("/cadastroEquipes",verificarUsuarioLogado, (requisicao,resposta) =>{
        resposta.send(`
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastro Time - LoL Theme</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: "Segoe UI", sans-serif;
        }

        .navbar {
            background-color: #000;
            border-bottom: 2px solid #ffffff;
            box-shadow: 0 0 10px #ffffff33;
        }

        .navbar-brand, .nav-link {
            color: #ffffff;
            font-weight: 600;
        }

        .nav-link:hover {
            color: #fff;
            text-shadow: 0 0 8px #ffffffbb;
        }

        .dropdown-menu {
            background-color: #000;
            border: 1px solid #fff;
        }

        .dropdown-menu a {
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
            border: 2px solid #ffffff;
            background-color: #111111;
            text-shadow: 0 0 12px #ffffff55;
        }

        .bg-light {
            background-color: #111111;
            color: #ffffff;
            border: 2px solid #ffffff33;
        }

        input {
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #555;
        }

        input::placeholder {
            color: #bbbbbb;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #000000;
            border: none;
            font-weight: bold;
        }

        .btn-primary:hover {
            background-color: #e6e6e6;
            box-shadow: 0 0 10px #ffffffaa;
        }

        .btn-secondary {
            background-color: #222222;
            border: 1px solid #ffffff;
            color: #ffffff;
        }

        .btn-secondary:hover {
            background-color: #111111;
            box-shadow: 0 0 10px #ffffff88;
        }
</style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Campeonato LoL</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">

                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/cadastroEquipes">Cadastro de Times</a></li>
                            <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro de Jogadores</a></li>
                            <li><a class="dropdown-item" href="/listaTime">Listar Times</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <h1 class="text-center m-3 p-3">Cadastro de Time</h1>
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card-lol">
                    <form method="POST" action="/cadastroEquipes" class="row g-3">

                        <div class="col-md-12">
                            <label for="time" class="form-label">Time</label>
                            <input type="text" class="form-control" id="time" name="time" placeholder="Nome do Time">
                        </div>

                        <div class="col-md-12">
                            <label for="capitao" class="form-label">Capitão</label>
                            <input type="text" class="form-control" id="capitao" name="capitao" placeholder="Nome do Capitão">
                        </div>

                        <div class="col-md-12">
                            <label for="time" class="form-label">Whatsapp</label>
                            <input type="text" class="form-control" id="time" name="tel" maxlength="12" placeholder="Whatsapp">
                        </div>

                        <div class="col-12 mt-3">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                            <a class="btn btn-secondary" href="/">Voltar</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>


`);
});

server.post("/cadastroEquipes",verificarUsuarioLogado, (requisicao, resposta) =>{
const time = requisicao.body.time;
const capitao = requisicao.body.capitao;
const tel = requisicao.body.tel;


if (time && capitao && tel) {
    listaTime.push({ time, capitao, tel });
    resposta.redirect("/listaTime");
}
else {
    let conteudo = `
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastro Time - LoL Theme</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: "Segoe UI", sans-serif;
        }

        .navbar {
            background-color: #000;
            border-bottom: 2px solid #ffffff;
            box-shadow: 0 0 10px #ffffff33;
        }

        .navbar-brand, .nav-link {
            color: #ffffff;
            font-weight: 600;
        }

        .nav-link:hover {
            color: #fff;
            text-shadow: 0 0 8px #ffffffbb;
        }

        .dropdown-menu {
            background-color: #000;
            border: 1px solid #fff;
        }

        .dropdown-menu a {
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
            border: 2px solid #ffffff;
            background-color: #111111;
            text-shadow: 0 0 12px #ffffff55;
        }

        .bg-light {
            background-color: #111111;
            color: #ffffff;
            border: 2px solid #ffffff33;
        }

        input {
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #555;
        }

        input::placeholder {
            color: #bbbbbb;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #000000;
            border: none;
            font-weight: bold;
        }

        .btn-primary:hover {
            background-color: #e6e6e6;
            box-shadow: 0 0 10px #ffffffaa;
        }

        .btn-secondary {
            background-color: #222222;
            border: 1px solid #ffffff;
            color: #ffffff;
        }

        .btn-secondary:hover {
            background-color: #111111;
            box-shadow: 0 0 10px #ffffff88;
        }
</style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Campeonato LoL</a>

            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">

                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>

                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/cadastroEquipes">Cadastro de Times</a></li>
                            <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro de Jogadores</a></li>
                            <li><a class="dropdown-item" href="/listaTime">Listar Times</a></li>
                        </ul>
                    </li>

                    <li class="nav-item">
                        <a class="nav-link" href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <h1 class="text-center m-3 p-3">Cadastro de Time</h1>
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card-lol">
                    <form method="POST" action="/cadastroEquipes" class="row g-3">

                        <div class="col-md-12">
                            <label for="time" class="form-label">Time</label>
                            <input type="text" class="form-control" id="time" name="time" placeholder="Nome do Time" value="${time}">
                    `;
                    if (!time) {
                        conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o nome do time.</p>
                            </div>`;
                    }
            conteudo +=`</div>

                    <div class="col-md-12">
                        <label for="capitao" class="form-label">Capitao</label>
                        <input type="text" class="form-control" id="capitao" name="capitao" placeholder="Nome do capitao" value="${capitao}">
                    `;
                    if (!capitao) {
                        conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o nome do capitao.</p>
                            </div>`;
                    }
            conteudo +=`</div>
                    <div class="col-md-12">
                        <label for="tel" class="form-label">Whatsapp</label>
                        <input type="text" step="0.01" class="form-control" id="tel" name="tel" maxlength="12" placeholder="Whatsapp" value="${tel}">
                    `;
                    if (!tel) {
                        conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o Whatsapp.</p>
                            </div>`;
                    }
            conteudo +=`</div>
                          <div class="col-12 mt-3">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                            <a class="btn btn-secondary" href="/">Voltar</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
`;
        resposta.send(conteudo);
}
});

server.get("/cadastroJogadores",verificarUsuarioLogado, (requisicao,resposta) =>{
let revelatime = "";
for (let i = 0; i < listaTime.length; i++) {
    revelatime += `<option value="${listaTime[i].time}">${listaTime[i].time}</option>`;
}
    resposta.send(`
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastro Time - LoL Theme</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: "Segoe UI", sans-serif;
        }

        .navbar {
            background-color: #000;
            border-bottom: 2px solid #ffffff;
            box-shadow: 0 0 10px #ffffff33;
        }

        .navbar-brand, .nav-link {
            color: #ffffff;
            font-weight: 600;
        }

        .nav-link:hover {
            color: #fff;
            text-shadow: 0 0 8px #ffffffbb;
        }

        .dropdown-menu {
            background-color: #000;
            border: 1px solid #fff;
        }

        .dropdown-menu a {
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
            border: 2px solid #ffffff;
            background-color: #111111;
            text-shadow: 0 0 12px #ffffff55;
        }

        .bg-light {
            background-color: #111111;
            color: #ffffff;
            border: 2px solid #ffffff33;
        }

        input {
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #555;
        }

        input::placeholder {
            color: #bbbbbb;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #000000;
            border: none;
            font-weight: bold;
        }

        .btn-primary:hover {
            background-color: #e6e6e6;
            box-shadow: 0 0 10px #ffffffaa;
        }

        .btn-secondary {
            background-color: #222222;
            border: 1px solid #ffffff;
            color: #ffffff;
        }

        .btn-secondary:hover {
            background-color: #111111;
            box-shadow: 0 0 10px #ffffff88;
        }
</style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Campeonato LoL</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/cadastroEquipes">Cadastro de Times</a></li>
                            <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro de Jogadores</a></li>
                            <li><a class="dropdown-item" href="/listaTime">Listar Times</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <h1 class="text-center m-3 p-3">Cadastro de Time</h1>
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card-lol">
                    <form method="POST" action="/cadastroJogadores" class="row g-3">

                        <div class="col-md-12">
                            <label class="form-label" for="nomeJogador">Nome do Jogador</label>
                            <input type="text" class="form-control"id="nomeJogador" name="nomeJogador" placeholder="Nome do jogador">
                        </div>
                        
                        <div class="col-md-12">
                            <label for="nickname" class="form-label">Nickname in-game</label>
                            <input type="text" class="form-control" id="nickname" name="nickname" placeholder="Nome do Capitão">
                        </div>

                        <div class="col-md-12">
                        <label for="funcao" class="form-label">funcao</label>
                        <select class="form-control" name="funcao">
                            <option selected disabled>Selecione um time</option>
                            <option value="top">Top</option>
                            <option value="jungle">Jungle</option>
                            <option value="mid">Mid</option>
                            <option value="atirador">Atirador</option>
                            <option value="suporte">Suporte</option>
                        </select>
                        </div>

                        <div class="col-md-12">
                            <label for="elo" class="form-label">Elo</label>
                            <input type="text" class="form-control" id="elo" name="elo" placeholder="elo">
                        </div>

                        <div class="col-md-12">
                            <label for="genero" class="form-label">Genero</label>
                            <input type="text" class="form-control" id="genero" name="genero" placeholder="Genero">
                        </div>
                        <div class="col-md-12">
                            <label for ="timeSelecionado" class="form-label">Time</label>
                            <select class="form-control" id="time" name="time">
                                <option selected disabled>Selecione um time</option>
                                ${revelatime}
                            </select>
                        </div>
                        <div class="col-12 mt-3">
                            <button class="btn btn-primary" type="submit">Cadastrar</button>
                            <a class="btn btn-secondary" href="/">Voltar</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
`);
});

server.post("/cadastroJogadores",verificarUsuarioLogado, (requisicao, resposta) =>{
const nomeJogador = requisicao.body.nomeJogador;
const nickname = requisicao.body.nickname;
const funcao = requisicao.body.funcao;
const elo = requisicao.body.elo;
const genero = requisicao.body.genero;
const timeSelecionado = requisicao.body.time;

const JogadoresNoTime = listaJogador.filter(jogador => jogador.time === timeSelecionado);
const limiteAtingido = JogadoresNoTime.Length >=5;

if (nomeJogador && nickname && funcao && elo && genero && timeSelecionado && !limiteAtingido) {
    listaJogador.push({ nomeJogador, nickname, funcao, elo, genero, time: timeSelecionado});
    resposta.redirect("/listaTime");
}
else {
    let revelatime = "";
for (let i = 0; i < listaTime.length; i++) {
    const isSelected = timeSelecionado === lista[i].time ? 'selected' : '';
    revelatime += `<option value="${listaTime[i].time}">${listaTime[i].time}</option>`;
}
    let conteudo = `
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastro Time - LoL Theme</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: "Segoe UI", sans-serif;
        }

        .navbar {
            background-color: #000;
            border-bottom: 2px solid #ffffff;
            box-shadow: 0 0 10px #ffffff33;
        }

        .navbar-brand, .nav-link {
            color: #ffffff;
            font-weight: 600;
        }

        .nav-link:hover {
            color: #fff;
            text-shadow: 0 0 8px #ffffffbb;
        }

        .dropdown-menu {
            background-color: #000;
            border: 1px solid #fff;
        }

        .dropdown-menu a {
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
            border: 2px solid #ffffff;
            background-color: #111111;
            text-shadow: 0 0 12px #ffffff55;
        }

        .bg-light {
            background-color: #111111;
            color: #ffffff;
            border: 2px solid #ffffff33;
        }

        input {
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #555;
        }

        input::placeholder {
            color: #bbbbbb;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #000000;
            border: none;
            font-weight: bold;
        }

        .btn-primary:hover {
            background-color: #e6e6e6;
            box-shadow: 0 0 10px #ffffffaa;
        }

        .btn-secondary {
            background-color: #222222;
            border: 1px solid #ffffff;
            color: #ffffff;
        }

        .btn-secondary:hover {
            background-color: #111111;
            box-shadow: 0 0 10px #ffffff88;
        }
</style>
</head>

<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Campeonato LoL</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav me-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li><a class="dropdown-item" href="/cadastroEquipes">Cadastro de Times</a></li>
                            <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro de Jogadores</a></li>
                            <li><a class="dropdown-item" href="/listaTime">Listar Times</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <h1 class="text-center m-3 p-3">Cadastro de Time</h1>
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="card-lol">
                    <form method="POST" action="/cadastroJogadores" class="row g-3">
                        <div class="col-md-12">
                            <label class="form-label" for="nomeJogador">Nome do Jogador</label>
                            <input type="text" class="form-control"id="nomeJogador" name="nomeJogador" placeholder="Nome do jogador" value="${nomeJogador}">
                             `;
                              if (!nomeJogador) {
                             conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o nome do jogador.</p>
                            </div>`;
                            }
                            conteudo +=`</div>
                            <div class="col-md-12">
                                <label for="nickname" class="form-label">Nickname in-game</label>
                                <input type="text" class="form-control" id="nickname" name="nickname" placeholder="Nome do Capitão" value="${nickname}">
                             `;
                            if (!nickname) {
                            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o nickname do jogador.</p>
                            </div>`;
                            }
                            conteudo +=`</div>
                            <div class="col-md-12">
                            <label for ="funcao" class="form-label">Funcao</label>
                            <select class="form-control" name="funcao">
                                <option selected disabled>Selecione um time</option>
                                <option value="top">Top</option>
                                <option value="jungle">Jungle</option>
                                <option value="mid">Mid</option>
                                <option value="atirador">Atirador</option>
                                <option value="suporte">Suporte</option>
                             </select>`;
                              if (!funcao) {
                            conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe a funcao do jogador.</p>
                            </div>`;
                            }
                            conteudo +=`</div>
                            <div class="col-md-12">
                                <label for="elo" class="form-label">Elo</label>
                                <input type="text" class="form-control" id="elo" name="elo" placeholder="Elo" value="${elo}">
                             `;
                              if (!elo) {
                             conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o elo do jogador.</p>
                            </div>`;
                            }
                            conteudo +=`</div>
                            <div class="col-md-12">
                                <label for="genero" class="form-label">Genero</label>
                                <input type="text" class="form-control" id="genero" name="genero" placeholder="Genero" value="${genero}">
                             `;
                              if (!genero) {
                             conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o genero do jogador.</p>
                            </div>`;
                            }
                            conteudo +=`</div>
                            <div class="col-md-12">
                                <label for ="timeSelecionado" class="form-label">Time</label>
                                <select class="form-control" id="time" name="time">
                                    <option selected disabled>Selecione um time</option>
                                    ${revelatime}
                                </select>
                            `;
                            if(limteAtingido){
                                conteudo+=`
                                <div>
                                    <p class="text-danger"> o time ${timeSelecionado} ja esta cheio <p>
                                </div>`;
                            }
                              if (!timeSelecionado) {
                             conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o time do jogador.</p>
                            </div>`;
                            }
                            conteudo +=`</div>
                            <div class="col-12 mt-3">
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
`;
        resposta.send(conteudo);
}
});
server.get("/listaTime",verificarUsuarioLogado, (requisicao, resposta) => {
    let conteudo = `
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Times Cadastrados</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: "Segoe UI", sans-serif;
        }

        .navbar {
            background-color: #000;
            border-bottom: 2px solid #ffffff;
            box-shadow: 0 0 10px #ffffff33;
        }

        .navbar-brand, .nav-link {
            color: #ffffff;
            font-weight: 600;
        }

        .nav-link:hover {
            color: #fff;
            text-shadow: 0 0 8px #ffffffbb;
        }

        .dropdown-menu {
            background-color: #000;
            border: 1px solid #fff;
        }

        .dropdown-menu a {
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
            border: 2px solid #ffffff;
            background-color: #111111;
            text-shadow: 0 0 12px #ffffff55;
        }

        .bg-light {
            background-color: #111111;
            color: #ffffff;
            border: 2px solid #ffffff33;
        }

        input {
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #555;
        }

        input::placeholder {
            color: #bbbbbb;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #000000;
            border: none;
            font-weight: bold;
        }

        .btn-primary:hover {
            background-color: #e6e6e6;
            box-shadow: 0 0 10px #ffffffaa;
        }

        .btn-secondary {
            background-color: #222222;
            border: 1px solid #ffffff;
            color: #ffffff;
        }

        .btn-secondary:hover {
            background-color: #111111;
            box-shadow: 0 0 10px #ffffff88;
        }
</style>
</head>
<body>

<nav class="navbar navbar-expand-lg navbar-dark">
    <div class="container-fluid">
        <a class="navbar-brand" href="/">Menu</a>

        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
            data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href="/">Home</a>
                </li>
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">Cadastro</a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="/cadastroEquipes">Cadastro Times</a></li>
                        <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                        <li><a class="dropdown-item" href="/listaTime">Listar Times</a></li>
                    </ul>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/logout">Sair</a>
                </li>
            </ul>
        </div>
    </div>
</nav>

<div class="container mt-5">

    <h1 class="text-center m-3 p-3">Times Cadastrados</h1>

    <div class="table-responsive shadow-sm rounded-3">
        <table class="table table-dark table-hover align-middle text-center">
            <thead>
                <tr>
                    <th>Nome do Jogador</th>
                    <th>Capitão</th>
                    <th>Whatsapp</th>
                </tr>
            </thead>
            <tbody>`;
    for (let i = 0; i < listaTime.length; i++) {
        conteudo += `
            <tr>
                <td>${listaTime[i].time}</td>
                <td>${listaTime[i].capitao}</td>
                <td>${listaTime[i].tel}</td>
            </tr>`;
    }
    conteudo += `
            </tbody>
        </table>
    </div>
    <div class="table-responsive shadow-sm rounded-3">
        <table class="table table-dark table-hover align-middle text-center">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Capitao</th>
                    <th>Top</th>
                    <th>Jungle</th>
                    <th>Mid</th>
                    <th>Atirador</th>
                    <th>Suporte</th>
                </tr>
            </thead>
            <tbody>`;
        const funcoes = ['top', 'jungle', 'mid', 'atirador', 'suporte'];
        for (let time of listaTime){
        let jogadoresDoTime = listaJogador.filter(j => j.time === time.time);
        let celulasJogadores = "";

         for(let funcao of funcoes){
            const jogador = jogadoresDoTime.find(j => (j.funcao || "").toLowerCase() === funcao);

            if(jogador){
                celulasJogadores += `<td>${jogador.nickname}</td>`;
            } else{
                celulasJogadores +=`<td>Vaga</td>`;
            }
         }
         conteudo+=`
        <tr>
            <td>${time.time}</td>
            <td>${time.capitao}</td>
            ${celulasJogadores}
        </tr>`
        }
    conteudo += `
            </tbody>
        </table>
    </div>
    <a class="btn btn-secondary mt-3" href="/">Voltar</a>

</div>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
    `;

    resposta.send(conteudo);
});

server.get("/logout", (requisicao,resposta) =>{ 
    requisicao.session.destroy();
    resposta.send(`
        <!doctype html>
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Logout</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
<style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: "Segoe UI", sans-serif;
        }

        .navbar {
            background-color: #000;
            border-bottom: 2px solid #ffffff;
            box-shadow: 0 0 10px #ffffff33;
        }

        .navbar-brand, .nav-link {
            color: #ffffff;
            font-weight: 600;
        }

        .nav-link:hover {
            color: #fff;
            text-shadow: 0 0 8px #ffffffbb;
        }

        .dropdown-menu {
            background-color: #000;
            border: 1px solid #fff;
        }

        .dropdown-menu a {
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
            border: 2px solid #ffffff;
            background-color: #111111;
            text-shadow: 0 0 12px #ffffff55;
        }

        .bg-light {
            background-color: #111111;
            color: #ffffff;
            border: 2px solid #ffffff33;
        }

        input {
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #555;
        }

        input::placeholder {
            color: #bbbbbb;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #000000;
            border: none;
            font-weight: bold;
        }

        .btn-primary:hover {
            background-color: #e6e6e6;
            box-shadow: 0 0 10px #ffffffaa;
        }

        .btn-secondary {
            background-color: #222222;
            border: 1px solid #ffffff;
            color: #ffffff;
        }

        .btn-secondary:hover {
            background-color: #111111;
            box-shadow: 0 0 10px #ffffff88;
        }
</style>
</head>
<body>
    <div class="container">
        <h1 class="text-center border m-3 p-3 bg-dark-card">Logout</h1>
        <div class="row justify-content-center">
            <div class="col-12 col-md-8 col-lg-6">
                <div class="m-3 p-3 bg-dark-card rounded shadow-sm">
                    <div class="col-md-12 text-center">
                        <p class="fs-5">Obrigado pela visita! Você foi desconectado.</p>
                        <a href="/login" class="btn btn-danger m-2">Fazer Login Novamente</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>
`);
});

    server.get("/login",(requisicao, resposta)=>{
        resposta.send(`
  <!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Menu</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
<style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: "Segoe UI", sans-serif;
        }

        .navbar {
            background-color: #000;
            border-bottom: 2px solid #ffffff;
            box-shadow: 0 0 10px #ffffff33;
        }

        .navbar-brand, .nav-link {
            color: #ffffff;
            font-weight: 600;
        }

        .nav-link:hover {
            color: #fff;
            text-shadow: 0 0 8px #ffffffbb;
        }

        .dropdown-menu {
            background-color: #000;
            border: 1px solid #fff;
        }

        .dropdown-menu a {
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
            border: 2px solid #ffffff;
            background-color: #111111;
            text-shadow: 0 0 12px #ffffff55;
        }

        .bg-light {
            background-color: #111111;
            color: #ffffff;
            border: 2px solid #ffffff33;
        }

        input {
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #555;
        }

        input::placeholder {
            color: #bbbbbb;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #000000;
            border: none;
            font-weight: bold;
        }

        .btn-primary:hover {
            background-color: #e6e6e6;
            box-shadow: 0 0 10px #ffffffaa;
        }

        .btn-secondary {
            background-color: #222222;
            border: 1px solid #ffffff;
            color: #ffffff;
        }

        .btn-secondary:hover {
            background-color: #111111;
            box-shadow: 0 0 10px #ffffff88;
        }
</style>
</head>

    <body>
        <nav class="navbar navbar-expand-lg navbar-dark">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">Menu</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#navbarSupportedContent">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link" href="/">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                Cadastro
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastroEquipes">Cadastro Times</a></li>
                                <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                                <li><a class="dropdown-item" href="/listaTime">Listar Times</a></li>
                            </ul>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="/logout">Sair</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

        <div class="container">
            <h1 class="text-center m-3 p-3">Login</h1>
            <form method="POST" action="/login" class="form-box m-3 p-4 col-md-6 mx-auto">
                <div class="mb-3">
                    <label for="usuario" class="form-label">Usuário</label>
                    <input type="text" class="form-control" id="usuario" name="usuario" placeholder="Digite seu usuário">
                </div>

                <div class="mb-3">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senha" name="senha" placeholder="Digite sua senha">
                </div>

                <div class="text-center">
                    <button type="submit" class="btn btn-primary">Entrar</button>
                    <a href="/" class="btn btn-secondary">Voltar</a>
                </div>
            </form>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>
         `)
    });

    server.post("/login",(requisicao,resposta) => {
    const usuario = requisicao.body.usuario;
    const senha = requisicao.body.senha;
    if(usuario === "admin" && senha === "admin"){
        requisicao.session.dadosLogin={nome: "Administrador", logado: true};
        resposta.redirect("/");
    }
    else
    {let login =`
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Menu</title>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">

<style>
        body {
            background-color: #000000;
            color: #ffffff;
            font-family: "Segoe UI", sans-serif;
        }

        .navbar {
            background-color: #000;
            border-bottom: 2px solid #ffffff;
            box-shadow: 0 0 10px #ffffff33;
        }

        .navbar-brand, .nav-link {
            color: #ffffff;
            font-weight: 600;
        }

        .nav-link:hover {
            color: #fff;
            text-shadow: 0 0 8px #ffffffbb;
        }

        .dropdown-menu {
            background-color: #000;
            border: 1px solid #fff;
        }

        .dropdown-menu a {
            color: #ffffff;
        }

        h1 {
            color: #ffffff;
            border: 2px solid #ffffff;
            background-color: #111111;
            text-shadow: 0 0 12px #ffffff55;
        }

        .bg-light {
            background-color: #111111;
            color: #ffffff;
            border: 2px solid #ffffff33;
        }

        input {
            background-color: #1a1a1a;
            color: #ffffff;
            border: 1px solid #555;
        }

        input::placeholder {
            color: #bbbbbb;
        }

        .btn-primary {
            background-color: #ffffff;
            color: #000000;
            border: none;
            font-weight: bold;
        }

        .btn-primary:hover {
            background-color: #e6e6e6;
            box-shadow: 0 0 10px #ffffffaa;
        }

        .btn-secondary {
            background-color: #222222;
            border: 1px solid #ffffff;
            color: #ffffff;
        }

        .btn-secondary:hover {
            background-color: #111111;
            box-shadow: 0 0 10px #ffffff88;
        }
</style>
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Menu</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent">
                    <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link" href="/">Home</a>
                    </li>

                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                                Cadastro
                            </a>

                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="/cadastroEquipes">Cadastro Times</a></li>
                                <li><a class="dropdown-item" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                                <li><a class="dropdown-item" href="/listaTime">Listar Times</a></li>
                            </ul>
                        </li>

                        <li class="nav-item">
                            <a class="nav-link" href="/logout">Sair</a>
                        </li>

                    </ul>
                </div>
            </div>
        </nav>
        <div class="container">
            <h1 class="text-center m-3 p-3">Login</h1>
            <form method="POST" action="/login" class="form-box m-3 p-4 col-md-6 mx-auto">
                <div class="mb-3">
                    <label for="usuario" class="form-label">Usuário</label>
                    <input type="text" class="form-control" id="usuario" name="usuario" placeholder="Digite seu usuário">
                </div>

                <div class="mb-3">
                    <label for="senha" class="form-label">Senha</label>
                    <input type="password" class="form-control" id="senha" name="senha" placeholder="Digite sua senha">
                </div>
                <div class="col-12 mt-2">
                    <p class="text-danger">Usuario ou senha Invalido</p>
                </div>
                <div class="text-center">
                    <button type="submit" class="btn btn-primary">Entrar</button>
                    <a href="/" class="btn btn-secondary">Voltar</a>
                </div>
        </form>
    </div>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>

</body>
</html>`;
        resposta.send(login);
}
    });

    //funcao para verficiar se o usuario esta logado (middleware)
    function verificarUsuarioLogado(requisicao,resposta,proximo){
        if(requisicao.session.dadosLogin?.logado){
            proximo();
        }else{
            resposta.redirect("/login");
        }
    }
server.listen(porta, host, ()=>{
    console.log (`servidor rodando em http://${host}:${porta}`)
});
