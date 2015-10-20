/* AYUDA    https://mandrill.zendesk.com/hc/en-us/articles/205582537
            https://mandrillapp.com/api/docs/messages.JSON.html#method=send-template
*/

.controller('sentMailCntrl',function($scope, $http){
  $scope.sendMail = function(){

    console.log($scope.formUser.email);
    
    var mailJSON ={
      "key": "yXbOSbsEdGY5XDGY1G4JMw",
      "template_name": "fts-invitacion",
      "template_content": [
      {
        "name": "",
        "content": ""
      }
      ],
      "message": {
        "html": "",
        "text": "",
        "subject": "",
        "from_email": "no-responder@fosterintalent.com",
        "from_name": "Soporte FTS",
        "to": [
        {
          "email": $scope.formUser.email,
          "name": $scope.formUser.user_name,
          "type": "to"
        }
        ],
        "important": false,
        "track_opens": null,
        "track_clicks": null,
        "auto_text": null,
        "auto_html": null,
        "inline_css": null,
        "url_strip_qs": null,
        "preserve_recipients": null,
        "view_content_link": null,
        "tracking_domain": null,
        "signing_domain": null,
        "return_path_domain": null,
        "global_merge_vars": [
        {
          "name": "user_name",
          "content": $scope.formUser.user_name
        },
        {
          "name": "username",
          "content": $scope.formUser.username
        },
        {
          "name": "password",
          "content": $scope.formUser.password
        },
        {
          "name": "company",
          "content": $scope.formUser.company
        },
        {
          "name": "URLEmpresa",
          "content": $scope.formUser.URLEmpresa
        }
        ]
      },
      "async": false,
      "ip_pool": "Main Pool"
    };

    var apiURL = "https://mandrillapp.com/api/1.0/messages/send-template.json";
    $http.post(apiURL, mailJSON,{
      headers: {

      }}).
    success(function(data, status, headers, config) {
      alert('successful email send.');
      $scope.form={};
      console.log('successful email send.');
      console.log('status: ' + status);
      console.log('data: ' + data);
      console.log('headers: ' + headers);
      console.log('config: ' + config);
    }).error(function(data, status, headers, config) {
      console.log('error sending email.');
      console.log('status: ' + status);
    });


  };
})