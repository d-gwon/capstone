let express = require('express');
let router = express.Router();

let mysql = require('promise-mysql');
let dbconfig = require('./dbconfig');
let pool = mysql.createPool(dbconfig);

router.get('/',(req,res)=>{
   let user_no = req.query.user_no;
   let sql = `select DATE_FORMAT(timestamp,%H%i%s) from fft where user_no = ?`;

   pool
       .query(sql,[user_no],function (err,rows) {
           res.send(rows);
       })
       .catch(function(err) {
           res.send(err);
       });
});

module.exports = router;
