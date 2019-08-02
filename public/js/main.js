var tempoInicial =$("#tempo-digitacao").text();

$(function(){
    atualizaTamanhoFrase();
    inicializaContadores();
    inicializaCronometro();
    inicializaMarcadores();
    $("#reloadbtn").click(reiniciaJogo);

});


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

      var tempoRestante = $("#tempo-digitacao").text();
      campo.one("focus", function(){
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
        var frase = $(".frase").text();
        campo.on("input", function(){
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
        $(this).parent().parent().remove();
});
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