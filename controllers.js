//Librerias y dependencias
require('dotenv').config();
const multer = require('multer');
const http = require('http');
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));
const path = require('path');
const baseDatos = require('./models/baseDatos.js');
const utils = require('./utils/uploadImg.js');
const {contrasena,admin} = process.env;
let ext;
let login= false;


//--------------------------------------------------------------
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './static/uploads')
  },
  filename: function (req, file, cb) {
    ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + Date.now() + utils.getContentType(ext))
  }
})

let upload = multer({ storage: storage });
//---------------------------------------------------------------

//recursos que se van a cargar en el server 
app.use(express.static(__dirname+'/static'));

//-----------------------------------------------------------------
//Configuración del Servidor
app.set('view engine','ejs');//definimos el motor de plantilla con archivos ejs
app.set('views',path.join(__dirname,"./views"));//definimos la ruta del motor de plantilla
app.use(express.urlencoded({extended:false}));//permite recuperar los valores publicados en un request
port = app.listen(5000);
console.log('Servidor corriendo exitosamente en el puerto 5000');



//-----------------------------------------------------------
//enruptamiento
app.get('/',(req,res)=>{
  res.render('index.ejs')
});

app.get('/login',(req,res)=>{
res.render('iniciarSesion.ejs');
});


app.post('/login',(req,res)=>{

 const {admin,password} = req.body;

   if(admin === admin && password === contrasena){
    login=true;
    res.redirect('/productos');
   }else{
    login=false;
   res.redirect('/*');
   }

});
  

app.get('/add',(req,res)=>{
res.render('add.ejs');
});

//---------------------------------------------------------
app.get('/addImagen',(req,res)=>{
res.render('addImagen.ejs');
});


app.post('/addImagen',upload.single('img'),(req,res)=>{ 
baseDatos.aggIMG(req,res);
});


app.post('/addPost',(req,res)=>{   
baseDatos.aggDato(req,res);
});


app.get('/productos',(req,res)=>{
  baseDatos.mostrarProductos(req,res);
});
//-------------------------------------------------------
// GET /editar/:id
app.get('/update/:id',(req, res) => {
baseDatos.mostrarUpdate(req,res);

});
//-------------------------------------------------------
// POST /editar/:id
app.post('/update/:id', (req, res) => {
 baseDatos.update(req,res);
});
//-------------------------------------------------------
// GET /eliminar/:id
app.get('/delete/:id', (req, res) => {
 baseDatos.mostrarDelete(req,res);
});
//-------------------------------------------------------
// POST /eliminar/:id
app.post('/delete/:id', (req, res) => {
 baseDatos.deletee(req,res);
});
//------------------------------------------------------
app.get('/categorias', (req, res) => {
 baseDatos.getCategorias(req,res);
});
//-------------------------------------------------------
app.get('/addCategorias', (req, res) => {
 res.render('addcategoria.ejs');
});
//-------------------------------------------------------
app.post('/addcategorias', (req, res) => {
 baseDatos.postCategorias(req,res);
});
//-------------------------------------------------------
app.get('/updateCategoria/:id',(req,res)=>{
 baseDatos.mostrarUpdateC(req,res);
});
//-------------------------------------------------------
app.post('/updateCategoria/:id',(req,res)=>{
baseDatos.updateCateg(req,res);
});
//-------------------------------------------------------
//Metodo para manejar rutas no encontradas
app.get('/*',(req,res)=>{
res.render('found.ejs')
});
//-------------------------------------------------------
