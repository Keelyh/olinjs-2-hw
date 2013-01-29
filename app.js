
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , mongoose = require('mongoose');

var app = express();

mongoose.connect('localhost', 'test');

var schema = mongoose.Schema({ name: String, color: String, age: Number});
var Cat = mongoose.model('Cat', schema);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});


app
.get('/', routes.index);
app.get('/users', user.list);
app.get('/cats', function (req, res){
  Cat.find().sort('-age').exec(function (err, cats){
    res.render('catlist', {title: 'list of cats', cats: cats});
  });
});


app.get('/cats/new', function (req, res){
  var text = "";
  var possible = "abcdefghijklmnopqrstuvwxyz";
  for( var i=0; i < 5; i++ )
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  var colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'brown','white','black'];
  var randomIndex = Math.floor(Math.random() * colors.length);
  var randomcolor = colors[randomIndex];
  var randomAge = (Math.floor(Math.random() * 20))+1;
  var kitty = new Cat({ name: text, color: randomcolor, age: randomAge});
  kitty.save (function(err){
    if (err)
      return console.log("error", err);
  res.send("Created a new cat");
  console.log(kitty);
  });
});

app.get('/cats/color/:color', function (req, res){
  Cat.find({color: req.params.color}).exec(function(err, Cat){
    res.render('catlist', {title: 'List of Cats', cats:Cat});
  });
});

app.get('/cats/delete/old', function (req, res){
  Cat.find().sort('-age').limit(1).exec(function (err, cats){
    if (err) return console.log("error", err);
    Cat.findOne().where('_id',cats[0]._id).remove();
    res.send("removed kitty");
  });
});


http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
