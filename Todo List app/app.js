const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const _=require("lodash");
const date=require(__dirname+"/date.js");
const app=express();
var items=["Buy Food","Cook Food","Eat Food"];
workItems=[];
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
mongoose.connect('mongodb+srv://arunava5764:9gp5XVXFZ5m56mgB@cluster0.bt6g7g3.mongodb.net/todolistDB')
.then(() => console.log("Connected"))
.catch(err => console.log(err));
app.set('view engine', 'ejs');
const itemsSchema={
    name:String,
};
const Item=mongoose.model("Item",itemsSchema);
const item1=new Item({
    name:"Welcome to your todolist." 
});
const item2=new Item({
    name:"Hit the + button to add a new item." 
});
const item3=new Item({
    name:"<-- Hit this to delete an item." 
});
const defaultItems=[item1,item2,item3];
const listSchema = {
    name: String,
    items: [itemsSchema],
};
const List=mongoose.model("List",listSchema);
// Item.insertMany(defaultItems);
app.get("/",function(req,res){
//   res.send("Hello");
//   let day=date.getDate();
  Item.find().then((foundItems)=>{
    if(foundItems.length===0){
        Item.insertMany(defaultItems);
        res.redirect("/");
    }else{
        res.render("list",{listTitle: "Today", newListItem: foundItems});
    }
    // console.log(foundItems);
    
  });
});

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    List.findOne({name: customListName}).then((foundList)=>{
        if(foundList){
            // console.log("exist!");
            res.render("list",{listTitle: foundList.name, newListItem: foundList.items});
        }
        else{
            // console.log("Doesn't Exists!");
            const list=new List({
                name: customListName,
                items: defaultItems,
            });
            list.save();
            res.redirect("/"+customListName);
        }
    });
});

app.post("/",function(req,res){
    // console.log(req.body.newItem);
    // var item=req.body.newItem;
    // if(req.body.list==="Work"){
    //     workItems.push(item);
    //     res.redirect("/work");
    // }else{
    //     items.push(item);
    //     res.redirect("/");
    // }
    const itemName=req.body.newItem;
    const listName= req.body.list;
    const item=new Item({
        name:itemName,
    });
    if (listName==="Today"){
        item.save();
        res.redirect("/");
    }
    else{
        List.findOne({name: listName}).then((foundList)=>{
            foundList.items.push(item);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});
// app.get("/work",function(req,res){
//     res.render("list",{listTitle:"Work List",newListItem:workItems});
// });
// app.post("/work",function(req,res){
//     let item=req.body.newItem;
//     workItems.push(item);
//     res.redirect("/work");
// });
app.post("/delete",function(req,res){
    // res.render("about");
    const checkedItemId= req.body.checkbox;
    const listName=req.body.listName;
    // console.log(checkedItemId);
    if(listName==="Today"){
        Item.findByIdAndRemove(checkedItemId).then((err)=>{
            res.redirect("/");
        });
    }
    else{
        List.findOneAndUpdate({name: listName},{$pull:{items:{_id:checkedItemId}}}).then((foundList)=>{
            res.redirect("/"+listName);
        });
    }
    
});

app.get("/about",function(req,res){
    res.render("about");
});
let port = process.env.PORT;
if(port==null || port==""){
    port=3000;
}

app.listen(port,function(){
    console.log("Server is running successfully!");
});