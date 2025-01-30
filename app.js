console.clear();
console.log('\n\n-: App Started :-');

const express   = require('express');
const Item      = require('./models/item');
const cron      = require('node-cron');
const app       = express();

// Schedule a task to run every minute
cron.schedule('* * * * *', () => {
    var dtd = new Date();
    console.log('This task runs every minute ' + dtd.getHours()+'/'+dtd.getMinutes()+ ' / '+dtd.getSeconds());
});

app.use('/', async (req, res, next)=>{
    console.log('-: Welcome :-');

    await Item.create({"title":"Sanjay "+parseInt(100*Math.random())});

    Item.findAll({raw:true})
        .then(fetchData=>{
            console.log(fetchData)
            //return res.render('./article/list', {pageNo : pageNo, data:fetchData, pageTitle:'Item list using Asyn method with Mysql Sequelize.'});
        })
        .catch(err=>{
            console.log(err);
            return res.redirect('/');
        });


    res.send('-: Welcome :-');
    //res.render('home', {sessionData:req.session});
});


app.listen(3500);

console.log('-: App Running ::-');

