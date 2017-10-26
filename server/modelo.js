function Juego(){
	this.partidas={};
	this.nuevaPartida=function(nombre){
		if (this.partidas[nombre]==null){
			this.partidas[nombre]=new Partida();
		}
	}
}

function Partida(){
	this.jugadores={};
	this.estado=new Inicial();
	this.veg;//randomInt(0,35);
	this.x=200;
	this.socket;
	this.coord=[];
	this.iniciar=function(socket){
		this.socket=socket;
		this.socket.emit('coord',this.coord);
	}
	this.agregarJugador=function(id,socket){
		this.socket=socket;
		this.estado.agregarJugador(id,this);
	}
	this.puedeAgregarJugador=function(id){		
		var y=20;
		this.jugadores[id]=new Jugador(id,this.x,y,this.veg);
		this.veg++;
		this.x=600;
		console.log(this.jugadores);
		if (Object.keys(this.jugadores).length>=2){
			this.estado=new Jugar();
			this.enviarAJugar();
		}
		else
			this.enviarFaltaUno();
	}
	this.enviarFaltaUno=function(){
		this.socket.emit('faltaUno');
	}
	this.enviarAJugar=function(){
		this.socket.broadcast.emit('aJugar',this.jugadores);
		this.socket.emit('aJugar',this.jugadores);
	}
	this.enviarFinal=function(idGanador){
		this.socket.broadcast.emit('final',idGanador);
		this.socket.emit('final',idGanador);
	}
	this.movimiento=function(data,socket){
		this.socket=socket;
		this.estado.movimiento(data,this);
	}
	this.puedeMover=function(data){
		if (data.puntos>=10){
			this.estado=new Final();
			this.enviarFinal(data.id);
		}
		else{
			this.socket.broadcast.emit('movimiento',data);
		}
	}
	this.volverAJugar=function(socket){
		this.socket=socket;
		this.estado.volverAJugar(this);
	}
	this.reset=function(){
		this.estado.reset(this);
	}
	this.reiniciar=function(){
		this.jugadores={};
		this.coord=[];
		this.ini();
		this.estado=new Inicial();
		this.socket.broadcast.emit('reset',this.coord);
        this.socket.emit('reset',this.coord);
		//this.socket=null;
	}
	this.ini=function(){
		this.veg=randomInt(0,25);
		var otra=this.veg+1;
		//console.log(this.veg,"--",otra);
		for(var i=0;i<10;i++){
			this.coord.push({'veg':this.veg,'x':randomInt(10,770),'y':randomInt(25,570)});
		}
		for(var i=0;i<10;i++){
			this.coord.push({'veg':otra,'x':randomInt(10,770),'y':randomInt(25,570)});
		}
		for(var i=0;i<30;i++){
			var alea=randomInt(0,otra-2)
			this.coord.push({'veg':alea,'x':randomInt(10,770),'y':randomInt(25,570)});
		}
		for(var i=0;i<30;i++){
			var alea=randomInt(otra++,35);
			this.coord.push({'veg':alea,'x':randomInt(10,770),'y':randomInt(25,570)});
		}
	}
	this.ini();
}

function Inicial(){
	this.agregarJugador=function(id,juego){
		juego.puedeAgregarJugador(id);
	}
	this.movimiento=function(data,juego){
		console.log('No se admiten movimientos')
	}
	this.reset=function(){
		console.log('Reset en estaod Inicial');
	}
	this.volverAJugar=function(juego){
		juego.reiniciar();
	}
}

function Jugar(){
	this.agregarJugador=function(id,juego){
		console.log('No se puede agregar nuevo jugador');
	}
	this.movimiento=function(data,juego){
		juego.puedeMover(data);
	}
	this.reset=function(juego){
		juego.reiniciar();
	}
	this.volverAJugar=function(juego){
		juego.reiniciar();
	}
}

function Final(){
	this.agregarJugador=function(juego){
		console.log('No se puede agregar nuevo jugador');
	}	
	this.movimiento=function(data,juego){
		console.log('No se admiten movimientos')
	}
	this.volverAJugar=function(juego){
		juego.reiniciar();
	}
}

function Jugador(id,x,y,veg){
	this.id=id;
    this.x=x;//randomInt(100,400),
	this.y=y;//randomInt(100,400),
    this.veg=veg;
}

function randomInt(low, high){
   	return Math.floor(Math.random() * (high - low) + low);
}

module.exports.Juego=Juego;
module.exports.Partida=Partida;