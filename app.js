const express = require('express');
const bodyParser = require('body-parser');
const mailchimp =require('@mailchimp/mailchimp_marketing');

mailchimp.setConfig({
    apiKey: "YOUR_API_KEY",
    server: "usX"
});

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
    const list_id = "YOUR_LIST_ID"

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
