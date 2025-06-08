const users     = {};
const app       = require('express')();
const eventData = new (require('events'))();

app.use(require('helmet')());
app.use(require('cookie-parser')());
app.use(require('csurf')({ cookie: true }));
app.use(require('body-parser').urlencoded({ extended: false }));


eventData.on('hello',(data)=>{
    const cnt   = Object.keys(users).length
    users[cnt]  = data;
    console.log('Event Hello Received : ', data);
});

app.get('/event/hello/:txt',(req, res)=>{
    console.log('Event Hello Emited');
    eventData.emit('hello', req.params.txt);
    res.json('Event Created Successfully!')
});


app.get('/event/data',(req, res)=>{
    res.json(users)
});

app.get('/event/update/:id/:txt',(req, res)=>{
    users[req.params.id]  = req.params.txt;
    res.json(users)
});

app.get('/event/delete/:id',(req, res)=>{
    delete users[req.params.id];
    res.json(users)
});

app.use('/', (req, res)=>{
    res.json('App Created Successfully!')
});

app.listen(3000,()=>{
    console.clear();
    console.log('App created successfully! :)')
})
