
function Juego(){
    this.naves={};
    this.cursors;
    this.veggies;
    this.naveLocal;
    this.fin=false;
    this.marcador;
    this.rival;
    this.text;
    this.coord;
    this.preload=function() {
       game.load.image('space', 'cliente/recursos/deep-space.jpg');
       game.load.image('bullet', 'cliente/recursos/bullets.png');
       game.load.image('ship', 'cliente/recursos/ship.png');
       //game.load.spritesheet('veggies', 'cliente/recursos/fruitnveg32wh37.png', 32, 32);
       game.load.spritesheet('veggies', 'cliente/recursos/pokemon.png', 96, 96);
       game.load.bitmapFont('carrier_command', 'cliente/recursos/carrier_command.png', 'cliente/recursos/carrier_command.xml');
       game.load.image("play","cliente/recursos/reset.png");
    }
    this.init=function(data){
        game.stage.disableVisibilityChange = true;
        this.coord=data;
    }

    this.create=function() {

        //  This will run in Canvas mode, so let's gain a little speed and display
        game.renderer.clearBeforeRender = false;
        game.renderer.roundPixels = true;

        //  We need arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        
        this.marcador = game.add.text(game.world.centerX, 25, "Puntos. Yo: 0 - Rival: 0", {
                font: "25px Arial",
                fill: "#FDFEFE",
                align: "center"
            });
        this.marcador.anchor.setTo(0.5, 0.5);      

        this.text = game.add.text(game.world.centerX, 300, "VeggieRocket", {
                font: "100px Arial Black",
                fill: "#FDFEFE",
                align: "center"
            });
        
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 0.5;  

        game.input.onDown.addOnce(this.eliminarText, this);        

        this.veggies = game.add.physicsGroup();        

        for(var i=0;i<this.coord.length;i++){
            var c = this.veggies.create(this.coord[i].x, this.coord[i].y, 'veggies', this.coord[i].veg);
        }

        // for (var i = 0; i < 50; i++)
        // {
        //     var c = this.veggies.create(game.rnd.between(10, 770), game.rnd.between(25, 570), 'veggies', game.rnd.between(0, 15));
        //     c.body.mass = -100;
        // }

        // for (var i = 0; i < 50; i++)
        // {
        //     var c = this.veggies.create(game.rnd.between(10, 770), game.rnd.between(25, 570), 'veggies', game.rnd.between(18, 35));
        //     c.body.mass = -100;
        // }

        // for (var i = 0; i < 20; i++)
        // {
        //     var c = this.veggies.create(game.rnd.between(10, 770), game.rnd.between(25, 570), 'veggies', 17);
        // }

        // for (var i = 0; i < 20; i++)
        // {
        //     var c = this.veggies.create(game.rnd.between(10, 770), game.rnd.between(25, 570), 'veggies', 16);
        // }
        
        //cliente.reset();

        //  Game input
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);
        //game.input.addPointer();
        game.world.bringToTop(this.text);
        cliente.askNewPlayer();
    }
    this.eliminarText=function(){
        this.text.destroy();
    }
    this.actualizarMarcador=function(){
        this.marcador.setText("Puntos. Yo:" +this.naveLocal.puntos + "- Rival:"+this.rival.puntos);
        game.world.bringToTop(this.marcador);
    }
    this.collisionHandler=function(bullet, veg) {
        //bullet.kill();
        if (veg.frame==this.naves[cliente.id].veg){
                console.log("colision");
                veg.kill();
                this.naves[cliente.id].puntos++;                
                //return true;
        }        
    }
   this.rivalHandler=function(bullet, veg) {      
        if (veg.frame==this.rival.veg){
            console.log("colision rival");
            veg.kill(); 
        }  
    }
    this.processHandler=function(player, veg) {        
        return true;
    }
    this.finJuego=function(id){
        this.fin=true;
        console.log(id);
        game.state.start("FinJuego",true,false,id,cliente.id);
    }

    this.faltaUno=function(){
        this.marcador.setText("Puntos. Yo:0 - Rival:0 \n --- Esperando rival ---");
        this.marcador.anchor.setTo(0.5, 0);
        game.world.bringToTop(this.marcador);
    }
    this.update=function() {

        // var id=$.cookie("usr");
        //var nave;
        // nave=this.naves[id];   
        if (!this.fin)
        {  
            var nave=this.naveLocal;
            if (nave){
                if (game.physics.arcade.collide(nave.sprite, this.veggies, this.collisionHandler,this.processHandler, this))
                {
                    console.log('boom');                    
                }
                if (game.physics.arcade.collide(this.rival.sprite, this.veggies, this.collisionHandler,this.rivalHandler, this))
                {
                    console.log('boom');                    
                }

                //game.physics.arcade.overlap(nave, this.veggies, this.collisionHandler, null, this);
                if (game.input.activePointer.isDown){
                    var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.activePointer.x, game.input.activePointer.y);  
                    nave.sprite.rotation = targetAngle;
                    nave.mover(game.input.activePointer.x,game.input.activePointer.y,targetAngle);//nave.sprite.body.angularVelocity);            
                }
                this.actualizarMarcador();
                // if (game.input.pointer1.isDown){
                //     var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.activePointer.x, game.input.activePointer.y);  nave.sprite.rotation = targetAngle;
                //     this.moverNave(id,game.input.pointer1.x,game.input.pointer1.y,nave.sprite.body.angularVelocity);   
                // }

                 // if (this.cursors.up.isDown)
                 // {
                 //     game.physics.arcade.accelerationFromRotation(nave.sprite.rotation, 200, nave.sprite.body.acceleration);

                 // }
                 // else
                 // {
                 //     nave.sprite.body.acceleration.set(0);
                 // }
                

                if (this.cursors.left.isDown)
                {
                    nave.sprite.body.angularVelocity = -300;
                }
                else if (this.cursors.right.isDown)
                {
                    nave.sprite.body.angularVelocity = 300;
                }
                else
                {
                    nave.sprite.body.angularVelocity = 0;
                }

                if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
                {
                    nave.disparar();
                }

                this.screenWrap(nave.sprite);
                
                //nave.bullets.forEachExists(this.screenWrap, this);    
            }
            else
                this.faltaUno();
        }
    }

    this.agregarJugador = function(id,x,y,veg){
        console.log("nuevo usuario");
        var nave=new Nave(id,x,y,veg);
        this.naves[id]=nave;
        if (id==cliente.id){
            this.naveLocal=this.naves[cliente.id];
        }
        else{
            this.rival=nave;
        }
    }
    this.moverNave=function(data){        
        var nave=this.naves[data.id];
        nave.puntos=data.puntos;
        nave.mover(data.x,data.y,data.ang,true);        
        this.rival=nave;
        this.actualizarMarcador();
    }
    this.volverAJugar=function(data){
        cliente.reset();
        this.fin=false;
        this.naves={};
        this.naveLocal=null;
        this.coord=[];
        game.state.start("Game",true,false,data);
    }

    this.screenWrap=function(sprite) {
       
        if (sprite.x < 0)
        {
            sprite.x =game.width;
        }
        else if (sprite.x >game.width)
        {
            sprite.x = 0;
        }

        if (sprite.y < 0)
        {
            sprite.y =game.height;
        }
        else if (sprite.y >game.height)
        {
            sprite.y = 0;
        }

    }

    this.render=function() {
        // if (this.fin){
        //     game.state.start("FinJuego",true,false,cliente.id);
        // }
    }
}


function FinJuego(){
    this.ganador;
    this.idLocal;
    this.init =function(id,idLocal) {    
        //alert("Ganador: "+score)
        this.ganador=id;
        this.idLocal=idLocal;
    };
    this.create= function(){
        //var gameOverTitle = game.add.sprite(160,160,"gameover");
        //gameOverTitle.anchor.setTo(0.5,0.5);
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        var cadena="";
        
        if (this.ganador==this.idLocal){
            cadena="Enhorabuena, ¡ERES EL GANADOR!";
        }
        else{
            cadena="Lo siento, tu rival te ha vencido"
        }

        var text2 = game.add.text(game.world.centerX, 180, cadena, {
                font: "25px Arial",
                fill: "#FDFEFE",
                align: "center"
            });
        text2.anchor.setTo(0.5, 0.5); 

       var text1 = game.add.text(game.world.centerX, 220, "Gracias por usar VeggieRocket", {
                font: "25px Arial",
                fill: "#FDFEFE",
                align: "center"
            });
        text1.anchor.setTo(0.5, 0.5);    

        var text = game.add.bitmapText(400, 300, 'carrier_command', 'FIN JUEGO', 64);
        text.anchor.x = 0.5;
        text.anchor.y = 0.5;

        var playButton = game.add.button(400,420,"play",this.volverAJugar,this);
        playButton.anchor.setTo(0.5,0.5);
    };
    this.volverAJugar= function(){
        cliente.volverAJugar();
    }
}

function Nave(id,x,y,veg){
    this.id=id;
    this.x=x;
    this.y=y;
    this.destX;
    this.destY;
    this.veg=veg;
    this.puntos=0;
    this.sprite;
    this.bullets;
    this.bullet;
    this.bulletTime = 0;
    this.mover=function(x,y,ang,socket){       
        this.sprite.rotation=ang; 
        this.sprite.body.velocity=10;     
        //var targetAngle = game.math.angleBetween(this.sprite.x, this.sprite.y,x,y);  this.sprite.rotation = targetAngle;
        this.destX=x;
        this.destY=y;
        //game.physics.arcade.accelerationFromRotation(this.sprite.rotation, 100, this.sprite.body.acceleration);

        var distance=Phaser.Math.distance(this.sprite.x, this.sprite.y, x, y);
        var duration = distance*3;
        var tween = game.add.tween(this.sprite);        
        tween.to({x:x,y:y}, duration);
        tween.start();
        if (!socket)
            tween.onComplete.add(this.onComplete, this);

    }
    this.onComplete=function(){
        cliente.enviarPosicion(this.sprite.x,this.sprite.y,this.sprite.rotation, this.puntos);
    }
    this.disparar=function() {

        if (game.time.now > this.bulletTime)
        {
            this.bullet = this.bullets.getFirstExists(false);

            if (this.bullet)
            {
               this.bullet.reset(this.sprite.body.x + 16, this.sprite.body.y + 16);
               this.bullet.lifespan = 1000;
               this.bullet.rotation = this.sprite.rotation;
               game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, this.bullet.body.velocity);
               this.bulletTime =game.time.now + 50;
            }
        }
    }
    this.ini=function(){
        this.bullets= game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        //  All 40 of them
        this.bullets.createMultiple(40, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);

        //  Our player ship
        this.sprite = game.add.sprite(this.x, this.y, 'ship');
        this.sprite.anchor.set(0.5);

        //  and its physics settings
        game.physics.arcade.enable(this.sprite);//, Phaser.Physics.ARCADE);

        this.sprite.body.drag.set(50);
        this.sprite.body.maxVelocity.set(200);    

    }
    this.ini();
}