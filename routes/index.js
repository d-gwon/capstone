let express = require('express');
let router = express.Router();
let dateFormat = require('dateformat');

let date = require('date-and-time');

let now;
// const addSubtractDate = require("add-subtract-date");

// let mysqul = require('mysql');
// let connection = mysqul.createConnection({
//     host    :'localhost',
//     user    :'root',
//     password:'1234',
//     database:'boardDB'
// });

//as
let mysqlPro = require('promise-mysql');
mysql      = require('mysql');
let dbconfig =
    require('./dbconfig');
//     {
//     host     : 'localhost',
//     user     : 'root',
//     password : '1234',
//     database : 'boardDB'
// };
let pool = mysqlPro.createPool(dbconfig);

/* GET database */
// router.get('/',function(req, res, next){
//     let sql = 'SELECT * FROM boardDB.fft:';
//     connection.query(sql, function(error, results, fields){
//         if(error) throw error;

//         console.log(results);
//         res.send(results);
//     });
// });

router.get('/', function(req, res) {
    let sql = 'SELECT * from fft';
    console.log('1');
    pool
        .query(sql)
        .then(function(rows){
            res.send(rows)
        })
        .catch(function (error) {
            console.log(error);
            res.status(500).send(error)
        })

});


router.get('/fft', function(req, res) {
    let sql = 'SELECT DATE_FORMAT(timestamp,"%H-%i-%s") "timestamp", x_amp ,y_amp,z_amp from fft order by timestamp';

    console.log('amp>200!!');
    pool
        .query(sql)
        .then(function(rows){
            console.log(rows);
            res.send(rows)

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        })
});

router.get('/count', function(req, res) {
    // let arr[] = ["count":]
    let date = req.query.date;
    let user_no = req.query.user_no;
    let day=dateFormat(date, "yyyy-mm-dd");
    // let sql = `
    //     SELECT
    //         COUNT(fft_no) "count", DATE_FORMAT(timestamp, '%Y-%m-%d %H') m
    //     FROM
    //         fft
    //     WHERE
    //         user_no=? and
    //         (DATE_FORMAT(timestamp, '%Y-%m-%d') = ?)
    //             AND ((x_hz BETWEEN 0 AND 6)
    //             OR (y_hz BETWEEN 1 AND 6)
    //             OR (z_hz BETWEEN 1 AND 6))
    //     GROUP BY m
    //     order by m asc
    // `;


    let sql = `
        SELECT 
    DATE_FORMAT(a.timestamp, '%Y-%m-%d %H') m, (select count(fft_no) from fft b WHERE
            m = DATE_FORMAT(b.timestamp, '%Y-%m-%d %H') and
            b.user_no=(?)a 
                AND ((b.x_hz BETWEEN 0 AND 6)
                OR (b.y_hz BETWEEN 1 AND 6)
                OR (b.z_hz BETWEEN 1 AND 6))) "count"
FROM
    fft a
    
    GROUP BY m`;


    // `SELECT count(fft_no) "count",DATE_FORMAT(timestamp,'%Y-%m-%d %h-%i') m from fft where (x_hz BETWEEN 4 AND 6)
    //             OR (y_hz BETWEEN 4 AND 6) OR (z_hz BETWEEN 4 AND 6)
    //             group by m`


    console.log('count~');
    pool
        .query(sql,[user_no,day])
        .then(function(rows){
            console.log(rows);
            res.send(rows)

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        })

});

router.get('/calendar',function (req, res) {
    // let arr[] = ["count":]
    let date = req.query.date;
    let user_no = req.query.user_no;
    let day=dateFormat(date, "yyyy-mm-dd");



    let sql = `
    select * from

(select * from 
(select adddate('1970-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) selected_date from
 (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t0,
 (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t1,
 (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t2,
 (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t3,
 (select 0 i union select 1 union select 2 union select 3 union select 4 union select 5 union select 6 union select 7 union select 8 union select 9) t4) v
where selected_date between '${date}' and LAST_DAY('${date}')) x
left join
(select a.m 'm', a.avg -b.avg 'sub',c.cnt '1',d.cnt '2'
from 
(SELECT DATE_FORMAT(timestamp, '%Y-%m-%d') m, 
sum(\`x_amp\`)/count(\`x_amp\`) 'avg' 
FROM \`fft\` 
WHERE DATE_FORMAT(timestamp,'%Y-%m') = DATE_FORMAT(?,'%Y-%m')
group by m) a, 
(SELECT 
sum(\`x_amp\`)/count(\`x_amp\`) 'avg' 
FROM \`fft\` 
WHERE DATE_FORMAT(timestamp,'%Y-%m') = DATE_FORMAT( DATE_ADD( ?, INTERVAL -1 
MONTH ) ,  '%Y-%m' )
) b,

(SELECT DATE_FORMAT(timestamp, '%Y-%m-%d') m, 
count(\`x_hz\`) 'cnt'
FROM \`fft\` 
WHERE DATE_FORMAT(timestamp,'%Y-%m') = DATE_FORMAT(?,'%Y-%m')
AND ((x_hz BETWEEN 0 AND 6)
                OR (y_hz BETWEEN 1 AND 6)
                OR (z_hz BETWEEN 1 AND 6))
group by m) c, 
(SELECT 
count(fft_no) 'cnt'
FROM \`fft\` 
WHERE DATE_FORMAT(timestamp,'%Y-%m') = DATE_FORMAT( DATE_ADD( ?, INTERVAL -1 
MONTH ) ,  '%Y-%m' )
AND ((x_hz BETWEEN 0 AND 6)
                OR (y_hz BETWEEN 1 AND 6)
                OR (z_hz BETWEEN 1 AND 6))
) d


where a.m= c.m  
 ) y on  y.m = x.selected_date order by x.selected_date
    `


    // `SELECT count(fft_no) "count",DATE_FORMAT(timestamp,'%Y-%m-%d %h-%i') m from fft where (x_hz BETWEEN 4 AND 6)
    //             OR (y_hz BETWEEN 4 AND 6) OR (z_hz BETWEEN 4 AND 6)
    //             group by m`


    pool
        .query(sql,[date,date,date,date])
        .then(function(rows){
            console.log(rows);
            res.send(rows)

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        })
});

router.get('/date', function(req, res){
    let now = new Date();
   // let nowDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');

    console.log(now);
    //num=1;

    res.send(now);

});

//연습
// router.get('/date', function(req, res, next){
//    now = new Date();
//     //let nowDate = date.format(now, 'YYYY-MM-DD HH:mm:ss');
//     let nowDate;
//
//     // console.log('whatthefuCk')
//     // console.log(now);
//     num=20;
//     let now2 = "2018-04-10T10:57:43.620Z";
//
//     let da = new Date(now2);
//     console.log('what')
//     console.log(da);
//     nowDate = date.addMinutes(now, 3);
//     nowDate = date.format(nowDate, 'YYYY-MM-DD HH:mm:ss');
//     console.log('test');
//     console.log(nowDate);
//
//     res.send(nowDate);
//
// });

router.post('/data', function(req, res){
    let d;
    let nowDate;
    let currentDate;
    let time = req.body.time;
    //let time = "2018-04-10T17:38:58.731Z";
   // let time = now.getTime();
    console.log('adadff');
    console.log(time);
    d = new Date(time);
    let numOfDataSent = req.body.numOfDataSent;
    let data = req.body.data;
    let user_no = req.body.user_no;
    let arr=[];
    let sql = `insert into fft ( timestamp, x_hz, x_amp, y_hz, y_amp, z_hz, z_amp,user_no ) values (?,?,?,?,?,?,?,?)`;

    for(let i =1 ; i<data.length;i++){
        sql = sql + `,(?,?,?,?,?,?,?,?)`
    }
    for(let i =0 ; i<data.length;i++){
        console.log('date');

//        nowDate = date.addMinutes(d, i);
        nowDate = date.addMinutes(d, numOfDataSent);

        currentDate = date.format(nowDate, 'YYYY-MM-DD HH:mm:ss');

        console.log(currentDate);
        arr.push(currentDate);
        arr.push(data[i].x_hz);
        arr.push(data[i].x_amp);
        arr.push(data[i].y_hz);
        arr.push(data[i].y_amp);
        arr.push(data[i].z_hz);
        arr.push(data[i].z_amp);
        arr.push(user_no);

        numOfDataSent++;
    }

    pool
        .query(sql,arr)
        .then(function(rows){
            console.log(rows);
            res.send(rows)

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        })

});


// router.post('/data', function(req, res, next){
//
//     let data = req.body.data;
//     let user_no = req.body.user_no;
//     let arr=[]
//     let sql = `insert into fft ( timestamp, x_hz, x_amp, y_hz, y_amp, z_hz, z_amp,user_no ) values (?,?,?,?,?,?,?,?)`
//
//     for(let i =1 ; i<data.length;i++){
//         sql = sql + `,(?,?,?,?,?,?,?,?)`
//     }
//     for(let i =0 ; i<data.length;i++){
//         arr.push(data[i].time);
//         arr.push(data[i].x_hz);
//         arr.push(data[i].x_amp);
//         arr.push(data[i].y_hz);
//         arr.push(data[i].y_amp);
//         arr.push(data[i].z_hz);
//         arr.push(data[i].z_amp);
//         arr.push(user_no);
//     }
//
//     pool
//         .query(sql,arr)
//         .then(function(rows){
//             console.log(rows);
//             res.send(rows)
//
//         })
//         .catch(function(error){
//             console.log(error)
//             res.status(500).send(error)
//         })
//
// });




/*
router.post('/',function(req, res, next){
    let timestamp = req.body.timestamp;
    let x_hz =  req.body.x_hz;
    let y_hz =  req.body.y_hz;
    let z_hz =  req.body.z_hz;
    let x_amp = req.body.x_amp;
    let y_amp = req.body.y_amp;
    let z_amp = req.body.z_amp;


    let sql = 'SELECT * FROM boardDB.fft:';
    connection.query(sql, function(error, results, fields){
        if(error) throw error;
        res.send(results);
    });
});
*/

/* GET home page. */
// router.get('/', function(req, res, next) {
//   console.log('1')
//   res.send({ name: "myeonghuSong and Joseph" });
//
// });
//
router.post('/test', (req, res)=> {
    console.log(req.body);
    res.send(req.body);
});


router.post('/login', (req, res)=>{
    console.log('login');
    let password = req.body.password;

    let sql = 'select type, user_no from user where password = (?)';

    pool
        .query(sql,[password])
        .then(function(rows){
            console.log(rows);
            res.send(rows)

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        })


});



router.post('/patient', (req, res) =>{

    let user_no = req.body.user_no;
    let sql = 'select * from fft where user_no = (?)';

    pool
        .query(sql,[user_no])
        .then(function(rows){
            console.log(rows);
            res.send(rows)

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        })

});


router.post('/patient/info', (req, res) =>{

    let user_no = req.body.user_no;
    let sql = 'select * from user where user_no = (?)';

    pool
        .query(sql,[user_no])
        .then(function(rows){
            console.log(rows);
            res.send(rows)

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        })

});


router.get('/researcher', (req,res) =>{

    //let user_no = req.body.user_no;
    let sql = 'select * from user';

    pool
        .query(sql)
        .then(function(rows){
            console.log(rows);
            res.send(rows)

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        })

});

router.post('/sum', (req,res) =>{

    let user_no = req.body.user_no;
    let sql = `select count(fft_no) 'sum' from fft WHERE
            DATE_FORMAT(timestamp, '%Y-%m-%d %H') and
            user_no=(?) 
                AND ((x_hz BETWEEN 0 AND 6)
                OR (y_hz BETWEEN 1 AND 6)
                OR (z_hz BETWEEN 1 AND 6))`

    pool
        .query(sql,[user_no])
        .then(function(rows){
            console.log(rows);
            res.send(rows);

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        });

});


router.post('/average', (req,res) =>{

    let user_no = req.body.user_no;
    let sql = `select sum(x_amp) /count(fft_no) "avg" from fft WHERE
            DATE_FORMAT(timestamp, '%Y-%m-%d %H') and
            user_no=(?) 
                AND (x_hz BETWEEN 4 AND 6)`

    pool
        .query(sql,[user_no])
        .then(function(rows){
            console.log(rows);
            res.send(rows);

        })
        .catch(function(error){
            console.log(error);
            res.status(500).send(error)
        });

});

// connection.query('insert into user (name) value (?)', [name], function (error, results, fields){
//     if (error) throw error;
//     res.send(results);
//
// });

/*
let STFT = require("./stft.js")

function stftPassThru(frame_size, input) {
    let stft = STFT(1, frame_size, onfft)
    let istft = STFT(-1, frame_size, onifft)
    let output = new Float32Array(input.length)
    let in_ptr = 0
    let out_ptr = 0

    function onfft(x, y) {
        istft(x, y)
    }

    function onifft(v) {
        console.log(Array.prototype.slice.call(v))
        for(let i=0; i<v.length; ++i) {
            output[out_ptr++] = v[i]
        }
    }

    for(let i=0; i+frame_size<=input.length; i+=frame_size) {
        stft(input.subarray(i, i+frame_size))
    }
    stft(new Float32Array(frame_size))
    return output
}

console.log(Array.prototype.slice.call(stftPassThru(8, new Float32Array([
    0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
]))))

*/
module.exports = router;
