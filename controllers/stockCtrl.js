const fs            = require("fs");
const { parse }     = require("csv-parse");
const csvParser     = require("csv-parser");
const nodeCache     = require("node-cache");
const myCache       = new nodeCache();
const Stock         = require('../models/stock');
const Balancesheet  = require('../models/balancesheet');
const Transaction   = require('../models/transaction');
const Tradebook     = require('../models/tradebook');
const Tradebookipo  = require('../models/tradebookipo');
const lib           = require("../controllers/library");
    
const apiList       = {
                        tickertape: 'https://quotes-api.tickertape.in/quotes?sids=',//DABU
                        groww: 'https://groww.in/v1/api/charting_service/v2/chart/delayed/exchange/NSE/segment/CASH/',//CAMPUS/all?intervalInDays=3&minimal=true';
                    };

               

exports.getStockList = async (req, res, next) => {
    let cacheSidData        = myCache.get("cacheSidData");
    let cacheApiData        = myCache.get("cacheApiData");
    

    if(cacheSidData !== undefined &&  cacheApiData !== undefined){
        let resData = {"status":201, msg:"LTP fetch from cache successfully!", sidData: cacheSidData, apiData: cacheApiData};
        return res.end(JSON.stringify(resData));
    }
   
    let fields      = { "_id": 0, "sid": 1, "share_name": 1, "qty": 1, "sold_qty": 1, "stock": 1 };
    let sidsData    = await Stock.aggregate([
                                { $sort:{ sid : 1 }},
                                { 
                                    $match: { 
                                        ////qty:{ $gt: 0 }, 
                                        sid: {$ne:null} 
                                    } 
                                },
                                //{ $match: { sid:{ $in:['HAP', 'HUDC', 'DABU', 'ASOK', 'DOLA', 'BION', 'ADAN']}} },
                                { $project: fields }
                            ])
                            .then(data=>{
                                return data;
                            })
                            .catch(err=>console.log(err));
                            //.find({}, fields).limit(3000)
    
    let sids    = sidsData.map(data=>data.sid).toString();
    let sidData = {};
    sidsData.forEach(data=>{
        sidData[data.sid] = {"sid": data.sid, "stock": data.stock, "share_name": data.share_name, "qty": data.qty, "sold_qty": data.sold_qty, "cqty": (data.qty-data.sold_qty)};
    });
    

    let apiUrl = apiList['tickertape']+sids;
    fetch(apiUrl)
            .then(result=>result.json())
            .then(apiData => {
                myCache.set( "cacheSidData", sidData, 300 );
                myCache.set( "cacheApiData", apiData['data'], 300 );
                let resData = {"status":200, msg:"LTP fetch successfully!", sidData:sidData, apiData:apiData['data']};
                return res.end(JSON.stringify(resData));
            })
            .catch(err=>{
                console.log(err);
                let resData = {"status":500, msg:"Internal Server Error!", sidData:[], apiData:[]};
                return res.end(resData);
            });   
}


exports.getNetworth = async (req, res, next) => {

    let balanceData    = await Balancesheet.find().sort({createdAt: "descending"}).limit(300)
                                .then(data=>{
                                    return data;
                                })
                                .catch(err=>console.log(err));
    
    return res.end(JSON.stringify(balanceData));
}

const updBalancesheet = async (todayChange, cmp) => {

    if(todayChange != 0){
        var start = new Date();
        start.setHours(0,0,0,0);
    
        var end = new Date();
        end.setHours(23,59,59,999);
        await Balancesheet
                .updateOne(
                    { createdAt: {$gte: start, $lt: end}}, 
                    { day_status:todayChange, current_share_price:cmp}, 
                    { upsert: true, new: true })
                .then(data=>{   return data;    })
                .catch(err=>console.log(err));
    
    }
}


exports.getTradeData = async (req, res, next) => {
    try{
    let cacheSidData    = myCache.get("cacheSidData");
    let cacheApiData    = myCache.get("cacheApiData");  
    let buyArr          = {};
    let sellArr         = {};
    let ltpArr          = {};
    let currentObj      = {};
    let currentArr      = [];
    let element         = {};
    let stockArr        = {};
    let stockDetails    = {};

    if(cacheSidData === undefined && cacheApiData === undefined){
        let resData = {"status":201, msg:"cacheApiData not found!"};
        return res.end(JSON.stringify(resData));
    }

    let tradebookipo 
        = await Tradebookipo.aggregate([
            { $project: { _id:0, sid:1, qty:1, action:1 } },
            { $group: { _id: { sid: "$sid" }, cnt: { $sum: "$qty"  } } },
            { $sort:{ sid : 1 }},
        ]).then(data=>{
            return data
        }).catch();

    tradebookipo.forEach((val, key)=>{
        buyArr[val._id.sid]         = val.cnt;
        ltpArr[val._id.sid]         = cacheApiData.find(item => item.sid === val._id.sid)?.price;
        stockDetails[val._id.sid]   = cacheApiData.find(item => item.sid === val._id.sid);
        stockArr[val._id.sid]       = cacheSidData[val._id.sid]['stock'];      
    });

    let tradeDetails  
        = await Tradebook.aggregate([
            { $project: { _id:0, sid:1, qty:1, action:1 } },
            // { $match: { sid:{ $in:['REFE', 'HUDC', 'DABU', 'ASOK', 'DOLA', 'BION', 'ADAN']}} },
            { $group: { _id: { sid: "$sid", type: "$action" }, cnt: { $sum: "$qty"  } } },
            
            { $sort:{ sid : 1 }},
            //{ $group: { _id: { sid: "$sid", type: "$action" }, count: { $count: {} } } }
            // {
            //     _id: { day: { $dayOfYear: "$date"}, year: { $year: "$date" } },
            //     totalAmount: { $sum: { $multiply: [ "$price", "$quantity" ] } },
            //     count: { $sum: 1 }
            // }
        ]).then(data=>{
            return data;
        }).catch();

    let tranData = await Tradebook.find().sort({"sid":1}).then(data=>{
        return data;
    }).catch();


    tradeDetails.forEach((val, key)=>{
        
        if(val._id.type === 'Buy'){
            if(buyArr[val._id.sid] !== undefined){
                buyArr[val._id.sid] += val.cnt;
            }
            else{
                buyArr[val._id.sid] = val.cnt;
            }
        }
        
        if(val._id.type === 'Sell'){
            sellArr[val._id.sid] = val.cnt;
        }

        //{ _id: { type: 'Buy' }, cnt: 4 }
        if(cacheSidData[val._id.sid] == undefined || cacheSidData[val._id.sid]['stock'] == undefined){
            console.log('--->>',val);
        }
        else{
            stockDetails[val._id.sid]   = cacheApiData.find(item => item.sid === val._id.sid);
            ltpArr[val._id.sid]         = cacheApiData.find(item => item.sid === val._id.sid)?.price;
            stockArr[val._id.sid]       = cacheSidData[val._id.sid]['stock'];
        }
    });


    let cnt = 0;
    let cmp = 0;
    let currentVal  = 0;   
    let todayChange = 0;
    let iciciStock  = '';
    tradebookipo.forEach((val, key)=>{
        buyArr[val.sid] = val.qty;
    });

    for (const [key, value] of Object.entries(buyArr)) {
        cnt = value;
        if(sellArr[key] !== undefined){
            cnt = value-sellArr[key];
        }

        if(cnt>0){
            currentVal      = ltpArr[key] ? parseInt(ltpArr[key])*cnt : 0;
            cmp             += currentVal;
            if(stockDetails[key]?.change){
                todayChange     += parseInt(stockDetails[key]?.change)*cnt;
            }


            if(stockArr[key] != undefined || stockArr[key] != ''){
                iciciStock  = stockArr[key];
            }
            else{
                iciciStock  = 'NA'
            }
            
            stockTotalChange = cnt*stockDetails[key]?.change;

            currentObj[key] = {qty:cnt, ltp:ltpArr[key], stock:iciciStock, currentVal:currentVal, cmp:cmp};
            currentArr.push({sid:key, stock:iciciStock, qty:cnt, ltp:ltpArr[key], currentVal:currentVal, cmp:cmp, change:stockDetails[key]?.change, stockTotalChange:stockTotalChange, dyChange:stockDetails[key]?.dyChange    });
        }
    }

    updBalancesheet(todayChange, cmp);    
    currentArr.sort( (a,b) => a.stock - b.stock );
    return res.end(JSON.stringify({ cmp:cmp, currentArr:currentArr, todayChange:todayChange}));
    }
    catch(error) {
        console.error(error);
        return res.end(JSON.stringify([45,67]));
    }
}

function weeklydata(apiData){
    let arr2 = [4445];


    let d           = null;
    let d1          = null;
    let d2          = null;
    apiData.forEach((val, key)=>{
        //console.log('Val :: ', val);
    
        d   = new Date(val[0]*1000).getDate()+'/'+new Date(val[0]*1000).getMonth()+'/'+new Date(val[0]*1000).getFullYear();        
        if(d != d1){
            filterData = {};
            arr1    = [];
            apiData.forEach((x,y)=>{
                d2 = new Date(x[0]*1000).getDate()+'/'+new Date(x[0]*1000).getMonth()+'/'+new Date(val[0]*1000).getFullYear();
                if(d == d2){
                    arr1.push(x[1].toFixed(2));
                }
            });
            arr2[d] = {min:Math.min(...arr1), max:Math.max(...arr1)};
            
        }
        d1 = d;
    });;

    return arr2;
}

exports.getShareDetails = async (req, res, next) => {
    ///let data            = undefined;
    let duration        = undefined;
    let interval        = undefined;
    let apiUrl          = undefined;
    let sid             = req.params.sid;
    let shareDetails    = await Stock.find({sid:sid}).limit(300)
                                    .then(data=>{
                                        return data;
                                    })
                                    .catch(err=>console.log(err));


    let transactionDetails  = await Tradebook.find({sid:sid}).sort({created_at: "ascending"}).limit(300)
                                                .then(data=>{
                                                    return data;
                                                })
                                                .catch(err=>console.log(err));

    
    apiUrl          = apiList['tickertape']+sid;
    let ltpPrice    = await fetch(apiUrl)
                        .then((res)=>res.json())
                        .then(async (res)=>{
                            return res['data'][0]['price'];
                        });
    
    if(shareDetails[0].ltp != ltpPrice){
        shareDetails[0].ltp = ltpPrice;
        await Stock.findOneAndUpdate({sid:sid}, {ltp:ltpPrice});
    }

    let code        = shareDetails[0].sid_grow;  
    let arr1        = [];
    let arr2        = [];
    //let weeklyData  = [];
    let d           = null;
    let d1          = null;
    let d2          = null;
    duration        = 'weekly';
    interval        = '1';
    apiUrl          = apiList['groww']+code+'/'+duration+'?intervalInDays='+interval+'&minimal=true';;
    let weeklyData  = await fetch(apiUrl).then(result=>result.json())
                            .then((apiData) => { 
                                let result = new Promise((resolve, reject) => {
                                                apiData['candles'].forEach((val, key)=>{
                                                    d   = new Date(val[0]*1000).getDate()+'/'+new Date(val[0]*1000).getMonth()+'/'+new Date(val[0]*1000).getFullYear();        
                                                    if(d != d1){
                                                        filterData = {};
                                                        arr1    = [];
                                                        apiData['candles'].forEach((x,y)=>{
                                                            d2 = new Date(x[0]*1000).getDate()+'/'+new Date(x[0]*1000).getMonth()+'/'+new Date(val[0]*1000).getFullYear();
                                                            if(d == d2){
                                                                arr1.push(x[1].toFixed(2));
                                                            }
                                                        });
                                                        arr2.push({dtd: val[0], date:d, min:Math.min(...arr1), max:Math.max(...arr1)});
                                                    }
                                                    d1 = d;
                                                });;
                                                resolve(arr2);
                                            });

                                //console.log('XYZ', data);
                                return result;
                            })
                            .catch(err=>{ console.log('Arr2 : Err', err);return []; });


    duration        = '1y';
    interval        = '7';
    apiUrl          = apiList['groww']+code+'/'+duration+'?intervalInDays='+interval+'&minimal=true';;
    let oneYearData = await fetch(apiUrl).then(result=>result.json())
                            .then(apiData => { 
                                if(!apiData['candles']){
                                    return [];
                                }
                                return apiData['candles']; 
                            })
                            .catch(err=>{ return []; });

    duration        = 'all';
    interval        = '365';
    apiUrl          = apiList['groww']+code+'/'+duration+'?intervalInDays='+interval+'&minimal=true';;
    let historyData = await fetch(apiUrl).then(result=>result.json())
                            .then(apiData => { 
                                if(!apiData['candles']){
                                    return [];
                                }
                                return apiData['candles']; 
                            })
                            .catch(err=>{ return []; });


    let data = { 
        rand: parseInt(100*Math.random()), 
        shareDetails:shareDetails[0], 
        transactionDetails:transactionDetails, 
        weeklyData:weeklyData, 
        oneYearData:oneYearData, 
        historyData:historyData 
    };
    return res.end(JSON.stringify(data));

}


exports.updateStockData = async (req, res, next) => {
    let cacheSidData        = myCache.get("cacheSidData");
    let cacheApiData        = myCache.get("cacheApiData");
    
    if(cacheSidData === undefined &&  cacheApiData === undefined){
        let resData = {"status":201, msg:"LTP cache data not found!"};
        return res.end(JSON.stringify(resData));
    }   
}



exports.tradeBook = async (req, res, next) => {
    const tradeBookData = req.file;
    const fileName      = tradeBookData.filename;//ProductData.destination+'/'+

    //const fileName  = 'tradeBook.csv';
    const result    = [];
    const sids      = await lib.sids();//.then(data=>data);
    let sid         = '';
    console.log('-: '+fileName+' :-')

    fs.createReadStream("./public/tradebook/"+fileName)
            //.pipe(csvParser())
            .pipe(parse({ delimiter: ",", from_line: 2, to_line: 4000 }))
            .on("data", (data) => {
                result.push(data);
            })
            .on("end", () => {
                let tradeRows = undefined;
                let arr = undefined;
                
                result.forEach(async (row)=>{
                    sid = sids.find((element)=> element.stock == row[1])?.sid;
                    console.log('=: Sid : ', sid, ' : ', row[1], ' : ', row[0]);

                    arr = {
                            'sid':sid,
                            'date':row[0], 
                            'stock':row[1],  
                            'action':row[2], 
                            'qty':row[3], 
                            'price':row[4], 
                            'tradeValue':row[5], 
                            'orderRef':row[6], 
                            'settlement':row[7], 
                            'segment':row[8], 
                            'DpidClientId':row[9], 
                            'exchange':row[10], 
                            'stt':row[11], 
                            'transactionSebiTurnoverCharges':row[12], 
                            'stampDuty':row[13], 
                            'brokerageServiceTax':row[14], 
                            'brokerageTaxes':row[15]
                        };
                
                    const doc = await Tradebook.updateOne({ orderRef: row[6] }, arr, { upsert: true });
                    //console.log(doc);
                });
                
            })
            .on("error", function (error) {
                console.log(error.message);
            });;
    
    let resData = {"status":201, msg:"Trade data updated successfully!", tda:result};
    console.log('-: Completed :-');
    return res.end(JSON.stringify(resData));
}

exports.updStockParam = async (req, res, next) =>{

    console.log('Id :',req.body);
    // console.log('Id :',req.body.sid);
    // console.log('Name :',req.body.paramName);
    // console.log('Val :',req.body.paramValue);

    let resData = {"status":201, msg:"Trade data updated successfully!"};
    console.log('-: Completed :-');
    return res.end(JSON.stringify(resData));
}
