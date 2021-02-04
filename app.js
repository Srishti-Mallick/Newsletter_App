const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');
const mailchimp =require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
    apiKey: "afb9baa59da65668c12539ba4059f74c-us7",
    server: "us7"
});

// async function run() {
//   const response = await mailchimp.ping.get();
//   console.log(response);
// }

// run();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html");
})

app.post("/", function(req, res){
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const list_id = "781242792f"

    const run = async () => {
    const response = await mailchimp.lists.batchListMembers(list_id, {
        members: [
            {
                "email_address": email,
                "status": "subscribed",
                "merge_fields": {
                    "FNAME": firstName,
                    "LNAME": lastName
                }
            }
        ],
    });
    if(response.errors.length == 0){
        res.sendFile(__dirname+"/success.html");
    }else{
        res.sendFile(__dirname+"/failure.html");
    }
    };

    run();
});

app.post("/failure", function(req, res){
    res.redirect("/");
})

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is up and running");
})

//API key
//afb9baa59da65668c12539ba4059f74c-us7

//List ID
//781242792f