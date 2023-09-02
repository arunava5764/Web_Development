const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const request=require("request");
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.get("/",function(req,res){
    // https.get("ap")
  res.sendFile(__dirname+"/signUp.html");
});
app.post("/", function(req,res){
    const firstName=req.body.fname;
    const lastName=req.body.lname;
    const email=req.body.email;
    // console.log(firstName,lastName,email);
    const data={
        members: [
            {
                email_address:email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName,
                }
            }
        ]
    };
    const jsonData=JSON.stringify(data);
    const url="https://us21.api.mailchimp.com/3.0/lists/8902162795";
    const options={
        method : "POST",
        auth : "arunava:8947114c329fc2409a0414215357e81f-us21",
    }
    const request= https.request(url,options,function(response){
        if(response.statusCode===200){
            // res.send("Successfully subscribed!");
            res.sendFile(__dirname+"/success.html");
        }
        else{
            // res.send("There was an error with singing up,please try again");
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    });
    // request.write(jsonData);
    request.end();
});
app.post("/failure", function(req,res){
    res.redirect("/");
})
app.listen(process.env.PORT || 3000,function(){
    console.log("Server is running on port 3000!");
  });

//api key
// 8947114c329fc2409a0414215357e81f-us21
//audiance id
// 8902162795