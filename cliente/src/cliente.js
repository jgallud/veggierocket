function Cliente(){
	this.socket;
	this.id=null;
	this.veg;
	this.coord;
	this.cargarConfiguracion=function(){
		this.socket.emit('configuracion');
	}
	this.askNewPlayer = function(){		
    	this.socket.emit('nuevoJugador',{id:this.id});
	};
	this.ini=function(){
		this.socket=io.connect();
		this.id=randomInt(1,10000);
	}
	this.reset=function(){
		this.id=randomInt(1,10000);
	};
	this.enviarPosicion=function(x,y,ang,puntos){
		this.socket.emit('posicion',{"id":this.id,"x":x,"y":y,"ang":ang,"puntos":puntos})
	}
	this.sendClick = function(x,y){
  		this.socket.emit('click',{x:x,y:y});
	};
	this.volverAJugar=function(){
		this.socket.emit('volverAJugar');	
	}
	this.lanzarSocketSrv=function(){
		this.socket.on('coord',function(data){
			this.coord=data;
			game.state.start('Game',true,false,this.coord);
		});
		// this.socket.on('nuevoJugador',function(data){	
		// 	//client.id=data.id;
		// 	this.veg=data.veg;
	 //    	juego.agregarJugador(data.id,data.x,data.y,data.veg);        
		// });
		this.socket.on('faltaUno',function(data){
			console.log('falta uno');
			juego.faltaUno();
		})
		this.socket.on('aJugar',function(data){		    
		    //for(var i = 0; i < Object.keys(data).length; i++){
		    	//client.id=data[i].id;
		    for(var jug in data){
		    	console.log('aJugar: ',data[jug]);
		        juego.agregarJugador(data[jug].id,data[jug].x,data[jug].y,data[jug].veg);
		    };
		});
		this.socket.on('final',function(data){		    
			juego.finJuego(data);
		});
		this.socket.on('reset',function(data){		    
			juego.volverAJugar(data);
		});
		this.socket.on('todos',function(data){
		    console.log('todos: ',data);
		    for(var i = 0; i < data.length; i++){
		    	//client.id=data[i].id;
		        juego.agregarJugador(data[i].id,data[i].x,data[i].y,data[i].veg);
		    }
		});
		this.socket.on('movimiento',function(data){	
		    juego.moverNave(data);        
		});
		this.socket.on('ganador',function(data){	
			juego.finJuego(data.id);
		    //juego.moverNave(data.id,data.x,data.y,data.ang);        
		});
	}
	this.ini();
}




function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}
