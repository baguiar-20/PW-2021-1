(function(){

    const FPS = 50;
    const TAMX = 300;
    const TAMY = 400;
    const PROB_ARVORE = 2;
    const PROB_ARBUSTO = 2;
    const TEMPO_SKIER_PARADO_COLISAO = 100;
    const vel = 20;
    var gameLoop;
  
    var direcoes = ['para-esquerda', 'para-frente', 'para-direita']
  
    let montanha;
    let skier;
  
    const obstaculos = [];
    const arvores = [];
    
    
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
  
  
    function colisao(a, b){
      var styleA = window.getComputedStyle ? getComputedStyle(a.element, null) : a.element.currentStyle;
      var topA = styleA.top;
      topA = parseInt(topA.substring(0, topA.length - 2));
  
      var leftA = styleA.left;
      leftA = parseInt(leftA.substring(0, leftA.length - 2));
  
      var heightA = styleA.height;
      heightA = parseInt(heightA.substring(0, heightA.length - 2));
  
      var widthA = styleA.width;
      widthA = parseInt(widthA.substring(0, widthA.length - 2));
      var styleB = window.getComputedStyle ? getComputedStyle(b.element, null) : b.element.currentStyle;
  
      var topB = styleB.top;
      topB = parseInt(topB.substring(0, topB.length - 2));
      var leftB = styleB.left;
      leftB = parseInt(leftB.substring(0, leftB.length - 2));
      var heightB = styleB.height;
      heightB = parseInt(heightB.substring(0, heightB.length - 2));
      var widthB = styleB.width;
      widthB = parseInt(widthB.substring(0, widthB.length - 2));
  
      //feito em relacao a A
      var cantoInferiorDireito = ((topA + heightA >= topB) && (topB + heightB >= topA + heightA) && (leftB >= leftA)) && (leftB <= leftA + widthA);
  
      var cantoSuperiorDireito = ((topA <= topB + heightB) && (topB <= topA) && (leftB >= leftA)) && ((leftB <= leftA + widthA));
  
      var cantoSuperiorEsquerdo = ((topA <= topB + heightB) && (topB <= topA) && (leftB + widthB >= leftA)) && ((leftA + widthA >= leftB + widthB));
  
      var cantoInferiorEsquerdo = ((topB <= topA + heightA) && (topB + heightB >= topA + heightA) && (leftB + widthB >= leftA)) && ((leftB + widthB <= leftA + widthA));
  
      var colisaoInferiorCompleta = (topA + heightA >= topB) && (topB + heightB >= topA + heightA) && (leftB <= leftA) && (leftB + widthB >= leftA + widthA);
  
      var colisaoSuperiorCompleta = (topA <= topB + heightB) && (topB <= topA) && (leftB <= leftA) && (leftB + widthB >= leftA + widthA);
  
      var result = cantoInferiorDireito || cantoInferiorEsquerdo || cantoSuperiorDireito || cantoSuperiorEsquerdo || colisaoInferiorCompleta || colisaoSuperiorCompleta;
      
      return result;
  
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
        var style = window.getComputedStyle ? getComputedStyle(this.element, null) : this.element.currentStyle;
  
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
        this.arrayElementos = ArrayElementos; //  arvores ou arbustos
        this.elemento = elemento; // arvore ou arbusto
        var instanciaSkier = this;
  
        this.functionTempoParado = setInterval(function () {
            var display = ['block', 'none'];
            instanciaSkier.element.style.display = display[instanciaSkier.tempo % 2];
            if (instanciaSkier.tempo > 3) {
                instanciaSkier.parado = 0;
                clearInterval(instanciaSkier.functionTempoParado);
                
                if(instanciaSkier.elemento.element.className == "arvore"){
                  instanciaSkier.element.className = direcoes[instanciaSkier.direcao];
                  instanciaSkier.elemento.batidaArvore(instanciaSkier.arrayElementos);
                }
                else if(instanciaSkier.elemento.element.className == "arbustoChamas"){
                  instanciaSkier.element.className = direcoes[instanciaSkier.direcao];
                  instanciaSkier.elemento.batidaArbusto(instanciaSkier.arrayElementos);
                }
                else if(instanciaSkier.elemento.element.className == "rocha"){
                  instanciaSkier.element.className = direcoes[instanciaSkier.direcao];
                  instanciaSkier.elemento.batidaRocha(instanciaSkier.arrayElementos);
                }
                
            };
            instanciaSkier.tempo++;
  
        }, TEMPO_SKIER_PARADO_COLISAO);
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
  
          }, TEMPO_SKIER_PARADO_COLISAO);
      }
  
      placar(){
        var vidas = document.getElementById("vidas");
        var pontuacao = document.getElementById("metros");
        var velocidade = document.getElementById("velocidade");
        pontuacao.innerHTML = Math.round(this.pontuacao) + " metros";
        vidas.innerHTML = this.vidas;
        velocidade.innerHTML = this.velocidade + " m/s";
      }
    }
  
  




    // class Obstaculos{
    //     constructor(nomeObstaculo){ // passar arvore, arbusto, rocha, toco
    //         this.nomeObstaculo = nomeObstaculo;
    //         this.element = document.createElement('div');
    //         this.element.className = nomeObstaculo;
    //         montanha.element.appendChild(this.element);

    //         this.element.style.top = `${TAMY}px`;
    //         this.element.style.left = Math.floor(Math.random() * TAMX) + 'px';
    //         this.continuaNoJogo = true;
    //         this.contadorAnimacao = 1;
    //     }

    //     t(){
    //         console.log("medsudhah");
    //     }

    //     criaRandom(velocidade){
    //         this.element.style.top = (parseInt(this.element.style.top) - (1 * velocidade / 20)) + 'px';
    //     }

    //     limitesMontanha(){
    //         var style = window.getComputedStyle ? getComputedStyle(this.element, null) : this.element.currentStyle;
      
    //         var top = style.top;
    //         top = top.substring(0, top.length - 2);
      
    //         var height = style.height;
    //         height = height.substring(0, height.length - 2);
      
    //         if (parseInt(top) + parseInt(height) < 0) {
    //             return true;
    //         }
    //         return false;
    //     }

    //     batidaObstaculo(){
    //         this.contadorAnimacao = 0;
    //         this.continuaNoJogo = 0;
    //         var display = ['block', 'none'];
    //         this.obstaculo = obstaculos;
    //         var instanciaObstaculo = this;
        
    //         if (!skier.parado) {
    //             this.functionAnimacao = setInterval(function () {
    //                 if (instanciaObstaculo.contadorAnimacao > 6) {
    //                     instanciaObstaculo.removeObstaculo(obstaculos);
    //                     clearInterval(instanciaObstaculo.functionAnimacao);
    //                 }
    //                 instanciaObstaculo.contadorAnimacao++;
    //                 instanciaObstaculo.element.style.display = display[instanciaObstaculo.contadorAnimacao % 2];
    //             }, 200);
    //         }
    //     }

    //     removeObstaculo(removeObstaculo) {
    //         var index = obstaculos.indexOf(this);
    //         obstaculos.splice(index, 1);
    //         //verificar se os elementos existem na div antes de remover
    //         if(this.element.closest(montanha.element.id)){
    //           montanha.element.removeChild(this.element);
    //         }
    //       }
    //   }
    
    // class Arvore extends Obstaculos{
    //     constructor(nomeObstaculo){
    //         super(nomeObstaculo);
    //     }
    // }

    function run() {
    
    
        if (!skier.parado) {
         
          //cria arvores
          var random = Math.random() * 200;
          
          if (random <= PROB_ARVORE) {
            const arvore = new Arvore();
            arvores.push(arvore);
          }
         
        //   arvores.forEach(a => {
    
        //     a.criaRandom(skier.velocidade);
        //     // a.t('arvore');
        //     console.log(a);
           
        //   })
    
         
          
    
    
        
        }
    
        skier.andar();
        skier.placar();
        
    
      }
    
      init();
    
})