/* AYUDA    https://mandrill.zendesk.com/hc/en-us/articles/205582537
            https://mandrillapp.com/api/docs/messages.JSON.html#method=send-template
*/

.controller('sentMailCntrl',function($scope, $http){
  $scope.sendMail = function(a){
    console.log(a.toEmail);
    
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
                "email": "{{email}}"+a.toEmail,
                "name": "{{user_name}}"+a.user_name,
                "type": "to"
            }
            ],
            "headers": {
                "Reply-To": ""
            },
            "important": false,
            "track_opens": null,
            "track_clicks": null,
            "auto_text": null,
            "auto_html": null,
            "inline_css": null,
            "url_strip_qs": null,
            "preserve_recipients": null,
            "view_content_link": null,
            "bcc_address": "",
            "tracking_domain": null,
            "signing_domain": null,
            "return_path_domain": null,
            "merge": true,
            "merge_language": "mailchimp",
            "global_merge_vars": [
            {
                "name": "user_name",
                "content": "{{user_name}}"
            }
            {
                "name": "username",
                "content": "{{username}}"
            }
            {
                "name": "password",
                "content": "{{password}}"
            }
            {
                "name": "email",
                "content": "{{email}}"
            }
            {
                "name": "company",
                "content": "{{company}}"
            }
            {
                "name": "URLEmpresa",
                "content": "{{URLEmpresa}}"
            },
            ],
            "merge_vars": [
            {
                "rcpt": "",
                "vars": [
                {
                    "name": "",
                    "content": ""
                }
                ]
            }
            ],
            "tags": [
            "password-resets"
            ],
            "subaccount": "",
            "google_analytics_domains": [
            "fosteringtalent.com"
            ],
            "google_analytics_campaign": "message.from_fts",
            "metadata": {
                "website": "www.fosteringtalent.com"
            },
            "recipient_metadata": [
            {
                "rcpt": "{{email}}",
                "values": {
                    "user_id": {{user_id}}
                }
            }
            ],
            "attachments": [
            {
                "type": "text/plain",
                "name": "",
                "content": ""
            }
            ],
            "images": [
            {
                "type": "image/png",
                "name": "",
                "content": ""
            }
            ]
        },
        "async": false,
        "ip_pool": "Main Pool",
        "send_at": ""
    };

    var apiURL = "https://mandrillapp.com/api/1.0/messages/send-template.json";
    $http.post(apiURL, mailJSON).
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
}
})