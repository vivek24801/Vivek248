
const express = require('express');
var bodyParser = require("body-parser");
const bcrypt = require("bcryptjs");
const cors = require("cors");

var User = require("./User");
var Contacts = require("./Contact");
const app = express();
app.use(express.json())
app.use(cors({ credentials: true, origin: true }));


//test route
app.get("/", function (req, res) {
    res.json({message: "welcome !! user"})
});


//signup route
app.post("/signup", async(req, res) => {
    const { email, password, secret } = req.body;
    
    if (!email || !password || !secret) {
        return res.json({ error: "All input fields no provided " });
    }

    try {
        const userExists = await User.findOne({ email: email });
        if(userExists) {
            return res.status(422).json({error:"Email already Exist"});
        }
        else {
            const pass = await password.concat(secret);
            const user = new User({ email, password, secret });
            user.password = bcrypt.hashSync(pass, 10);
            console.log(pass);
            await user.save();
            return res.status(201).json({ message: "User registered Successfully" });
        }
    }
    catch (err) {
        console.log(err);
        return res.json({ error: err});
    }
    
});


//signin route
app.post("/login", async (req, res) => {
    
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ error: "Please enter email & password !" });
    }
    try {
        
    
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(422).json({ error: "Email Does Not Exist" });
        }
        else {
            const secret = user.secret;
            const pass = password.concat(secret);
            const token = user._id.toString();
            const isMatch = bcrypt.compareSync(pass, user.password);
            
            if (!isMatch) {
                console.log(pass);
                console.log(user.password);
                return res.json({ error: "Enter a valid password" });
            }
            else {
                return res.json({
                    email: user.email,
                    Token: token,
                    id:user._id,
                    success:true
                });
                
            }
            
        }
    }
    catch (err) {
        console.log(err);
        return res.json({ error: err});
    }
});


app.post("/getAll", async (req, res) => {

    const { user_id } = req.body;

    try {
    
        const contacts = await Contacts.find({ user_id: user_id });
        if (!contacts) {
            res.json({ message: "You dont have any contacts"})
        }
        else {
            console.log({ contacts });
            console.log(user_id);
            res.json({ contacts });
        }
        
    }
    catch(err) {
        console.log(err);
        return res.json({ error: err});
    }
    
    
});


app.post("/addContact", async (req, res) => {
    const { user_id, name, email, phone } = req.body;
    try {
        if (!email || !phone || !name) {
            return res.json({ error: "All feilds are required" });
        }
        else if (!user_id) {
            return res.json({ error: "You must be logged in to save contact" });
        }
        else {
            const user = await User.findById({ _id: user_id });
            const contact = new Contacts({ user_id , name, email, phone,});
            contact.user_id = user_id;
            await contact.save();
            return res.json({ message: "Contact saved" });
            
        }
    }
    catch (err) {
        console.log(err);
        return res.json({ error: err});
    }
   
});




app.listen(8080,() => console.log('Node Server is running on  port 8080'))