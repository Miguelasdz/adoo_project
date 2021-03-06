// 1 - Invocamos a Express
const express = require('express');
const app = express();


//2 - Para poder capturar los datos del formulario (sin urlencoded nos devuelve "undefined")
app.use(express.urlencoded({extended:false}));
app.use(express.json());//además le decimos a express que vamos a usar json

//3- Invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({ path: './env/.env'});

//4 -seteamos el directorio de assets
app.use('/resources',express.static('public'));
app.use('/resources', express.static(__dirname + '/public'));

//5 - Establecemos el motor de plantillas
app.set('view engine','ejs');

//6 -Invocamos a bcrypt
const bcrypt = require('bcryptjs');

//7- variables de session
const session = require('express-session');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
// 8 - Invocamos a la conexion de la DB
const connection = require('./database/db');
//9 - establecemos las rutas


app.use("/",express.static("index"));


app.get('/login',(req, res)=>{
    res.render('login');
})
app.get('/user',(req, res)=>{
    res.render('user');
})
app.get('/contacto',(req, res)=>{
    res.render('contacto');
})

app.post('/search',function(req,res){
	
    var str = {
        stringPart:req.body.typeahead
    }

    connection.query('SELECT * FROM libro WHERE titulo LIKE "%'+str.stringPart+'%"',function(err, rows, fields) {
        if (err) throw err;
        var data=[];
        for(i=0;i<rows.length;i++)
        {
			data.push('titulo');
            data.push(rows[i].titulo);

			data.push('biblioteca');
			data.push(rows[i].biblioteca);
			
			data.push('cantidad');
			data.push(rows[i].cantidad);
			
        }
        res.send('Siguientes titulos disponible en ' + JSON.stringify(data));

    });
});



app.use('/', require('./router'));




app.get('/register',(req, res)=>{
    res.render('register');
})
//10 - Método para la REGISTRACIÓN
//registrar
app.post('/register', async (req, res)=>{
    const user=req.body.user;
    const name=req.body.name;
    const apellido=req.body.apellido;
    const correo=req.body.correo;
    const pass=req.body.pass;
    let passwordHaash=await bcrypt.hash(pass, 8);
    connection.query('INSERT INTO users SET ?', {user:user, name:name, apellido:apellido, correo:correo, pass:passwordHaash}, async(error,results)=>{
        if(error){
            console.log(error);
        }
        else{
            res.render('register',{
                alert: true,
                alertTitle: "Registration",
                alertMessage:"i Successful Registration!",
                alertIcon: 'success',
                showConfirmButton: false,
                timer:1500,
                ruta:''
            })
        }
    
    })
})



//11 - Metodo para la autenticacion
app.post('/auth', async (req, res)=> {
	const user = req.body.user;
	const pass = req.body.pass;    
    let passwordHash = await bcrypt.hash(pass, 8);
	if (user && pass) {
		connection.query('SELECT * FROM users WHERE user = ?', [user], async (error, results, fields)=> {
			if( results.length == 0 || !(await bcrypt.compare(pass, results[0].pass)) ) {    
				res.render('login', {
                        alert: true,
                        alertTitle: "Error",
                        alertMessage: "USUARIO y/o PASSWORD incorrectas",
                        alertIcon:'error',
                        showConfirmButton: true,
                        timer: false,
                        ruta: 'login'    
                    });
				
				//Mensaje simple y poco vistoso
                //res.send('Incorrect Username and/or Password!');				
			} else {         
				//creamos una var de session y le asignamos true si INICIO SESSION       
				req.session.loggedin = true;                
				req.session.name = results[0].name;
				res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 1500,
					ruta: ''
				});        			
			}			
			res.end();
		});
	} else {	
		res.send('Please enter user and Password!');
		res.end();
	}
});

//12 - Método para controlar que está auth en todas las páginas
app.get('/', (req, res)=> {
	if (req.session.loggedin) {
		res.render('index',{
			login: true,
			name: req.session.name			
		});
				
	} else {
		res.render('index',{
			login:false,
			name:'Debe iniciar sesión',			
		});				
	}
	res.end();
});


//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

 //Logout
//Destruye la sesión.
app.get('/logout', function (req, res) {
	req.session.destroy(() => {
	  res.redirect('/') // siempre se ejecutará después de que se destruya la sesión
	})
});


app.listen(3000, (req, res)=>{
    console.log('server up in http://localhost:3000');
})
//12 - Método para controlar que está auth en todas las páginas
