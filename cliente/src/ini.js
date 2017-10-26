var game;
var juego;
var finJuego;

// var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'espacio');

// var juego=new Juego();
// var finJuego=new FinJuego();

// game.state.add('Game',juego);
// game.state.add("FinJuego",finJuego);
//game.state.start('Game');

var cliente;//=new Cliente();

function nombrePartida(){
	var cadena='<div><input id="nombre" type="text" placeholder="Nombre de la partida">';
	cadena=cadena+'<button type="button" id="nombreBtn">Iniciar partida</button></div>';

	$('#partida').append(cadena);
	$('#nombreBtn').on('click',function(){
	  var nombre=$('#nombre').val();
	  $('#nombre').remove();
	  $('#nombreBtn').remove();   
	  cliente=new Cliente(nombre);
	  //cliente.room=nombre;
	  //cliente.lanzarSocketSrv();	  
	  mostrarCanvas();
	});
}

function mostrarCanvas(){
	game = new Phaser.Game(800, 600, Phaser.CANVAS, 'espacio');

	juego=new Juego();
	finJuego=new FinJuego();

	game.state.add('Game',juego);
	game.state.add("FinJuego",finJuego);
}

