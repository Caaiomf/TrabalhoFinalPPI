import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";

const host = "0.0.0.0";
const porta =3000;
var listaTimes = [];

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

server.get("/", verificarUsuarioLogado, (requisicao, resposta) =>{
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
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>
        <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">Menu</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li class="nav-item"><a class="nav-link active" href="/cadastroTime">Cadastro Times</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/listaTime">Listar Times</a></li>
                        </ul>
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="/" href="/logout">Sair</a>
                        </li>
                    </ul>
                    </div>
                </div>
                <div class ="container-fluid">
                    <div class="dflex">
                        <div class ="p-2">
                            <p> Usuário logado: ${requisicao.session.dadosLogin?.nome}</p>
                        </div> 
                    </div>
                </div>
                </nav>
                <div class="container">
                <h1 class="text-center border m-3 p-3 bg-light">Login</h1>

                <form method="POST" action="/" class="m-3 p-4 bg-light rounded shadow-sm col-md-6 mx-auto">
                    <div class="m-3 p-4 bg-light rounded shadow-sm col-md-6 mx-auto text-center">
                        <h2 class="mb-4">Bem-vindo!</h2>
                        <h3>Ola, ${requisicao.session.dadosLogin?.nome}</h3>
                        <p class="fs-5">
                            Seja bem-vindo ao sistema! Use o menu acima para navegar entre as opções.
                        </p>

                        <div class="mt-4">
                            <a href="/cadastroEquipes" class="btn btn-primary m-2">Cadastro Equipes</a>
                            <a href="/cadastroJogadores" class="btn btn-primary m-2">Cadastro Jogador</a>
                            <a href="/listaTime" class="btn btn-secondary m-2">Listar Times</a>
                        </div>
                    </div>
                </form>
            </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
            </body>
            </html>
        `);

        resposta.end();
});

server.get("/cadastroEquipes", (requisicao,resposta) =>{
        resposta.send(`
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastro Produto</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
</head>
<body>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Menu</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li class="nav-item"><a class="nav-link active" href="/cadastroTime">Cadastro Times</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/listaTime">Listar Times</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="/" href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <h1 class="text-center border m-3 p-3 bg-light"Cadastro de Time</h1>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-6">
                    <form method="POST" action="/cadastroEquipes" class="row g-3 needs-validation m-3 p-3 bg-light">
                        <div class="input-group has-validation">

                        <div class="col-md-10">
                            <label for="time" class="form-label">Time</label>
                            <input type="text" class="form-control" id="time" name="time" placeholder="Nome do Time">
                        </div>

                        <div class="col-md-10">
                            <label for="capitao" class="form-label">Capitao</label>
                            <input type="text" class="form-control" id="capitao" name="capitao" placeholder="Nome do capitao">
                        </div>

                        <div class="col-md-10">
                            <label for="tel" class="form-label">Whatsapp</label>
                            <input type="text" step="0.01" class="form-control" id="tel" name="tel" maxlength="15" placeholder="Whatsapp">
                        </div>
                        <div class="col-12">
                            <div class="col-12">
                                <br>
                                <button class="btn btn-primary" type="submit">Cadastrar</button>
                                <a class="btn btn-secondary" href="/">Voltar</a>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>

`);
});

server.post("/cadastroEquipes", (requisicao, resposta) =>{
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
        <title>Cadastro de Produto</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
    <div class="container">
        <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Time</h1>
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-12 col-md-8 col-lg-6">
                    <form method="POST" action="/cadastroEquipes" class="row g-3 needs-validation m-3 p-3 bg-light">

                    <div class="col-md-10">
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

                    <div class="col-md-10">
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
                    <div class="col-md-10">
                        <label for="tel" class="form-label">Whatsapp</label>
                        <input type="text" step="0.01" class="form-control" id="tel" name="tel" maxlength="15" placeholder="Whatsapp" value="${tel}">
                    `;
                    if (!tel) {
                        conteudo += `
                            <div>
                                <p class="text-danger">Por favor, informe o Whatsapp.</p>
                            </div>`;
                    }
            conteudo +=`</div>
                    <div class="col-12">
                        <div class="col-12">
                            <br>
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

server.get("/cadastroJogadores", verificarUsuarioLogado, (requisicao,resposta) =>{
        resposta.send(`
<!doctype html>
<html lang="pt-br">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Cadastro Produto</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
</head>
<body>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
        <div class="container-fluid">
            <a class="navbar-brand" href="/">Menu</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                    </li>
                    <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li class="nav-item"><a class="nav-link active" href="/cadastroTime">Cadastro Times</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/listaTime">Listar Times</a></li>
                        </ul>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link active" aria-current="/" href="/logout">Sair</a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <div class="container">
        <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Produto</h1>

        <form method="POST" action="/cadastroJogadores" class="row g-3 needs-validation m-3 p-3 bg-light">

            <div class="col-md-4">
                <label for="codigoBarras" class="form-label">Código de Barras</label>
                <input type="text" class="form-control" id="codigoBarras" name="codigoBarras">
            </div>

            <div class="col-md-8">
                <label for="descricao" class="form-label">Descrição do Produto</label>
                <input type="text" class="form-control" id="descricao" name="descricao" ">
            </div>

            <div class="col-md-4">
                <label for="precoCusto" class="form-label">Preço de Custo</label>
                <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto">
            </div>

            <div class="col-md-4">
                <label for="precoVenda" class="form-label">Preço de Venda</label>
                <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda">
            </div>

            <div class="col-md-4">
                <label for="validade" class="form-label">Data de Validade</label>
                <input type="date" class="form-control" id="validade" name="validade">
            </div>

            <div class="col-md-4">
                <label for="estoque" class="form-label">Quantidade em Estoque</label>
                <input type="number" class="form-control" id="estoque" name="estoque">
            </div>

            <div class="col-md-8">
                <label for="fabricante" class="form-label">Nome do Fabricante</label>
                <input type="text" class="form-control" id="fabricante" name="fabricante">
            </div>

            <div class="col-12">
                <br>
                <button class="btn btn-primary" type="submit">Cadastrar</button>
                <a class="btn btn-secondary" href="/">Voltar</a>
            </div>

        </form>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
</body>
</html>

`);
});

server.post("/cadastroJogadores", verificarUsuarioLogado, (requisicao, resposta) =>{
const codigoBarras = requisicao.body.codigoBarras;
const descricao = requisicao.body.descricao;
const precoCusto = requisicao.body.precoCusto;
const precoVenda = requisicao.body.precoVenda;
const validade = requisicao.body.validade;
const estoque = requisicao.body.estoque;
const fabricante = requisicao.body.fabricante;

if (codigoBarras && descricao && precoCusto && precoVenda && validade && estoque && fabricante) {
    listaTime.push({ codigoBarras, descricao, precoCusto, precoVenda, validade, estoque, fabricante });
    resposta.redirect("/listaTime");
}
else {
    let conteudo = `
    <!doctype html>
    <html lang="pt-br">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Cadastro de Produto</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
        <div class="container">
            <h1 class="text-center border m-3 p-3 bg-light">Cadastro de Produto</h1>

            <form method="POST" action="/cadastroJogadores" class="row g-3 needs-validation m-3 p-3 bg-light">

                <div class="col-md-4">
                    <label for="codigoBarras" class="form-label">Código de Barras</label>
                    <input type="text" class="form-control" id="codigoBarras" name="codigoBarras" value="${codigoBarras}">
    `;
    if (!codigoBarras) {
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o código de barras.</p>
            </div>`;
    }
    conteudo += `</div>

                <div class="col-md-8">
                    <label for="descricao" class="form-label">Descrição do Produto</label>
                    <input type="text" class="form-control" id="descricao" name="descricao" value="${descricao}">
    `;
    if (!descricao) {
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe a descrição do produto.</p>
            </div>`;
    }
    conteudo += `</div>

                <div class="col-md-4">
                    <label for="precoCusto" class="form-label">Preço de Custo</label>
                    <input type="number" step="0.01" class="form-control" id="precoCusto" name="precoCusto" value="${precoCusto}">
    `;
    if (!precoCusto) {
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o preço de custo.</p>
            </div>`;
    }
    conteudo += `</div>

                <div class="col-md-4">
                    <label for="precoVenda" class="form-label">Preço de Venda</label>
                    <input type="number" step="0.01" class="form-control" id="precoVenda" name="precoVenda" value="${precoVenda}">
    `;
    if (!precoVenda) {
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o preço de venda.</p>
            </div>`;
    }
    conteudo += `</div>

                <div class="col-md-4">
                    <label for="validade" class="form-label">Data de Validade</label>
                    <input type="date" class="form-control" id="validade" name="validade" value="${validade}">
    `;
    if (!validade) {
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe a data de validade.</p>
            </div>`;
    }
    conteudo += `</div>

                <div class="col-md-4">
                    <label for="estoque" class="form-label">Quantidade em Estoque</label>
                    <input type="number" class="form-control" id="estoque" name="estoque" value="${estoque}">
    `;
    if (!estoque) {
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe a quantidade em estoque.</p>
            </div>`;
    }
    conteudo += `</div>

                <div class="col-md-8">
                    <label for="fabricante" class="form-label">Fabricante</label>
                    <input type="text" class="form-control" id="fabricante" name="fabricante" value="${fabricante}">
    `;
    if (!fabricante) {
        conteudo += `
            <div>
                <p class="text-danger">Por favor, informe o fabricante.</p>
            </div>`;
    }

    conteudo += `
                </div>

                <div class="col-12">
                    <br>
                    <button class="btn btn-primary" type="submit">Cadastrar</button>
                    <a class="btn btn-secondary" href="/">Voltar</a>
                </div>

            </form>
        </div>

        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
    </body>
    </html>
`;
        resposta.send(conteudo);
}
});
server.get("/listaTime", verificarUsuarioLogado, (requisicao, resposta) => {
    let conteudo = `
        <!doctype html>
        <html lang="pt-br">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Lista de Produtos do Sistema</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet">
        </head>
        <body>

            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">Menu</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" 
                        data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" 
                        aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav me-auto mb-2 mb-lg-0">

                            <li class="nav-item">
                                <a class="nav-link active" aria-current="page" href="/">Home</a>
                            </li>

                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" role="button" 
                                    data-bs-toggle="dropdown" aria-expanded="false">
                                    Cadastro
                                </a>
                                <ul class="dropdown-menu">
                                    <li class="nav-item"><a class="nav-link active" href="/cadastroTime">Cadastro Times</a></li>
                                    <li class="nav-item"><a class="nav-link active" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                                    <li class="nav-item"><a class="nav-link active" href="/listaTime">Listar Times</a></li>
                                </ul>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link active" href="/logout">Sair</a>
                            </li>

                        </ul>
                    </div>
                </div>
            </nav>

            <div class="container mt-5">
                <h2 class="text-center mb-4">Lista de Produtos Cadastrados</h2>

                <div class="table-responsive shadow-sm rounded-3">
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-primary text-center">
                            <tr>
                                <th>Código de Barras</th>
                                <th>Descrição</th>
                                <th>Preço de Custo</th>
                                <th>Preço de Venda</th>
                                <th>Validade</th>
                                <th>Estoque</th>
                                <th>Fabricante</th>
                            </tr>
                        </thead>
                        <tbody id="tabela-produtos">`;

        for (let i = 0; i < listaTime.length; i++) {
            conteudo += `
                <tr>
                    <td>${listaTime[i].codigoBarras}</td>
                    <td>${listaTime[i].descricao}</td>
                    <td>R$ ${parseFloat(listaTime[i].precoCusto).toFixed(2)}</td>
                    <td>R$ ${parseFloat(listaTime[i].precoVenda).toFixed(2)}</td>
                    <td>${listaTime[i].validade}</td>
                    <td>${listaTime[i].estoque}</td>
                    <td>${listaTime[i].fabricante}</td>
                </tr>
            `;
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
        </head>
        <body>
            <div class="container">
                <h1 class="text-center border m-3 p-3 bg-light">Logout</h1>

                <div class="row justify-content-center m-3 p-3 bg-light rounded shadow-sm">
                    <div class="col-md-8 text-center">
                        <p class="fs-5">Obrigado pela visita</p>
                            <a href="/login" class="btn btn-danger m-2">Voltar</a>
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
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>
        <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">Menu</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li class="nav-item"><a class="nav-link active" href="/cadastroTime">Cadastro Times</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/listaTime">Listar Times</a></li>
                        </ul>
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="/" href="/logout">Sair</a>
                        </li>
                    </ul>
                    </div>
                </div>
                </nav>
                <div class="container">
                <h1 class="text-center border m-3 p-3 bg-light">Login</h1>

                <form method="POST" action="/login" class="m-3 p-4 bg-light rounded shadow-sm col-md-6 mx-auto">
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
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
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
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossorigin="anonymous">
        </head>
        <body>
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid">
                    <a class="navbar-brand" href="/">Menu</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="page" href="/">Home</a>
                        </li>
                        <li class="nav-item dropdown">
                        <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                            Cadastro
                        </a>
                        <ul class="dropdown-menu">
                            <li class="nav-item"><a class="nav-link active" href="/cadastroTime">Cadastro Times</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/cadastroJogadores">Cadastro Jogadores</a></li>
                            <li class="nav-item"><a class="nav-link active" href="/listaTime">Listar Times</a></li>
                        </ul>
                        <li class="nav-item">
                        <a class="nav-link active" aria-current="/" href="/logout">Sair</a>
                        </li>
                    </ul>
                    </div>
                </div>
                </nav>
                <div class="container">
                <h1 class="text-center border m-3 p-3 bg-light">Login</h1>

                <form method="POST" action="/login" class="m-3 p-4 bg-light rounded shadow-sm col-md-6 mx-auto">
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
                
                <div class="col-12 mt-2">
                    <p class="text-danger">Usuario ou senha Invalido</p>
                </div>
                </form>
            </div>
                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI" crossorigin="anonymous"></script>
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
