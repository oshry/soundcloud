const http = require('http');
const express = require('express');
const bodyParser = require("body-parser");
//My soundcloud API
const soundcloudAPI = require('./soundcloudAPI.js');
var myLogger = require('./mylogger.js');
const bands = ['Arcade Fire', 'Arctic Monkeys', 'Baio', 'Beastie Boys', 'Calexico'];
const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.all('/*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
//Task A
app.post('/soundcloudA', (req, res) => {
    // get secretKey, band
    // The 3 most liked songs
    // The 3 least liked songs
    let soundcloud = new soundcloudAPI(req.body.secretKey);
    soundcloud.get(req.body.band);
    res.send('Done!');
});
//Task B
app.post('/soundcloudB', (req, res) => {
    // The 6 most liked songs
    // The 6 least liked songs
    // Bands order by liked count
    var soundcloud = new soundcloudAPI(req.body.secretKey);
    myLogger = new myLogger();
    var itemsProcessed = 0;
    bands.forEach((band) => {
        soundcloud.get(band, 6);
        itemsProcessed++;
        if(itemsProcessed === bands.length) {
            var intervalId = null;
            var finishAsync = () => {
                if(soundcloud.topBands().length === bands.length) {
                    console.log(`Bands order by liked count: `);
                    myLogger.info(soundcloud.topBands(), { "top": 'all' });
                    clearInterval(intervalId);
                }
            };
            //Show Top Bands
            intervalId = setInterval(finishAsync, 1000);
        }
    });
    res.send('Done!');
});

var server = require('http').createServer(app);
server.listen(8443, () => {
    console.log("server running at http://localhost:8443/")
});
