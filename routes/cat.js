

exports.list = function(req, res){
  res.send("respond with a resource");
};

exports.listing = function (req, res){
  Cat.find().sort('-age').exec(function (err, cats){
    res.render('catlist', {title: 'list of cats', cats: cats});
  });
};


exports.newcat = function (req, res){
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
};