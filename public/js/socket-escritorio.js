var socket = io();

var searchParams = new URLSearchParams( window.location.search );
if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('El escritorio es necesario');
}

var escritorio = searchParams.get('escritorio');
var label = $('small');
console.log(escritorio);

$('h1').text('Escritorio ' + escritorio );

$('button').on('click', function () {
  socket.on('estadoActual', function (err, data) {
    label.text(estado.actual);
  });
  socket.emit('atenderTicket', {escritorio: escritorio}, function (e, ticket) {
    if (e && e.err) {
      alert(e.msg);
      return;
    }
    if (!ticket.existTicket) {
      alert(ticket.msg);
      label.text(ticket.msg);
      return;
    }
    var text = 'Ticket - ' + ticket.ticket.numero;
    label.text(text);
  });
});


