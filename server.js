var express = require('express');
var app = express();
var mongojs = require('mongojs');
var db = mongojs('itopiaDB', ['itopiaDB']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json())
app.get('/itopia', function (req, res){
  console.log('request recieved');
  db.itopiaDB.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/itopia', function (req, res){
    //console.log(req.body);
    db.itopiaDB.insert(req.body, function(err, docs){
      res.json(docs);
    });
});


app.listen(3000);
console.log('hello!, itopia server runing in port 3000');
