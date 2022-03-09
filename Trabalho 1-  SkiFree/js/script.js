
(function () {

  const FPS = 50;
  const TAMX = 300;
  const TAMY = 400;
  const PROB_OBSTACULO = 2;
  const prob = 70;
  
  var gameLoop;
  var direcoes = ['para-esquerda', 'para-frente', 'para-direita']

  let montanha;
  let skier;

  var msg;

  const obstaculos = [];

  
  function init() {
    montanha = new Montanha();
    skier = new Skier();
    gameLoop = setInterval(run, 1000/FPS);
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') skier.mudarDirecao(-1)
    else if (e.key === 'ArrowRight') skier.mudarDirecao(+1);
    else if (e.key == 'f') skier.aumentarVelocidade();
  })


  function Colisao(skier,obstaculo){

    var colisou;

    var refSkier = window.getComputedStyle(skier.element, null); // pega as propriedades CSS do skier
    var refObstaculo = window.getComputedStyle(obstaculo.element, null); // pega as propriedades CSS do obstaculo

    var refSkierTop = parseInt(refSkier.top.substring(0, refSkier.length - 2)); // top do skier
    var refObstaculoTop = parseInt(refObstaculo.top.substring(0, refObstaculo.length - 2)); // top do obstaculo

    var refSkierLeft = parseInt(refSkier.left.substring(0, refSkier.length - 2)); // left do skier
    var refObstaculoLeft = parseInt(refObstaculo.left.substring(0, refObstaculo.length - 2)); // left do obstaculo

    var refSkierHeight = parseInt(refSkier.height.substring(0, refSkier.length - 2)); // altura do skier
    var refObstaculoHeight = parseInt(refObstaculo.height.substring(0, refObstaculo.length - 2)); // altura do obstaculo 

    var refSkierWidth = parseInt(refSkier.width.substring(0, refSkier.length - 2)); // largura do skier
    var refObstaculoWidth = parseInt(refObstaculo.width.substring(0, refObstaculo.length - 2)); // largura do obstaculo 


    var posSkierCimaAltura = refSkierTop + refSkierHeight; 
    var posSkierLadoLargura = refSkierLeft + refSkierWidth;

    var posObstaculoCimaAltura = refObstaculoTop + refObstaculoHeight;
    var posObstaculoLadoLargura = refObstaculoLeft + refObstaculoWidth;


    var posInfDir = ((posSkierCimaAltura >= refObstaculoTop) && (posObstaculoCimaAltura >= posSkierCimaAltura)  && (refObstaculoLeft >= refSkierLeft) && (refObstaculoLeft <= posSkierLadoLargura)); // pega a posição inferior direita em relaçao ao skier, se essa ponta toca no obstaculo

    var posInfEsq = ((refObstaculoTop <= posSkierCimaAltura) && (posObstaculoCimaAltura >= posObstaculoCimaAltura) && (posObstaculoLadoLargura >= refSkierLeft) && (posObstaculoLadoLargura <= posSkierLadoLargura)); // pega a posição inferior esquerda em relaçao ao skier, se essa ponta toca no obstaculo

    var posSupDir = ((refSkierTop <= posObstaculoCimaAltura) && (refObstaculoTop <= refSkierTop) && (refObstaculoLeft >= refSkierLeft) && (refObstaculoLeft <= posSkierLadoLargura)); // pega a posição superior direita em relaçao ao skier, se essa ponta toca no obstaculo
  
    var posSupEsq = ((refSkierTop <= posObstaculoCimaAltura) && (refObstaculoTop <= refSkierTop) && (posObstaculoLadoLargura >= refSkierLeft) && (posSkierLadoLargura >= posObstaculoLadoLargura)); // pega a posição superior esquerda em relaçao ao skier, se essa ponta toca no obstaculo

    
    var posSup = (refSkierTop <= posObstaculoCimaAltura) && (refObstaculoTop <= refSkierTop) && (refObstaculoLeft <= refSkierLeft) && (posObstaculoLadoLargura >= posSkierLadoLargura); // pega a posição superior acima em relaçao ao skier, se o topo toca no obstaculo

    var posInf = (posSkierCimaAltura >= refObstaculoTop) && (posObstaculoCimaAltura >= posSkierCimaAltura) && (refObstaculoLeft <= refSkierLeft) && (posObstaculoLadoLargura  >= posSkierLadoLargura); // pega a posição inferior abaixo em relaçao ao skier, se a parte de baixo toca no obstaculo

    colisou = posInfDir || posSupDir || posInfEsq || posSupEsq || posSup || posInf; // se algum der true quer dizer q colidiu com o obstaculo
    // if(colisou == true) console.log(posInfDir, posSupDir, posInfEsq , posSupEsq , posSup, posInf);
    
    return colisou;
  }

  /*
  * Classe Montanha
  */

  class Montanha {
    constructor() {
      this.element = document.getElementById('montanha');
      this.element.style.width = `${TAMX}px`;
      this.element.style.height = `${TAMY}px`;
    }

    fimJogo(){
      var frameFimJogo = document.createElement('div');
      frameFimJogo.className = 'frame-fim-jogo';
      frameFimJogo.innerHTML = '<h5> FIM DE JOGO! </h5>' +
                      '<span> Sua pontuacao foi: ' + skier.pontuacao + '</span>'; 
      montanha.element.appendChild(frameFimJogo);

      clearInterval(gameLoop);
      // init();
    }
  }

  /*
  * Classe Skier
  */

  class Skier {
    constructor() {
      this.element = document.getElementById('skier');
      this.direcoes = ['para-esquerda', 'para-frente', 'para-direita'];
      this.parado = 0;
      
      this.velocidade = 20;
      this.vidas = 3;
      this.pontuacao = 0;
      this.mensagem = ' ';

      this.direcao = 1;
      this.element.className = this.direcoes[this.direcao];
      this.element.style.top = '20px';
      this.element.style.left = parseInt(TAMX/2)-8 + 'px';
      this.functionTempoParado;

    }
    mudarDirecao(giro) {
      if (this.direcao + giro >= 0 && this.direcao + giro <= 2) {
        this.direcao += giro;
        this.element.className = this.direcoes[this.direcao];
      }
    }
    andar() {
      var style = window.getComputedStyle(this.element, null);

      var left = style.left;
      left = left.substring(0, left.length - 2);

      var width = style.width;
      width = width.substring(0, width.length - 2);

      if (this.direcao === 0){
        if(parseInt(left)>0){
          this.element.style.left = parseInt(this.element.style.left)-1 + 'px';
        }
        else{
          this.element.className = 'para-frente';
          this.mudarDirecao(1)
        }

        
      }
      else if (this.direcao === 2){
        if((parseInt(left) + parseInt(width)) < TAMX){
          this.element.style.left = parseInt(this.element.style.left)+1 + 'px';
        }
        else{
          this.element.className = 'para-frente';
          this.mudarDirecao(-1);
        }
        
      }
      this.pontuacao += this.velocidade / 1000 * FPS;
    }

    aumentarVelocidade(){
      if(this.velocidade == 20){
        this.velocidade = 30;
      }
      else{
        this.velocidade = 20;
      }
    }

    batida(elemento, ArrayElementos, NomeClasse){
      this.parado = 1;
      this.tempo = 0;
      this.element.className = NomeClasse;
      this.arrayElementos = ArrayElementos; //  obstaculos
      this.elemento = elemento; // obstaculos
      var batida = this;

      this.functionTempoParado = setInterval(function () {
          var display = ['block', 'none'];
          batida.element.style.display = display[batida.tempo % 2];
          if (batida.tempo > 3) {
            batida.parado = 0;
              clearInterval(batida.functionTempoParado);
              batida.element.className = direcoes[batida.direcao];
              batida.elemento.batidaObstaculo(batida.arrayElementos);
             
         
          };
          batida.tempo++;

      }, 100);
    }

    fimVida(){
      this.tempo = 0;
      this.element.className = 'skier-fim-vidas';
      var instanciaSkier = this;

      this.functionBlink = setInterval(function () {
          var display = ['block', 'none'];
          instanciaSkier.element.style.display = display[instanciaSkier.tempo % 2];
          if (instanciaSkier.tempo > 3) {
              clearInterval(instanciaSkier.functionBlink);
          };
          instanciaSkier.tempo++;

        }, 100);
    }

    placar(){
      var vidas = document.getElementById("vidas");
      var pontuacao = document.getElementById("metros");
      var velocidade = document.getElementById("velocidade");
      var msg = document.getElementById("mensagem");
      pontuacao.innerHTML = Math.round(this.pontuacao) + " metros";
      vidas.innerHTML = this.vidas;
      velocidade.innerHTML = this.velocidade + " m/s";
      msg.innerHTML = this.mensagem;
    }

  }



   class Obstaculos{
    constructor(nomeObstaculo) {
        this.element = document.createElement('div');
        this.element.className = nomeObstaculo;
        montanha.element.appendChild(this.element);
        this.element.style.top = `${TAMY}px`;
        this.element.style.left = Math.floor(Math.random() * TAMX) + 'px';
        this.continuaNoJogo = true;
        this.contadorAnimacao = 1;
      }
    criaObstaculoRandom(velocidade){
        return this.element.style.top = (parseInt(this.element.style.top) - (1 * velocidade / 20)) + 'px';
    }
    limitesMontanha(){
        var style = window.getComputedStyle(this.element, null);
  
        var top = style.top;
        top = top.substring(0, top.length - 2);
  
        var height = style.height;
        height = height.substring(0, height.length - 2);
  
        if (parseInt(top) + parseInt(height) < 0) {
            return true;
        }
        return false;
    }

    batidaObstaculo(obstaculos){
        this.contadorAnimacao = 0;
        this.continuaNoJogo = 0;
        this.obstaculo = obstaculos;
        var obs = this;
    
        if (!skier.parado) {
            this.functionAnimacao = setInterval(function () {
                if (obs.contadorAnimacao > 6) {
                  obs.removeObstaculo();
                    clearInterval(obs.functionAnimacao);
                }
                obs.contadorAnimacao++;
                obs.element.style.display = 'none';
            }, 200);
        }
    }

    

    removeObstaculo() {
      this.element.display = 'none';
    }

    animacaoCogumelo(){
      this.continuaNoJogo = 0;
      this.element.style.display = 'none';
    }
        
  }

 


  function Roda(arrayObstaculos, nomeClasse){
    arrayObstaculos.forEach(a => {
      a.criaObstaculoRandom(skier.velocidade);
      if (a.continuaNoJogo && !a.limitesMontanha()) {
        if (Colisao(skier, a)) {
          if(a.element.className == 'cogumelo'){
            skier.mensagem = "Consumiu alucinógenos" ;
            skier.vidas++;
            console.log(skier.vidas);
            a.animacaoCogumelo();
          }
          else if(a.element.className == 'cachorro'){
            skier.mensagem = "Olha o doguizineo";
            skier.vidas--;
            skier.batida(a, arrayObstaculos, nomeClasse);
          }
          else{
            skier.vidas--;
            if (skier.vidas < 0) {
              skier.fimVida();
              montanha.fimJogo();
              // init();
            } 
            else {
              skier.mensagem = "Cuidado!";
              skier.batida(a, arrayObstaculos, nomeClasse);
                // a.removeObstaculo(arrayObstaculos);
                
            }
          } 
        }
       
      }
      if (a.limitesMontanha()) {
        a.removeObstaculo();
      }
    })
  }

  
 
 
  /*
  * Funcao que roda o jogo
  */

  function run() {
    
    
    if (!skier.parado) {
      const tiposObstaculos = ['arvore', 'arbusto_em_chamas', 'rocha', 'toco', 'arvoreGrande', 'cogumelo', 'cachorro']
      const randomObstaculos = Math.floor( Math.random() * (7));
      var random = Math.random() * prob;

      if (random <= PROB_OBSTACULO) {
        const obstaculo = new Obstaculos(tiposObstaculos[randomObstaculos]);
        obstaculos.push(obstaculo);
      }
      Roda(obstaculos);
    }

    skier.andar();
    


    skier.placar();
  
  }

  init();

})()