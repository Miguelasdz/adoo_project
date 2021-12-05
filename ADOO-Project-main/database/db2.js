const mysql = require('mysql');
const connection = mysql.createConnection({
    host: process.env2.DB_HOST,
    user: process.env2.DB_USER,
    password: process.env2.DB_PASSWORD,
   database: process.env2.DB_DATABASE
});
connection.connect((error)=>{
    if(error){
        console.log('El error de conexión es : '+error);
        return;
    }
    console.log('¡Conectado a la base de datos!');
});
module.exports = connection;