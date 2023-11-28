require('dotenv').config();
const multer = require('multer');
const http = require('http');
const express = require('express');
const app = express();
const bodyParser= require('body-parser');
//app.use(bodyParser.urlencoded({extended: true}));
const path = require('path');
const baseDatos = require('./models/baseDatos.js');
const utils = require('./utils/uploadImg.js');
const {ADMIN,PASSWORD} = process.env;
let ext;
app.use(express.json());
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
port = app.listen(3000);
console.log('Servidor corriendo exitosamente en el puerto 3000');



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

   if(admin === ADMIN && password === PASSWORD){
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
app.get('/addImagen/:id',(req,res)=>{
baseDatos.getImagen(req,res);
});


app.post('/addImagen/:id',upload.single('img'),(req,res)=>{ 
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
app.get('/eliminarCategoria/:id',(req,res)=>{
baseDatos.deleteCategoriaGET(req,res);
})
//-------------------------------------------------------
app.get('/clientes',(req,res)=>{
  console.log('mostrando pagina la cliente!');
baseDatos.ClientesGET(req,res);
})
//-------------------------------------------------------
app.post('/cliente', (req, res) => {
 baseDatos.filtrar(req,res);
});
//-------------------------------------------------------
app.get('/clientico', (req, res) => {
 baseDatos.filtrar2(req,res);
});
//-------------------------------------------------------
app.get('/detalles/:id',(req,res)=>{
baseDatos.detalles(req,res);
});
//-------------------------------------------------------
app.get('/ruta', (req, res) => {
  const {nombre,codigo,precio,descripcion,origen,capacidad,url} = req.query;

  let datos = {
    nombre:nombre,
    codigo:codigo,
    precio:precio,
    descripcion:descripcion,
    origen:origen,
    capacidad:capacidad,
    url:url
  }

  console.log(datos,'Valor de Busqueda--por fin');
  res.render('buscar.ejs',{result:datos});

});
//-------------------------------------------------------
app.get('/detalles/:id',(req,res)=>{
baseDatos.detalles(req,res);
});
//-------------------------------------------------------
//Metodo para manejar rutas no encontradas
app.get('/*',(req,res)=>{
res.render('found.ejs');
});
//-------------------------------------------------------
