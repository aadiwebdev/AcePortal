const express = require('express');
const router =express.Router();
const User = require('../models/user');
const XLSX = require('xlsx');
const workbook = XLSX.readFile('./data/userdetails.xlsx');
const sheet_name_list = workbook.SheetNames;
const dataSource = [];
dataSource.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]));
dataSource.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[1]]));
dataSource.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[2]]));
dataSource.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[3]]));
dataSource.push(XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[4]]));
router.get('/',(req,res,next)=>{
    res.render('index',{userInfo:{name:""}});
});

router.post('/faculty',(req,res,next)=>{
 console.log(req.body);
 console.log(req.body.password);
 res.redirect('/');
});

router.post('/parent',(req,res,next)=>{
    console.log(req.body.name);
    console.log(req.body.password);
    res.redirect('/');
});

router.post('/admin',(req,res,next)=>{
    console.log(req.body.name);
    console.log(req.body.password);
    res.redirect('/');
});
//POST route for updating data
router.post('/student',(req, res, next)=>
{
    console.log(req.body.name+" "+req.body.password);
    if (req.body.name && req.body.password)
     {
         
        User.authenticate(req.body.name, req.body.password,(error, user)=>{
              req.session.userId = user._id;
              return res.redirect('/profile');
          });
     
    } 
});

// GET route after registering
router.get('/profile',(req, res, next)=>{
      User.findById(req.session.userId)
          .exec(function (error, user)
               {
                    if (user === null)
                     {
                       var err = new Error('Not authorized! Go back!');
                       return next(err);
                     }
                    else
                    {
                        const userInfo ={name:user.username,email:user.email,password:user.password};
                   //     console.log(user);
                    //   res.render('main-nav',{userInfo:userInfo});
                       return res.render('index',{userInfo:userInfo,data:dataSource});
                      //('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
                    }
                });
            
         });

// GET for logout logout

router.get('/logout', function (req, res, next) {
     if (req.session)
      {
         // delete session object
         req.session.destroy((err)=>{
             if (err)
             {
               return next(err);
             }
             else
             {
                return res.redirect('/');
             }
         });
      }
 });

module.exports = router;