var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var cors = require('cors');
var querystring = require('querystring');
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
const usuarioArch = require('fs');
var archivo = "usuario.json";

var client_id = '446da07572e0461086601220e6d68fa6'; // Your client id
var client_secret = '2cb78183ba23436ca1c1609951210a68'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

//----------------------BD HANDLER-----------------------
var db = {
  //Indicar BD o abrir conexion
  initDB: function () {
      var fs = require("fs");
      var contents = fs.readFileSync(archivo);
      this.usuario = JSON.parse(contents);
      console.log(this.usuario);
  },
  saveUsuario : function(){
    //console.log(this.usuario);
    usuarioArch.writeFileSync(archivo, JSON.stringify(this.usuario),
      function (error) {
          if (error) {
              console.log('Hubo un error al escribir en el archivo')
              console.log(error);
          }
      });
  }
  
}
//db.initDB();
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = 'spotify_auth_state';

var app = express();

app.use(express.static(__dirname + '/public'))
   .use(cors())
   .use(cookieParser());

app.get('/login', function(req, res) {
  console.log("I'm at login");
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
 console.log(state);
  // your application requests authorization
  try{
  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state,
      show_dialog: true
    }));
    console.log('i got till the end');
  }catch(error){
    console.log(error);
  }
});
/*app.get('/playlists', function(req,res){
  res.clearCookie(stateKey);
  var code = req.query.code;
    
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;
  var scope = 'playlist-read-private';
  res.redirect('https://api.spotify.com/v1/me/playlists?' +
    querystring.stringify({
      access_token: access_token,
      token_type: 'Bearer',
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
   }))}
});
//console.log(res.body);
});*/
/*app.get('/playlists', function(req,res){
  console.log(req);
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    console.log("oops there's a problem");
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
  var token = ''; 
  request.get(options, function(error, response, body) {
    console.log(body);
    token = access_token;
  });  
  
  var state = generateRandomString(16);
  res.cookie(stateKey, state);
  // your application requests authorization
  var scope = 'playlist-read-private';
  res.redirect('https://api.spotify.com/v1/me/playlists?' +
    querystring.stringify({
      access_token: token,
      token_type: 'Bearer',
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
   }));
  }
  console.log("res body upper");
console.log(res.body);
});
*/
app.get('/callback', function(req, res) {

  // your application requests refresh and access tokens
  // after checking the state parameter
console.log('im at callback ' + req);
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    console.log("oops there's a problem");
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
          db.initDB();
          db.usuario.push(body);
          //db.usuario = body;
          console.log(db.usuario);
          db.saveUsuario();
          res.json({'status' : 'OK'});
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
});

app.route("/usuarios")
  .get( (req, res) => {
    db.initDB();
    res.json(db.usuario);
  });

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

console.log('Listening on 8888');
app.listen(8888);
