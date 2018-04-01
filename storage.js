var winston = require('winston');
const MongoClient = require('mongodb').MongoClient;
var dateFormat = require('dateformat');
var myLogger = require('./mylogger.js');
const url = 'mongodb://localhost:27017';
const dbName = 'logs';
//Storage data to db
class Storage{
    constructor(band, soundcloud_response) {
        this.band = band;
        this.data = soundcloud_response;
        this.top = [];
        this.bottom = [];
        this.myLogger = new myLogger();
    }
    save(num){
            // Use connect method to connect to the server
            MongoClient.connect(url, (err, client) => {
                const db = client.db(dbName);
                // Insert some documents
                var now = new Date();
                var time_format = dateFormat(now, `HH:MM dd/mm/yyyy o`);
                db.collection(dbName).insertOne({
                    band: this.band,
                    data: this.data,
                    request_time: time_format
                })
                .then((result) => {
                    this.data = JSON.parse(this.data);
                    var byLikes = this.data.slice(0);
                    byLikes.sort((a,b) => {
                        return a.likes_count - b.likes_count;
                    });
                    this.top = byLikes.slice(Math.max(byLikes.length - num, 1)).reverse();
                    this.bottom = byLikes.slice(0, num).reverse();
                    this.top = this.get_only(this.top);
                    this.bottom = this.get_only(this.bottom);
                    //Top Songs
                    console.log(`${this.band} Top Songs: `);
                    this.myLogger.info(this.top, { "band": this.band });
                    // Worst Songs
                    console.log(`${this.band} Worst Songs: `);
                    this.myLogger.info(this.bottom, { "band": this.band });

                    client.close(result);
                });
            });
    }
    get_only(arr){
        var m = arr.map((item) => {
            return [item.title, item.description, item.likes_count, item.tag_list]
        })
        return m;
    }
}
module.exports = Storage