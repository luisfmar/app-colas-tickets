const fs = require('fs');
const path = require('path');
const dataPath = path.resolve(__dirname, '../data/data.json');

class Ticket {
  constructor (numero, escritorio) {
    this.numero = numero;
    this.escritorio = escritorio;
  }
}

class TicketControl {
  constructor () {
    this.ultimo = 0; // Ultimo ticket
    this.hoy = new Date().getDate();
    this.tickets = [];
    this.ultimos4 = [];

    let data = require(dataPath);
    if (data.hoy === this.hoy) {
      this.ultimo = data.ultimo;
      this.tickets = data.tickets;
      this.ultimos4 = data.ultimos4;
    } else {
      this.reinicarConteo();
    }
  }

  actualizarFichero() {
    let jsonData = {
      ultimo: this.ultimo,
      hoy: this.hoy,
      tickets: this.tickets,
      ultimos4: this.ultimos4
    };
    let jsonDataString = JSON.stringify(jsonData);
    fs.writeFileSync(dataPath, jsonDataString);
  }

  siguienteTicket() {
    this.ultimo += 1;

    let ticket = new Ticket(this.ultimo, null);
    this.tickets.push(ticket);

    this.actualizarFichero();

    return `Ticket ${ this.ultimo }`;
  }

  atenderTicket(escritorio) {
    if(this.tickets && this.tickets.length === 0) {
      return null;
    }
    let ticket = this.tickets.shift(); // elemina el primer elemento del array

    let atenderTicket = new Ticket(ticket.numero, escritorio);

    this.ultimos4.unshift(atenderTicket); // añade al inicio del array

    if (this.ultimos4 && this.ultimos4.length > 4) {
      this.ultimos4.splice(-1,1); // borra el ultimo elemento
    }

    this.actualizarFichero();

    return atenderTicket;
  }

  getUltimoTicket() {
    return `Ticket ${ this.ultimo }`;
  }

  getUltimos4() {
    return this.ultimos4;
  }

  reinicarConteo() {
    this.ultimo = 0;
    this.tickets = [];
    this.ultimos4 = [];
    this.hoy = new Date().getDate();
    this.actualizarFichero();
  }
}


module.exports = {
  TicketControl
}