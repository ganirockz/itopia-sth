var express = require('express');
var app = express();
var mongojs = require('mongojs');
var dbu = mongojs('itopia', ['users']);
var dbp = mongojs('itopia', ['posts']);
var bodyParser = require('body-parser');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json())

app.get('/posts', function (req, res){
  console.log('request recieved');
  dbp.posts.find(function (err, docs) {
    console.log(docs);
    res.json(docs);
  });
});

app.post('/posts', function (req, res){
    //console.log(req.body);
    dbp.posts.insert(req.body, function(err, docs){
      res.json(docs);
    });
});

app.post('/signup', function (req, res) {
  dbu.users.insert(req.body, function(err, docs){
    res.json(docs);
  })
});

app.post('/login', function (req, res) {
    console.log(req.body);
    dbu.users.find(req.body).toArray(function(err, results){
    console.log(results); // output all records
    res.json(results);
    });

});


app.listen(3000);
console.log('hello!, itopia server runing in port 3000');
