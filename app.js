const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");


const app = express();

// let items = ["Study","Eat","Sleep","Repeat"];
// let workItems = [];

mongoose.connect("mongodb+srv://anup1221:anup1221@cluster0.9lcafrz.mongodb.net/todoListDB");

app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine', 'ejs'); 

const itemSchema = {
    name:{
        type: String,
        required: true
    }
};

const Item = mongoose.model("Item",itemSchema);

const item1 = new Item({
    name:"welcome to your ToDoList!"
});
const item2 = new Item({
    name:"hit + button to add a new item."
});
const item3 = new Item({
    name:"<-- hit this to delete item."
});

const defaultItems = [item1,item2,item3];

const listSchema = {
    name: String,
    items : [itemSchema]
}

const List = new mongoose.model("List",listSchema);


app.get("/",function(req,res){
    
    let day = date.getDate();
    
    Item.find({}).then(function(foundItems){
        if(foundItems.length===0){
            Item.insertMany(defaultItems).then(function(){
                console.log("insertion done!");
            }).catch(function(err){
                console.log(err);
            });

            res.redirect("/");
        }else{
            res.render("list",{listTitle: day , newListItems:foundItems});
        }

        
    }).catch(function(err){
        console.log(err);
    });

    
});


app.post("/",function(req,res){

    const itemName = req.body.newItem;
    const listName = req.body.list;

    const item = new Item({
        name: itemName
    });


    item.save();
    res.redirect("/");




    let today = date.getDate();

    // if(itemName!== ""){

    // if(listName === today){
    //     item.save();

    //     res.redirect("/");
    // }else{
    //     List.findOne({name: listName}).then(function(foundList){
    //         foundList.items.push(item);
    //         foundList.save();
    //         res.redirect("/" + listName);   
    //     })
    // }
    
    // }
   

    // let item = req.body.newItem;

    // if(req.body.list==="work"){
    //     workItems.push(item);
    //     res.redirect("/work");
    // }else{
    //     items.push(item);
    //     res.redirect("/");
    // }
})

app.post("/delete",function(req,res){
   const checkItemId =  req.body.checkbox;





   Item.findByIdAndDelete(checkItemId).then(function(){
    console.log("successfully deleted the checked item!");
   }).catch(function(err){
    console.log(err);
   });

   res.redirect("/");
});

// app.get("/work",function(req,res){
//     res.render("list",{listTitle:"work List",newListItem:workItems})
// })

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    

    List.findOne({name:customListName}).then(function(foundList){
        if(!foundList){
            //creating new list
            const list = new List({
                name: customListName,
                item: [defaultItems]
            });
        
            list.save();
            res.render("/"+ customListName);
        }else{
            //show an existing file
            res.render("list",{listTitle: foundList.name , newListItems: foundList.name})
        }
    }).catch(function(err){
        console.log(err);
    })
    
    
});


app.get("/about",function(req,res){
    res.render("about");
});


app.listen(3000,function(){
    console.log("Server started on port 3000");
});