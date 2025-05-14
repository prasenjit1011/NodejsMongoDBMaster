console.clear();
console.log('\n\n-: App Started :-');

const express   = require('express');
const heapdump  = require('heapdump');
heapdump.writeSnapshot('./my-snapshot.heapsnapshot');
setInterval(() => { console.log(process.memoryUsage());}, 50000000);

const app       = express();

app.use('/', (req, res, next)=>{
    console.log('-: Welcome :-');
    res.send('-: Welcome :-');
    next();
});

console.log('-: App Running :-');
app.listen(3000);