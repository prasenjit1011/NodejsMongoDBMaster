console.clear();
console.log('\n\n-: App Started :-');

const express   = require('express');
const app       = express();



const EventEmitter = require('./eventEmitter');
const emitter = new EventEmitter();

function greet(name) {
  console.log(`Hello123, ${name}`);
}

emitter.on('sayHi', greet);
emitter.emit('sayHi', 'Prasenjit'); // Hello, Prasenjit

emitter.off('sayHi', greet);
emitter.emit('sayHi', 'Dev1'); // Nothing happens

emitter.once('onlyOnce', (msg) => console.log('Once:', msg));
emitter.emit('onlyOnce', 'first call'); // Once: first call
emitter.emit('onlyOnce', 'second call'); // Nothing




// app.js
const MyClass = require('./myClass');

const person = new MyClass('Prasenjit');
person.greet(); // Hello, Prasenjit!

person.setName('Aluni');
console.log(person.getName()); // Aluni
person.greet(); // Hello, Aluni!




console.log('-: App Running :-');
app.listen(3000);