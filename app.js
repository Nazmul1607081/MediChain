const express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');

//const key = new NodeRSA({b: 512});
var path = require('path');
var fs = require("fs");
var multer = require('multer');
var upload = multer({ dest: 'adddoctor/'});

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
     // var g_data = "genesis block";
     // var pubKey = key.exportKey('public');
     // var priKey =key.exportKey('private');
     // var a = pubKey.toString();
     // var b= priKey.toString();
     // var publicKey = NodeRSA(a)
     // var privateKey =NodeRSA(b)


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
	res.end();
})
app.get('/login', function(req, res) {
    res.render('login');
})
app.get('/doctorsignup', function(req, res) {
    res.render('signup');
})
app.get('/patientsignup', function(req, res) {
    res.render('signup1');
})
app.post('/checklogin',function(request, response) {
    console.log(request.body)
    var username = request.body.uid;
	var password = request.body.password;
    var  utype = request.body.utype;

    var sql;
    if(utype === 'doctors'){
        sql= 'SELECT * FROM doctors WHERE uid = ? OR password = ?'
    }
    else{
        sql= 'SELECT * FROM patients WHERE uid = ? OR password = ?'
    }
    ///select data
	if (username && password) {
		con.query(sql, [username, password], function(error, results, fields) {
			if (results.length > 0) {
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

//add doctor
app.post('/adddoctor',function(req, res) {
    const NodeRSA = require('node-rsa');
    console.log(req.body)
     const key = new NodeRSA({b: 512});
     var pubKey = key.exportKey('public');
     var priKey =key.exportKey('private');
     var a = pubKey.toString();
     var b= priKey.toString();


    // const key = ec.genKeyPair();
    // const publicKey = key.getPublic('hex');
    // const privateKey = key.getPrivate('hex');
     console.log(b)



    var fname = req.body.fname;
    var lname = req.body.lname;
    var uid = req.body.uid;
    var password = req.body.password;
    var  work_place = req.body.work_place;
    var  qualification = req.body.qualification;
    var exprience = req.body.exprience;
    var department = req.body.department;
    var  wallet_address = a;
    var  gender = req.body.gender;


    ///insert data
    var sql = "INSERT INTO doctors (did, uid, password, fname, lname,image, gender, work_place, qualification, experience, department,wallet_address) VALUES (NULL, '"+uid+"', '"+password+"', '"+fname+"', '"+lname+"','','"+gender+"', '"+work_place+"', '"+qualification+"',  '"+exprience+"', '"+department+"','"+wallet_address+"')";

    if (uid && password) {
		con.query(sql, function(error, results, fields) {
		    if (error) throw error;
		    console.log(results)
		    if (results) {
		        res.redirect('/login');
		        res.end();
            }

		});
	} else {
		res.send('Please enter Username and Password!');
		res.end();
	}
})

///add patient
app.post('/addpatient',function(req, res) {

    console.log(req.body)
     const NodeRSA = require('node-rsa');
     const key = new NodeRSA({b: 512});
     var pubKey = key.exportKey('public');
     var priKey =key.exportKey('private');
     var a = pubKey.toString();
     var b= priKey.toString();

    // const key = ec.genKeyPair();
    // const publicKey = key.getPublic('hex');
    // const privateKey = key.getPrivate('hex');
    console.log(b)

    var fname = req.body.fname;
    var lname = req.body.lname;
    var uid = req.body.uid;
    var password = req.body.password;
    var  wallet_address = a;
    var  gender = req.body.gender;


    ///insert data
    var sql = "INSERT INTO patients (pid, uid, password, fname, lname, gender,wallet_address) VALUES (NULL, '"+uid+"', '"+password+"', '"+fname+"', '"+lname+"','"+gender+"','"+wallet_address+"')";

    if (uid && password) {
		con.query(sql, function(error, results, fields) {
		    if (error) throw error;
		    console.log(results)
		    if (results) {
		        res.redirect('/login');
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

app.get('/appointment/:uid', function(req, res) {
     var uid = req.params.uid;
     console.log(uid)
     res.render('appointment',{uid:uid})
})

app.post('/addappointment/:uid', function(req, res) {
    //form data
     var mobile_no = req.body.mobile_number;
     var condition = req.body.condition;
     var temparature = req.body.temparature;
     var pressure = req.body.pressure;
     var city = req.body.city;
     var division = req.body.division;
     var postal = req.body.postal;




     // var encriptedData = publicKey.encrypt(g_data,'base64');
     // console.log(encriptedData);
     // var decriptedData = privateKey.decrypt(encriptedData,'utf8');
     // console.log(decriptedData);

    var d_wallet_address;
    var p_wallet_address;

    var duid = req.params.uid;
    var puid = req.session.username;

    console.log(duid)
    console.log(puid)

    var sql = "SELECT * FROM doctors WHERE uid = ?"
    con.query(sql,[duid], function(error, results, fields) {
			if (results) {
				d_wallet_address = results[0].wallet_address;
				console.log(d_wallet_address)
			}

		});
    sql = "SELECT * FROM patients WHERE uid = ?"
    con.query(sql,[puid], function(error, results, fields) {
			if (results) {
				p_wallet_address = results[0].wallet_address;
				console.log(p_wallet_address)
			}
			res.end();
		});
    /// blockchain

    sql = "SELECT * FROM apointments"
    con.query(sql, function(error, results, fields) {
			if(error)throw error;

			console.log(results);
            var previous_hash = results[results.length-1].previous_hash;
            var data = Date.now()+" "+puid+" "+mobile_no+" "+condition+" "+temparature+" "+pressure+" "+city+" "+division+" "+postal+" ";

            var d_wallet = NodeRSA(d_wallet_address);

            var hash = d_wallet.encrypt(data,'base64');
            if(results){
                var inser_sql = "INSERT INTO apointments(duid,puid,sender_address,data,previous_hash,hash) VALUES (?,?,?,?,?,?)"
                con.query(inser_sql,[duid,puid,p_wallet_address,"",previous_hash,hash],function(error,results,fields){
                    if(results){
                        console.log("success");
                    }
                })
            }

			res.end();
		});

})


var server = app.listen(8080, function() {
    var host = server.address().address
    var port = server.address().port

    console.log("Example app listening at http://%s:%s", host, port)
})
