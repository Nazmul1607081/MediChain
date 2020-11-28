const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');

const fs = require('fs');
const crypto = require('asymmetric-crypto')

var multer = require('multer');
var upload = multer({ dest: 'adddoctor/'});

const { Blockchain, Transaction, Block } = require('./blockchain');

///key generator
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

//msql
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "username",
  password: "",
  database: "medichain",
});

const app = express();

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");
app.use(express.static('public'))
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


app.use(bodyParser.json());
app.use(upload.array());
app.use(bodyParser.urlencoded({ extended: true  }));

app.get('/', function(req, res) {
    if (req.session.loggedin) {
        console.log(req.session.user)
		res.render('index');
	} else {
		res.render('login');
	}
	res.end();
})
app.get('/logout', function(req,res){
    if (req.session.loggedin) {
        req.session.loggedin=false;
        res.render('login')
	}
    fs.access('./private', fs.F_OK, (err) => {
        if (err) {
            console.log("File does not exist.")
        } else {
            console.log("File exists.")
            fs.unlink('private',function (err) {
                if(err)throw err;
                console.log("Logout file deleted")
            })
        }
    })

    res.render('login')

	res.end();
})

///login
app.get('/login', function(req, res) {
    res.render('login');
})
app.post('/checklogin',function(request, response) {
    console.log(request.body)
    var username = request.body.uid;
	var password = request.body.password;
	var privateKey = request.body.privateKey;
    var  utype = request.body.utype;

    fs.writeFile('private', privateKey, function (err) {
        if (err) return console.log(err);
        console.log('write to private');
    });

    var publicKey = crypto.fromSecretKey(privateKey).publicKey;

    var sql;
    if(utype === 'doctors'){
        sql= 'SELECT * FROM doctors WHERE uid = ? AND password = ? AND wallet_address=?'
    }
    else{
        sql= 'SELECT * FROM patients WHERE uid = ? AND password = ? AND wallet_address=?'
    }
    ///select data
	if (username && password && privateKey) {
		con.query(sql, [username, password,publicKey], function(error, results, fields) {
			if (results.length>0) {
				request.session.loggedin = true;
				request.session.username = username;
				request.session.user = utype;
				response.redirect('/');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}

})

///signup doctor
app.get('/doctorsignup', function(req, res) {
    if (req.session.loggedin) {
        console.log(req.session.user)
		res.render('index');
	} else {
		res.render('signup');
	}
	res.end();
})
app.post('/adddoctor',function(req, res) {

    console.log(req.body)

    const myKeyPair = crypto.keyPair()
    const publicKey = myKeyPair.publicKey;
    const privateKey = myKeyPair.secretKey;




    var fname = req.body.fname;
    var lname = req.body.lname;
    var uid = req.body.uid;
    var password = req.body.password;
    var  work_place = req.body.work_place;
    var  qualification = req.body.qualification;
    var exprience = req.body.exprience;
    var department = req.body.department;
    var  wallet_address = publicKey;
    var  gender = req.body.gender;


    ///insert data
    var sql = "INSERT INTO doctors (did, uid, password, fname, lname,image, gender, work_place, qualification, experience, department,wallet_address) VALUES (NULL, '"+uid+"', '"+password+"', '"+fname+"', '"+lname+"','','"+gender+"', '"+work_place+"', '"+qualification+"',  '"+exprience+"', '"+department+"','"+wallet_address+"')";

    if (uid && password) {
		con.query(sql, function(error, results, fields) {
		    if (error) throw error;
		    console.log(results)
		    if (results) {
		        res.redirect('/key/'+privateKey);
		        res.end();
            }

		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
})

///signup patient
app.get('/patientsignup', function(req, res) {
    if (req.session.loggedin) {
        console.log(req.session.user)
		res.render('index');
	} else {
		res.render('signup1');
	}
	res.end();
})
app.post('/addpatient',function(req, res) {

    console.log(req.body)

    const myKeyPair = crypto.keyPair()
    const publicKey = myKeyPair.publicKey;
    const privateKey = myKeyPair.secretKey;

    var fname = req.body.fname;
    var lname = req.body.lname;
    var uid = req.body.uid;
    var password = req.body.password;
    var  wallet_address = publicKey;
    var  gender = req.body.gender ;


    ///insert data
    var sql = "INSERT INTO patients (pid, uid, password, fname, lname, gender,wallet_address) VALUES (NULL, '"+uid+"', '"+password+"', '"+fname+"', '"+lname+"','"+gender+"','"+wallet_address+"')";

    if (uid && password) {
		con.query(sql, function(error, results, fields) {
		    if (error) throw error;
		    console.log(results)
		    if (results) {
		        res.redirect('/key/'+privateKey);
		        res.end();
            }

		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}

})

///doctor list
app.get('/doctorlist/:dtype', function(req, res) {
    var dtype = req.params.dtype;
    var dlist=[];
    var sql = "SELECT * FROM doctors WHERE department = ?"
    con.query(sql,[dtype], function(error, results, fields) {
			if (results.length > 0) {
				dlist = results;
			    console.log(dlist);
			    data = {
                    dtype:dtype.toString().toUpperCase(),
                    doctors:dlist
                }
                res.render('doctorlist',{data:data})
                console.log(data.doctors[0].fname)
			} else {
				res.send('No Data');
			}
			res.end();
		});


})

///appointment
app.get('/appointment/:uid', function(req, res) {
     var uid = req.params.uid;
     console.log(uid)
     res.render('appointment',{uid:uid})
})
app.post('/addappointment/:uid',async function(req, res) {

     var mobile_no = req.body.mobile_number;
     var condition = req.body.condition;
     var temparature = req.body.temparature;
     var pressure = req.body.pressure;
     var city = req.body.city;
     var division = req.body.division;
     var postal = req.body.postal;


     let data  ="mobile no : " +mobile_no+" "+
         "condition : "+condition+" "+
         "temperature : "+temparature+" "+
         "pressure : "+pressure+" "+
         "city : "+city+" "+
         "divition : "+division+" "+
         "postal : "+postal+" ";




    // var d_wallet_address;
    var p_wallet_address;
    let p_private_key;

    var duid = req.params.uid;
    var puid = req.session.username;

    console.log(duid)
    console.log(puid)

    fs.readFile('private', 'utf8', function (err,data) {
            if (err) {
            return console.log(err);
        }
        p_private_key = data;
        p_wallet_address = crypto.fromSecretKey(p_private_key).publicKey
        console.log(data);
        console.log('data');


    var sql = "SELECT * FROM doctors WHERE uid = ?"
    con.query(sql,[duid], function(error, r, fields) {
        if (r) {
            console.log("r")
            console.log(r)
            let d_wallet_address = r[0].wallet_address;
            console.log(d_wallet_address)
            const encrypted = crypto.encrypt(data, d_wallet_address, p_private_key)
            let final_sql = "SELECT blocks.*, transactions.* FROM blocks, transactions WHERE blocks.transactions = transactions.transaction_no;"
            con.query(final_sql,function (err,res,fields) {
                if(err)throw err;
                if(res){
                    console.log(res);
                    console.log('res');
                    let blocks = [];
                    for(let i=0;i<res.length;i++){
                        let txs=[];
                        let tx = new Transaction(res[i].from_address,res[i].to_address,res[i].amount);
                        txs.push(tx);
                        let b = new  Block(res[i].timestamp,txs,res[i].previousHash,res[i].hash)
                        blocks.push(b);
                    }
                    console.log(blocks)

                    const savjeeCoin = new Blockchain(blocks);
                    const tx1 = new Transaction(p_wallet_address, d_wallet_address,encrypted.nonce+"*medichain*"+ encrypted.data);
                    tx1.signTransaction(p_private_key);
                    savjeeCoin.addTransaction(tx1);
                    savjeeCoin.minePendingTransactions(p_wallet_address);
                }
            })
            res.redirect('/');
        }
    });
    });
})

///advice
app.get('/advice',function(request,response){
    let all_data = [];
    let final_sql = "SELECT blocks.*, transactions.* FROM blocks, transactions WHERE blocks.transactions = transactions.transaction_no;"
    con.query(final_sql,function (err,res,fields) {
        if(err)throw err;
        if(res){
            //console.log(res);
            let blocks = [];
            for(let i=0;i<res.length;i++){
                let txs=[];
                let tx = new Transaction(res[i].from_address,res[i].to_address,res[i].amount);
                txs.push(tx);
                let b = new  Block(res[i].timestamp,txs,res[i].previousHash,res[i].hash)
                blocks.push(b);
            }
            console.log(blocks)

            const savjeeCoin = new Blockchain(blocks);
            fs.readFile('private', 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                let d_private_key = data;
                let d_wallet_address = crypto.fromSecretKey(d_private_key).publicKey

                all_data = savjeeCoin.getBalanceOfAddress(d_private_key)
                console.log(d_wallet_address)
                console.log('data');
                console.log(all_data);
                response.render('advice',{data:all_data});
            });

        }
    })

})
app.post('/advice/:id',function(req,response){
    let id = req.params.id;
    let all_data = [];
    let final_sql = "SELECT blocks.*, transactions.* FROM blocks, transactions WHERE blocks.transactions = transactions.transaction_no;"
    con.query(final_sql,function (err,res,fields) {
        if(err)throw err;
        if(res){
            //console.log(res);
            let blocks = [];
            for(let i=0;i<res.length;i++){
                let txs=[];
                let tx = new Transaction(res[i].from_address,res[i].to_address,res[i].amount);
                txs.push(tx);
                let b = new  Block(res[i].timestamp,txs,res[i].previousHash,res[i].hash)
                blocks.push(b);
            }
            console.log(blocks)

            const savjeeCoin = new Blockchain(blocks);
            fs.readFile('private', 'utf8', function (err,data) {
                if (err) {
                    return console.log(err);
                }
                let d_private_key = data;
                let d_wallet_address = crypto.fromSecretKey(d_private_key).publicKey
                all_data = savjeeCoin.getBalanceOfAddress(d_private_key)

                let p_wallet_address = all_data[id].fromAddress;

                let advice = req.body.advice;
                advice = "*advice*"+advice;
                ///advice as sa transaction
                console.log(d_wallet_address)
                const encrypted = crypto.encrypt(advice, p_wallet_address, d_private_key)

                const tx1 = new Transaction(d_wallet_address, p_wallet_address,encrypted.nonce+"*medichain*"+ encrypted.data);
                tx1.signTransaction(d_private_key);
                savjeeCoin.addTransaction(tx1);
                savjeeCoin.minePendingTransactions(d_wallet_address);

                response.render('advice',{data:all_data});
            });

        }
    })

})

app.get('/key/:key',function(req,res){
    var privateKey = req.params.key;
    res.render('privatekey',{privateKey:privateKey})
})

function test(){
    const myKeyPair = crypto.keyPair()
    const theirKeyPair = crypto.keyPair()
    const encrypted = crypto.encrypt('some data', 'tssFywXYNAVFg+zV6Aw7eUKX7c68DBP5l/WQB0iiAZQ=', 'YtugnW+icJiAXQXgABtwW5e5rwW4sIR7sEnOQbj3JNjUUj5FLeouoSvz51OiEfGA1hzWOQx3xcmWkpY1AEideg==')
    const decrypted = crypto.decrypt('nHNAkgqr2JP1+jmchfTBlBv53Pd3V3PqEA==','+W/DQf4V+HfArCi3+Tr3r/FUdPrkXe53', '1FI+RS3qLqEr8+dTohHxgNYc1jkMd8XJlpKWNQBInXo=','LyL7fWt+sR173PjCBmDqBJ3FRLjQpOSsJR5A96wpGT22ywXLBdg0BUWD7NXoDDt5QpftzrwME/mX9ZAHSKIBlA==')
    console.log()
    console.log(theirKeyPair.publicKey)
    console.log(myKeyPair.secretKey)
    console.log(encrypted.data)
    console.log(encrypted.nonce)
    console.log(myKeyPair.publicKey)
    console.log(theirKeyPair.secretKey)
    console.log(decrypted)
    console.log()
}
app.get('/test',function (req,res) {
    test();
    res.send("Testing...")
})

var server = app.listen(8080, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})


