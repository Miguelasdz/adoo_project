const express = require('express');
const router = express.Router();

const conexion = require('./database/db');

router.get('/libro', (req, res)=>{     
    conexion.query('SELECT * FROM libro',(error, results)=>{
        if(error){
            throw error;
        } else {                       
            res.render('libro.ejs', {results:results});            
        }   
    })
})
 

router.get('/create', (req,res)=>{
    res.render('create');
})

router.get('/edit/:id', (req,res)=>{    
    const id = req.params.id;
    conexion.query('SELECT * FROM libro WHERE id=?',[id] , (error, results) => {
        if (error) {
            throw error;
        }else{            
            res.render('edit.ejs', {libro:results[0]});            
        }        
    });
});

router.get('/delete/:id', (req, res) => {
    const id = req.params.id;
    conexion.query('DELETE FROM libro WHERE id = ?',[id], (error, results)=>{
        if(error){
            console.log(error);
        }else{           
            res.redirect('/');         
        }
    })
});

const crud = require('./controllers/crud');

router.post('/save', crud.save);
router.post('/update', crud.update);

module.exports = router;