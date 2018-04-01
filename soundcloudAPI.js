"use strict"
var http = require('http');
var winston = require('winston');
var Storage = require('./storage.js');
var myLogger = require('./mylogger.js');
const client_id = 'pCNN85KHlpoe5K6ZlysWZBEgLJRcftOd';
const soundclod_api_url= 'http://api.soundcloud.com/tracks/';
//My secretKey
const mysecretKey = 12345678;

// communicate with soundCloud API
class Sound{
    constructor(secretKey) {
        this.secretKey = secretKey;
        this.topBandsList = [];
        this.myLogger = new myLogger();
    }
    get(band, num = 3){
        if(mysecretKey == this.secretKey) {
            http.get(soundclod_api_url + '?client_id=' + client_id + '&q=' + band + '&limit=100', (resp) => {
                let data = '';
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    //if data is empty
                    if(data == "[]"){
                        this.myLogger.error(band +' ,Unknown Band!');
                    }else{
                        //storage data in db
                        var storage = new Storage(band, data);
                        //Bands Likes
                        let counter = 0;
                        JSON.parse(data).forEach((track) => {
                            counter+=track.likes_count;
                        });
                        this.topBandsList.push({band:band, counter:counter});
                        storage.save(num);
                    }
                });
            }).on("error", (err) => {
                //network error
                this.myLogger.error('network Error!');
            });
        }else{
            //key invalid
            this.myLogger.error('invalid Key!');
        }
    }
    topBands(){
        this.topBandsList.sort((a,b) => {
            return a.counter < b.counter;
        });
        return this.topBandsList;
        
    }
}
module.exports = Sound