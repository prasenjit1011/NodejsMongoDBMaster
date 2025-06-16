

const promiseThen = new Promise((resolve, reject) => {
    // Resolve or Reject will be call depend on fetch data
    // Resolve or Reject can be call only once

    let url = 'https://quotes-api.tickertape.in/quotes?sids=ESAF';
    fetch(url)
        .then(res=>res.json())
        .then(result=>resolve(result))
        .catch(err=>reject("-: Sorry, Data not found :-"));
});


module.exports = promiseThen;

/*
promiseThen
    .then((val) => {
        console.log(val);
    })
    .catch((err) => console.log(err));
*/