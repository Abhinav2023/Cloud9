var express     =       require("express"),
    app         =    express(),
    bodyParser  =   require("body-parser"),
    mongoose    =   require("mongoose"),
    methodOverride= require("method-override");
    
const expressSanitizer = require('express-sanitizer');

mongoose.connect("mongodb://localhost/restful_blog_app",{ useNewUrlParser: true },{ useFindAndModify: false },{ useFindAndDelete: false },{ useFindAndUpdate: false });
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

app.use(expressSanitizer());

var blogSchema=new mongoose.Schema({
    title: String,
    image: String,
    body: String,
    created: {type: Date, default: Date.now}
});
var Blog=mongoose.model("Blog",blogSchema);


app.get("/",function(req,res){
    res.redirect("/blogs");
    
})

app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){
        if(err){
            console.log(err);
        }else{
            res.render("index",{blogs: blogs});
        }
    });
});

app.get("/blogs/new", function(req,res){
    res.render("new");
});

app.post("/blogs",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("new")
        }
        else{
            res.redirect("/blogs")
        }
    })
});

app.get("/blogs/:id", function(req,res){
    Blog.findById(req.params.id, function(err,findBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{blog: findBlog});
        }
    });
});

app.get("/blogs/:id/edit",function(req,res){
    
    Blog.findById(req.params.id, function(err, findBlog){
        if(err){
            console.log(err);
        }
        else{
            res.render("edit",{blog: findBlog})
        }
    });
});

app.put("/blogs/:id",function(req,res){
    req.body.blog.body=req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err,updateblog){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/blogs/" + req.params.id);
        }
    })
});

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            console.log(err)
        }
        else{
            res.redirect("/blogs")
        }
    })
})

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server is listening");
});