const fs = require("fs");
const {parse} = require("querystring");

const db = require("./db");

var url = require('url');
var path = require('path');
const { allowedNodeEnvironmentFlags } = require("process");
const { Console } = require("console");
// Professor a cada cadastro que for feito tem q dar f5 
//recaregar tentei arrumar mas só pioro e enviei atrasado por causa disso e outros bugs

var loadData = (response) => {
    let list = [];
     global.connection.collection("elementos").find({}).toArray((err, docs) => {
        if (err) {
            console.log("Deu merda!");
            return;
        }
        console.log(docs);

        docs.forEach(element => {
            list.push(element);  
        });
        response.end(readFile("index.html").replace("@$listindex@", creatlista(list)));
        //response.end(readFile("index.html").replace("@$list@", list.length).replace("@$listindex@" , creatlista(list)))
    });
}

var loadDatadois = (response) => {
    let list = [];
     global.connection.collection("compra").find({}).toArray((err, docs) => {
        if (err) {
            console.log("Deu merda!");
            return;
        }
        console.log(docs);

        docs.forEach(element => {
            list.push(element);  
        });
        response.end(readFile("compra.html").replace("@$listcompra@", creatlistcompra(list))
        .replace("@$listindex@", creatlista(list))
        .replace("@$listsaldo@" , verificaSaldo(list)));
        //response.end(readFile("index.html").replace("@$list@", list.length).replace("@$listindex@" , creatlista(list)))
    });
}

var loadDatavenda = (response) => {
    let list = [];
     global.connection.collection("venda").find({}).toArray((err, docs) => { // nome dá coletion venda
        if (err) {
            console.log("Deu merda!");
            return;
        }
        console.log(docs);

        docs.forEach(element => {
            list.push(element);  
        });
        response.end(readFile("vender.html").replace("@$listvenda@", creatlistVenda(list)));
        //response.end(readFile("index.html").replace("@$list@", list.length).replace("@$listindex@" , creatlista(list)))
    });
}

var loadDatasaldo = (response) => {
    let list = [];
     global.connection.collection("saldo").find({}).toArray((err, docs) => { // nome dá coletion venda
        if (err) {
            console.log("Deu merda!");
            return;
        }
        console.log(docs);

        docs.forEach(element => {
            list.push(element);  
        });
        response.end(readFile("compra.html").replace("@$listsaldo@", verificaSaldo(list)));
        //response.end(readFile("index.html").replace("@$list@", list.length).replace("@$listindex@" , creatlista(list)))
    });
}


var loadDatadividendos = (response) => {
    let list = [];
     global.connection.collection("dividendos").find({}).toArray((err, docs) => { // nome dá coletion venda
        if (err) {
            console.log("Deu merda!");
            return;
        }
        console.log(docs);

        docs.forEach(element => {
            list.push(element);  
        });
        response.end(readFile("dividendos.html").replace("@$listdividendos@", creatlistdividendos(list)));
        //response.end(readFile("index.html").replace("@$list@", list.length).replace("@$listindex@" , creatlista(list)))
    });
}

var list = [] , list2 = [];



var readFile = (file) => {
    let html = fs.readFileSync(__dirname + "/views/html/"+ file, "utf8");
    return html;
};

var collectData = (rq, cal) => {
    var data = '';
    rq.on('data', (chunk) => {
        data += chunk;
    });
    rq.on ('end', () => {
        let new_element = parse(data);
        cal(parse(data));
    });
}
var creatlista = (list) =>{
    let listaGerada = '';

    let layot =  `<tr>
    <td>{$Codigo de Indentificação}</td>
      <td>{$Setor de atuação}</td>
      <td>{$Valor da Acao}</td>
      <td>{$Quantidade de ações}</td>
      <td>{$Fracionária?}</td>
      <td>{$Tipo da ação}</td>
  </tr>`;

list.forEach(element => {
   
    listaGerada += layot.replace("{$Codigo de Indentificação}", element.cod)
                                .replace("{$Setor de atuação}" , element.atuacao)
                                .replace("{$Valor da Acao}" , element.valor)
                                .replace("{$Quantidade de ações}" , element.quant)
                                .replace("{$Fracionária?}" , element.sim?"Sim": "Não")
                                .replace("{$Tipo da ação}" , element.preferencial?"preferencial" : "Ordinária")
});
//if("{$Codigo de Indentificação}" === "" && "{$Codigo de Indentificação}" === "{$undefined}")
//layot = deleteRow;

return listaGerada;
}
var creatlistcompra  = (list) => {
    let listCompra = '';
    let codacao = "";
    let valor = 0;
    let saldo = "";
    let layot2 = `<tr>
    <td>{$Data}</td>
    <td>{$Valor}</td>
    <td>{$quantidade}</td>
    <td>{$Codigo da Compra}</td>
    <td>{$valor total das acaos}</td/>
    <td>{$Açãos Cadastradas}</td>
    <td>{$Vendidos}</td>
  </tr>`;

 
  let calc = 0 ;
 
  // parseInt(valor , 10);
 
  //let valor  = "0";
  list.forEach(element => {
      let acaosCompradas  = 0;
     // var valor = document.getElementById("valorcompra").values;
     
    //(valor) =  (valor) + parceint(valordecompra);
    let data = new Date();
    listCompra += layot2.replace("{$Data}",  "Dia" + data.getDate() + " Mes"+ data.getMonth() + " Ano" + data.getFullYear())
    .replace("{$Valor}" ,  element.valordecompra)
    .replace("{$quantidade}" , element.quant)
    .replace("{$Açãos Cadastradas}" , element.cod)
    .replace("{$Codigo da Compra}" , element.codcompra)
    .replace("{$valor total das acaos}" ,parseInt(valor) === parseInt(valor) + parseInt(element.valordecompra))
    .replace("{$Vendidos}", element.codacao ? element.codacao : " Sem Vendas Informado")
    

    let valorcomp = "";
    let linha = "";
     calc = valor = valor + parseInt(element.valordecompra)
    valorcomp = element.valordecompra
    codacao = element.codcompra;
    dataCompra = element.data;
    // se for chei o campo ele deleta o campo informado
  });


  return listCompra;
}
//parseInt("valorcomp" , 10);
var verificaSaldo   = (list , valorcomp) => {
    let saldo = "";
    let valor = 0;
    let calc = 0;
    let valocomp2 = "";

    let layot4 = `<tr>
    <td>{$Valor Total de Acaos Comprada}</td>
  </tr>`;
  //saldo += tabela.replace("{$acaos compradas}" , valorcomp);
 // var input = document. querySelector("#valordecompra");
 list.forEach(element => {
     valocomp2 = element.valordecompra;
     //parseInt(valorcomp2);
      //valocomp2 = parseInt("element.valordecompra") || 0 ;
      valocomp2 = Number("element.valordecompra")
      //valocomp2 = Math.ceil("element.valordecompra")
     // document.getElementById("myTable").deleteRow(0);
      valocomp2.valueOf();
      parseInt(valor);
      calc = (valor) = (valor) + valocomp2;
 })
 saldo += layot4.replace("{$Valor Total de Acaos Comprada}" , " Total " + valocomp2 + valor)
      //.replace("{$Funcionario?}" , element.sim?"sim": "nao")
  
  //parseInt(element.valordecompra);
     
    
  return saldo;
}
//let valor = " ";
//list.forEach(element =>{
  //  (valor = element.valordecompra  +  element.valordecompra)
//}

var creatlistVenda   = (list , codacao , dataCompra) => {
    let listVenda = "";

    let leyatVenda = ` <tr>
    <td>{$Codigo dá Acao}</td>
  
  </tr>`;
  let layot2 = `<tr>
  <td>{$Data}</td>
  <td>{$Valor}</td>
  <td>{$quantidade}</td>
  <td>{$Codigo da Acao}</td> 
    
</tr>`;
list.forEach(element =>{
    listVenda += leyatVenda.replace("{$Codigo dá Acao}", element.codacao)
   // if(element.codcompra == codacao)
    //deleteRow(layot2);
});
return listVenda;
}
  var creatlistdividendos  = (list) => {
    let listDividendos = '';

    let layotdividendos = `<tr>
    <td>{$Acao Referida}</td>
      <td>{$Data dá Compra}</td>
      <td>{$Data do Pagamento}</td>
      <td>{$Valor a ser Pago por Cota}</td>
  </tr>`;
  list.forEach(element => {
    listDividendos += layotdividendos.replace("{$Acao Referida}", element.aco_referida)
    .replace("{$Data dá Compra}" , element.data_compra)
    .replace("{$Data do Pagamento}" , element.data_pagamento)
    .replace("{$Valor a ser Pago por Cota}" , element.valor_da_cota)
  });

  return listDividendos;
}



module.exports = (request, response) => {
    if (request.method === 'GET') {
        
        let url_parsed = url.parse(request.url, true);
        switch (url_parsed.pathname) {
            case '/':
                response.writeHead(200, {'Content-Type': 'text/html'});
                loadData(response);
                break;
            case '/element':
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end("Elemento: " +url_parsed.query.id + " acessado!");
                break;
                case '/compra':
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    loadDatadois(response);
                   loadDatasaldo(response);
                    break;
                    case '/vender':
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    loadDatavenda(response);                         
                break;
                case '/compra':
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    loadDatadois(response);
                    loadDatasaldo(response);
                    break;
                    case '/dividendos':
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    loadDatadividendos(response);                         
                break;
            default:
                break;
        }
      } else if (request.method === 'POST') {

        switch (request.url.trim()) {
            case '/salva':
               
                response.writeHead(200, {'Content-Type': 'text/html'});
                collectData(request, (data) => {
                    console.log(data);
                    global.connection.collection("elementos").insertOne(data);
                    console.log("data");
                  
                })
                break;

                case '/salvacompra':
               
                    response.writeHead(200, {'Content-Type': 'text/html'});
                    collectData(request, (data) => {
                        console.log(data);
                        //console.log(calc);
                        global.connection.collection("compra").insertOne(data);
                       // global.connection.collection("elementos").insertOne(element.cod);
                        //global.connection.collection("saldo").insertOne(data);
                        //console(valocomp2);
                        console.log("data");
                        
                    })
                    break;

                case '/salvavenda':
               
                        response.writeHead(200, {'Content-Type': 'text/html'});
                        collectData(request, (data) => {
                            console.log(data);
                            global.connection.collection("venda").insertOne(data);
                            console.log("data");
                        })
                        break;
                        case '/salvadividendos':
               
                            response.writeHead(200, {'Content-Type': 'text/html'});
                            collectData(request, (data) => {
                                console.log(data);
                                global.connection.collection("dividendos").insertOne(data);
                                console.log("data");
                            })
                           
                        break;
                //response.end(readFile("compra.html").replace("@$list@", list.length)
                //.replace("@$listindex@" , creatlista(list)));  
            
                
            
            default:
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('Not a post action!');
                break;
        }
      }
}