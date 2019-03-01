      (function() {
        getUsuarios();
        /**
         * Obtains parameters from the hash of the URL
         * @return Object
         */
        function getHashParams() {
          var hashParams = {};
          var e, r = /([^&;=]+)=?([^&;]*)/g,
              q = window.location.hash.substring(1);
              console.log("this is the window location hash: "+ q);
          while ( e = r.exec(q)) {
             hashParams[e[1]] = decodeURIComponent(e[2]);
          }
          return hashParams;
        }

        /*function getPlaylists(){
          $.get('http://localhost:8888/playlists',function(data){
            console.log("PLAYLISTSSSSS");
            console.log(data);
          });
        }

        getPlaylists();*/
        var userProfileSource = document.getElementById('user-profile-template').innerHTML,
            userProfileTemplate = Handlebars.compile(userProfileSource),
            userProfilePlaceholder = document.getElementById('user-profile');

        var oauthSource = document.getElementById('oauth-template').innerHTML,
            oauthTemplate = Handlebars.compile(oauthSource),
            oauthPlaceholder = document.getElementById('oauth');

        var params = getHashParams();

        var access_token = params.access_token,
            refresh_token = params.refresh_token,
            error = params.error;

        if (error) {
          alert('There was an error during the authentication');
        } else {
          if (access_token) {
            console.log("This is the access token: " + access_token);
            // render oauth info
            oauthPlaceholder.innerHTML = oauthTemplate({
              access_token: access_token,
              refresh_token: refresh_token
            });

            $.ajax({
                url: 'https://api.spotify.com/v1/me',
                headers: {
                  'Authorization': 'Bearer ' + access_token
                },
                success: function(response) {
                  userProfilePlaceholder.innerHTML = userProfileTemplate(response);

                  $('#login').hide();
                  $('#loginbody').hide();
                  $('#loggedin').show();
                }
            });
          } else {
              // render initial screen
              $('#login').show();
              $('#loginbody').show();
              $('#loggedin').hide();
          }

          document.getElementById('obtain-new-token').addEventListener('click', function() {
            $.ajax({
              url: '/refresh_token',
              data: {
                'refresh_token': refresh_token
              }
            }).done(function(data) {
              access_token = data.access_token;
              oauthPlaceholder.innerHTML = oauthTemplate({
                access_token: access_token,
                refresh_token: refresh_token
              });
            });
          }, false);
        }
      })();

      function getUsuarios(){
        //LLamada GET para obtener los alumnos
        //Se muestra resultado con una lista en HTML
        //Se utiliza un ciclo for y se genera el codigo HTML
        //Usando Jquery se coloca el HTML en la lista.
        $.get("http://localhost:8888/usuarios", function(data){
            var listHTML = "";
            console.log(data);
            data.forEach(usuario => {
                listHTML += "<br><li class='list-group-item'>" + 
                "<p class='text-monospace text-dark'> Usuario: <strong class='text-success'>" + usuario.display_name + "</strong> <img class='rounded float-left' width='70' src='"+ usuario.images[0].url + "' />"+
                " Cuenta: <strong class='text-success'>" + usuario.product + " </strong></p> </li>";
            });
            $("#lista-usuarios").html(listHTML);
        });
      }