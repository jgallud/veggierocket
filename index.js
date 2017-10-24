var fs=require("fs");
var express = require('express');
var app = express();

var server = require('http').Server(app);
var io = require('socket.io').listen(server);

var modelo=require('./server/modelo.js');
var juego=new modelo.Juego();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {
 	var contenido=fs.readFileSync("./cliente/views/index.html");    
	response.setHeader("Content-type","text/html");
	response.send(contenido);  
});

// app.get('/reset', function(request, response) {
//     //juego=new modelo.Juego();    
//     juego.reset(io.sockets[0]);
//     //io.sockets.emit('reset');
//     response.redirect('/');
// });


server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


io.on('connection',function(socket){
    socket.on('configuracion',function(){
        juego.iniciar(socket);
    });
    socket.on('nuevoJugador',function(data){        
        juego.agregarJugador(data.id,socket);
    });
    socket.on('posicion',function(data){
       juego.movimiento(data,socket);
    });
    socket.on('volverAJugar',function(data){
        //juego=new modelo.Juego();
        juego.volverAJugar(socket);
    });

});

