const { io } = require('../server');
const { TicketControl } = require('../classes/ticket-control');

const ticketControl = new TicketControl();


io.on('connection', (client) => {

    client.on('disconnect', () => {
        console.log('Usuario desconectado');
    });

    client.on('siguienteTicket', (data, callback) => {
        let text = ticketControl.siguienteTicket();
        return callback(text);
    });

    client.emit('estadoActual', {
        actual: ticketControl.getUltimoTicket(),
        ultimos4: ticketControl.getUltimos4()
    });



    client.on('atenderTicket', (data, callback) => {
        if (!data.escritorio) {
            return callback({err:true, msg: 'Debe indicar el escritorio'}, null);
        }
        let ticket = ticketControl.atenderTicket(data.escritorio);
        if (!ticket) {
            return callback(null, { existTicket:false, msg: 'No hay mas tickets pendientes de ser atentidos'});
        }
        client.broadcast.emit('ultimos4', {
            ultimos4: ticketControl.getUltimos4()
        });
        callback(null, { existTicket:true, ticket});
        // actualizar o nofiticar cmabios en los 4 ulitmos
    });
});