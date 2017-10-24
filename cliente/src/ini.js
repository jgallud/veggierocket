var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'espacio');

var juego=new Juego();
var finJuego=new FinJuego();

game.state.add('Game',juego);
game.state.add("FinJuego",finJuego);
//game.state.start('Game');

var cliente=new Cliente();

cliente.lanzarSocketSrv();
cliente.cargarConfiguracion();