  $(document).ready(function(){
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
  
      var userProfileSource = $('#user-profile-template').innerHTML,
          userProfileTemplate = Handlebars.compile(userProfileSource),
          userProfilePlaceholder = $('#user-profile');
  
      var oauthSource = $('#oauth-template').innerHTML,
          oauthTemplate = Handlebars.compile(oauthSource),
          oauthPlaceholder = $('#oauth');
  
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
                $('#loggedin').show();
              }
          });
        } else {
            // render initial screen
            $('#login').show();
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
  });