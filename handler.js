const fs = require("fs");
const {parse} = require("querystring");

const db = require("./db");

var url = require('url');
var path = require('path');
const { allowedNodeEnvironmentFlags } = require("process");
const { Console } = require("console");

//professor

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
        response.end(readFile("index.html").replace("@$listindex@", creatlista(list))
        .replace("{$linhas}", createListElements(list)));
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
        .replace("{$linhas}", createListElements(list))
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
        response.end(readFile("vender.html").replace("@$listvenda@", creatlistVenda(list))
        .replace("{$linhas}", createListElements(list)));
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
        response.end(readFile("compra.html").replace("@$listsaldo@", verificaSaldo(list))
        .replace("{$linhas}", createListElements(list)));
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
        response.end(readFile("dividendos.html").replace("@$listdividendos@", creatlistdividendos(list))
        .replace("{$linhas}", createListElements(list)));
        //response.end(readFile("index.html").replace("@$list@", list.length).replace("@$listindex@" , creatlista(list)))
    });
}


var createListElements = (list) => {
    let listaGerada = ' ';

    let layout = `<tr>
    <td>{$Codigo de Indentificação}</td>
      <td>{$Nome}</td>
      <td>{$Valor do Investimento}</td>
      <td>{$Funcionario?}</td>
  </tr>`;

    list.forEach(element => {
            listaGerada+= layout.replace("{$nome}", element.fname).replace("{$sobrenome}", element.lname);    
        });

   
    return listaGerada;
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

var collectDatalist2 = (rq, cal , list2 = []) => {
    var data2 = '';
    rq.on('data2', (chunk) => {
        data2 += chunk;
    });
    rq.on ('end', () => {
        let new_element = parse(data2);
        cal(parse(data2));
    });
    for(let i = 0; i< list2.length; i++)
    list2[i] = datanova;
}

var creatlista = (list) =>{
    let listaGerada = '';

    let layot =  `<tr>
    <td>{$Codigo de Indentificação}</td>
      <td>{$Nome}</td>
      <td>{$Valor do Investimento}</td>
      <td>{$Atuacao}</td>
      <td>{$Funcionario?}</td>
      <td>{$Tipo}</td>
  </tr>`;

list.forEach(element => {
   
    listaGerada += layot.replace("{$Codigo de Indentificação}", element.cod)
                                .replace("{$Nome}" , element.fname)
                                .replace("{$Valor do Investimento}" , element.valor)
                                .replace("{$Atuacao}" , element.atuacao)
                                .replace("{$Funcionario?}" , element.sim?"sim": "nao")
                                .replace("{$Funcionario?}" , element.compra?" ": "nao")
                                .replace("{$Tipo}" , element.preferencial?"preferencial" : "Ordinária")
                                if("{$Codigo de Indentificação}" === "{$undefined}")
                                layot = deleteRow(layot);
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
    <td>{$Codigo da Acao}</td> 
    <td>{$valor total das acaos}</td/>
    <td>{$acaos Cadastradas}</td>
  </tr>`;

  let calc = 0 ;
 
  // parseInt(valor , 10);
  let valorcomp = "";
  //let valor  = "0";
  list.forEach(element => {
      let acaosCompradas  = 0;
     // var valor = document.getElementById("valorcompra").values;
   
    //(valor) =  (valor) + parceint(valordecompra);
    let data = new Date();
    listCompra += layot2.replace("{$Data}",  "Dia" + data.getDate() + " Mes"+ data.getMonth() + " Ano" + data.getFullYear())
    .replace("{$Valor}" ,  element.valordecompra)
    .replace("{$quantidade}" , element.quant)
    .replace("{$Codigo da Acao}" , element.codcompra)
    .replace("{$valor total das acaos}" ,element.valordecompra)
    .replace("{$acaos Cadastradas}" ,element.cod)
     calc = valor = valor + parseInt(element.valordecompra);
    valorcomp = element.valordecompra
    codacao = element.codcompra;
    valor = element.valordecompra;
 
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
  list.forEach(element =>{
       valocomp2 = (element.valordecompra)
    //   parseInt(valorcomp2); // quando faço o parseint no elemento.valordacompra ou a variavel que pega essa valor a valorcamp2 dá pau 
       // quando vou converter para int dá pau
       //valor = valor + parseInt(valorcomp2);
       valor = valor + valocomp2;
      saldo += layot4.replace("{$Valor Total de Acaos Comprada}" , " Total " + valocomp2 )
    
      //.replace("{$Funcionario?}" , element.sim?"sim": "nao")
  })
  //parseInt(element.valordecompra);
 
     parseInt(valor);
     parseInt(calc);
     
    ;
  return saldo;
}
var creatlistacaosadiquiridas   = (list , valoCompra) => {
    let acaosadiquiridas = "";
    let layot3 = `  <tr>
    <td>{$acaos compradas}</td>
  </tr>`;

  list.forEach(element => {
    acaosadiquiridas += layot3.replace("{$acaos compradas}" , element.valordecompra)
    valoCompra = valoCompra + parseInt(element.valordecompra)
  })
  return acaosadiquiridas;
}
//let valor = " ";
//list.forEach(element =>{
  //  (valor = element.valordecompra  +  element.valordecompra)
//}

var creatlistVenda   = (list , codacao) => {
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
function acao(list){
   let saldo = "";
   let lista = `<tr>
   <td>Saldo</td>
 </tr>`;
   list.forEach(element =>{
       saldo = saldo + lista.replace("{$Saldo}" , element.valordecompra)
   });
   return saldo;
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
    .replace("{$$Data dá Compra}" , element.data_compra)
    .replace("{$Data do Pagamento}" , element.data_pagamento)
    .replace("{$Valor a ser Pago por Cota}" , element.valor_da_cota); 
  });

  return listDividendos;
}



module.exports = (request, response) => {
    if (request.method === 'GET') {
        
        let url_parsed = url.parse(request.url, true);
        switch (url_parsed.pathname) {
            case '/':
                response.writeHead(200, {'Content-Type': 'text/html'});
                //response.end(readFile("index.html").replace("@$list@", list.length).replace("@$listindex@" , creatlista(list)))
                loadData(response);
                break;
            case '/element':
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end("Elemento: " +url_parsed.query.id + " acessado!");
                break;
                case '/compra':
                    response.writeHead(200, {'Content-Type': 'text/html'});
                   // response.end(readFile("compra.html").replace("@$listindex@" , creatlista(list))
                    //.replace("@$listcompra@" , creatlistcompra(list)
                    //.replace("@$listacaos@" , acao(list))));
                    loadDatadois(response);
                   loadDatasaldo(response);
                    break;
                    case '/vender':
                    response.writeHead(200, {'Content-Type': 'text/html'});
                   // response.end(readFile("vender.html").replace("@$listcompra@" , creatlistcompra(list))
                    //.replace("@$listvenda@" , creatlistVenda(list)));
                    loadDatavenda(response);                         
                break;
                case '/compra':
                    response.writeHead(200, {'Content-Type': 'text/html'});
                   // response.end(readFile("compra.html").replace("@$listindex@" , creatlista(list))
                    //.replace("@$listcompra@" , creatlistcompra(list)
                    //.replace("@$listacaos@" , acao(list))));
                    loadDatadois(response);
                    loadDatasaldo(response);
                    break;
                    case '/dividendos':
                    response.writeHead(200, {'Content-Type': 'text/html'});
                   // response.end(readFile("vender.html").replace("@$listcompra@" , creatlistcompra(list))
                    //.replace("@$listvenda@" , creatlistVenda(list)));
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
                        //global.connection.collection("saldo").insertOne(data);
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
                response.end(readFile("index.html").replace("@$list@", list.length)
                .replace("@$listindex@" , creatlista(list)));  
     
                //response.end(readFile("compra.html").replace("@$list@", list.length)
                //.replace("@$listindex@" , creatlista(list)));  
            
                
            
            default:
                response.writeHead(404, {'Content-Type': 'text/plain'});
                response.end('Not a post action!');
                break;
        }
      }
}