console.clear();
console.log('\n\n-: App Started :-');

const express   = require('express');
const heapdump  = require('heapdump');
heapdump.writeSnapshot('./heapdump/my-snapshot.heapsnapshot');
setInterval(() => { console.log(process.memoryUsage());}, 50000000);

const app       = express();

const dns = require('node:dns');

dns.lookup('example.org', (err, address, family) => {
  console.log('address: %j family: IPv%s', address, family);
});
// address: "2606:2800:21f:cb07:6820:80da:af6b:8b2c" family: IPv6



app.use('/', (req, res, next)=>{
    console.log('-: Welcome :-');
    res.send('-: Welcome :-');
    next();
});

console.log('-: App Running :-');
app.listen(3000);