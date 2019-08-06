var tempoInicial =$("#tempo-digitacao").text();

$(function(){
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    inicializaMarcadores();
    $("#reloadbtn").click(reiniciaJogo);

});

function atualizaTempoInicial(tempo){
    tempoInicial= tempo;
    $("#tempo-digitacao").text(tempo);
}

function atualizaTamanhoFrase(){
var frase = $(".frase").text();
var numPalavras = frase.split(" ").length;
var tamanhoFrase = $("#tamanho-frase");
tamanhoFrase.text(numPalavras);
}

var campo = $(".campo-digitacao");

function inicializaContadores(){
    campo.on("input",function(){
    var conteudo = campo.val();

    var qtdPalavras = conteudo.split(/\S+/).length -1;
    $("#contador-palavras").text(qtdPalavras);

    var qtdCaracteres = conteudo.length;
    $("#contador-caracteres").text(qtdCaracteres);
    });
}

function inicializaCronometro(){
      campo.one("focus", function(){
        var tempoRestante = $("#tempo-digitacao").text();
        var cronometroID = setInterval(function(){
            tempoRestante--;
            $("#tempo-digitacao").text(tempoRestante);
            if (tempoRestante < 1) {
              clearInterval(cronometroID);
              finalizaJogo();
              }
          },1000);
      });
}

function finalizaJogo(){
  campo.attr("disabled", true);
  campo.addClass("campo-desativado");
  inserePlacar();
}

function inicializaMarcadores() {
        campo.on("input", function(){
        var frase = $(".frase").text();
        var digitado = campo.val();
        var comparavel = frase.substr(0,digitado.length);
            if (digitado == comparavel) {
              campo.addClass("campo-correto")
              campo.removeClass("campo-errado")
            }else{
              campo.addClass("campo-errado")
              campo.removeClass("campo-correto")
            }

        });
}

$("#botao-placar").click(mostraPlacar);
$("#botao-sync").click(sincronizaPlacar);

function sincronizaPlacar(){
    var placar = [];
    var linhas = $("tbody>tr");

    linhas.each(function(){
        var usuario = $(this).find("td:nth-child(1)").text();
        var palavras = $(this).find("td:nth-child(2)").text();

        var score = {
            usuario: usuario,
            pontos: palavras  
        };
        placar.push(score)
    });
    var dados = {
        placar: placar
    }
    $.post("http://localhost:3000/placar", dados, function(){
        console.log("salvou");

    });
}


function inserePlacar(){
    var corpoTabela = $(".placar").find("tbody");
    var usuario = "Player1";
    var numPalavras = $("#contador-palavras").text();
    var botaoRemover = "<a href='#' class='botao-remover'><i class='small material-icons'>delete</i></a>" ;

    var linha = "<tr>"+
                    "<td>"+ usuario + "</td>"+
                    "<td>"+ numPalavras + "</td>"+
                    "<td>"+ botaoRemover + "</td>"+
                "</tr>";

    corpoTabela.prepend(linha);
    $(".botao-remover").click(function(event){
        event.preventDefault();
          var linha = $(this).parent().parent();
          linha.fadeOut(1000);
          setTimeout(function(){
            linha.remove();
          },1000);
});
    $(".placar").slideDown(500);
    scrollPlacar();
}

function scrollPlacar() {
    var posicaoPlacar = $(".placar").offset().top;

    $("html, body").animate(
    {
        scrollTop: posicaoPlacar + "1000px"
    }, 1000);
}


function reiniciaJogo(){
  campo.attr("disabled", false);
  campo.val("");
  $("#contador-palavras").text("0");
  $("#contador-caracteres").text("0");
  $("#tempo-digitacao").text(tempoInicial);
  campo.removeClass("campo-desativado");
  inicializaCronometro();
}


function mostraPlacar(){
    $(".placar").stop().slideToggle(500); 
}