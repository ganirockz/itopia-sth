var express = require('express');
var app = express();
var mongojs = require('mongojs');
var dbu = mongojs('itopia', ['users']);
var dbp = mongojs('itopia', ['posts']);
var dbr = mongojs('itopia', ['requests']);
var bodyParser = require('body-parser');
var accountSid = 'ACe88400021b1a16b0ac3c3a2cbf6fd335';
var authToken = '58375d3114ee215cb6363509c0740424';
//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken);
var multer  = require('multer');

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json())

/*Configure the multer.*/

app.use(multer({ dest: './uploads/',
 rename: function (fieldname, filename) {
    return filename+Date.now();
  },
onFileUploadStart: function (file) {
  console.log(file.originalname + ' is starting ...')
},
onFileUploadComplete: function (file) {
  console.log(file.fieldname + ' uploaded to  ' + file.path)
  done=true;
}
}));

app.post('/api/photo',function(req,res){
  if(done==true){
    console.log(req.files);
    res.end("File uploaded.");
  }
});


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

app.post('/sendrequest', function (req, res) {
    console.log(req.body);
    dbr.requests.insert(req.body, function (err, docs) {
      res.json(docs);
    })
});

app.get('/getrequests', function (req, res) {

    dbr.requests.find(function (err, docs) {
      res.json(docs);
    });
});

app.post('/selectReq', function (req, res) {
  console.log(req.body);
  dbu.users.find(req.body).toArray(function (err, results){
    console.log(results);

    client.messages.create({
    	to: results.number,
    	from: "+12512367462",
    	body: "your request has been accepted, please contact mr.ganesh at is ph:9886879073",
    }, function(err, message) {
    	console.log(message);
    });

    });

  })




app.listen(3000);
console.log('hello!, itopia server runing in port 3000');
