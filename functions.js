/**
 * Created with JetBrains RubyMine.
 * User: mads
 * Date: 16/10/13
 * Time: 11:55
 * To change this template use File | Settings | File Templates.
 */

//muestra el lightbox del login
function showLightboxLogin(){
    document.getElementById('overLogin').style.display="block";
    document.getElementById('fadeLogin').style.display="block";
}

//Oculta el lightbox del login
function hideLightboxLogin(){
    document.getElementById('overLogin').style.display="none";
    document.getElementById('fadeLogin').style.display="none";
}

//Muestra el lightbox del registro
function showLightboxReg(){
    document.getElementById('overRegister').style.display="block";
    document.getElementById('fadeRegister').style.display="block";
}

//Oculta el lightbox del registro
function hideLightboxReg(){
    document.getElementById('overRegister').style.display="none";
    document.getElementById('fadeRegister').style.display="none";
}

//Muestra el lightbox de la creacion de la peticion
function showLightboxPeticion(){
    document.getElementById('overNewSignature').style.display = 'block';
    document.getElementById('fadeNewSignature').style.display = 'block';
}

//Oculta el lightbox de la cracion de la peticion
function hideLightboxPeticion(){
    document.getElementById('overNewSignature').style.display = 'none';
    document.getElementById('fadeNewSignature').style.display = 'none';
}

//Hace la llamada post a la url para el login del usuario
function userLogin(){
    var usuario = document.getElementById('id_user');
    var contrasenya = document.getElementById('id_pass');
    if(validateLogin(usuario.value, contrasenya.value)){
        var req = new XMLHttpRequest();
        req.open('POST', "login", false);
        req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        req.onreadystatechange = mi_callback(req, usuario.value);
        var loginSplit = usuario.value.split("@");
        req.send('login=' + loginSplit[0] + '%40' + loginSplit[1] + '&password=' + contrasenya.value);
    }
}

//validador de los campos del login
//param: usuario, es el campo email del login si esta vacio muestra un error
//param: contrasenya, campo contraseña del login si eta vacio muestra un error
function validateLogin(usuario, contrasenya){
    if(contrasenya === "" || usuario === ""){
        if(usuario === "")
            document.getElementById('id_errorUserLogin').style.display = 'block';
        else
            document.getElementById('id_errorUserLogin').style.display = 'none';
        if(contrasenya === "")
            document.getElementById('id_errorPassLogin').style.display = 'block';
        else
            document.getElementById('id_errorPassLogin').style.display = 'none';
        return false;
    }
    else{
        return true;
    }
}

//Callback del login comprueba la respuesta de la peticion al servidor y muestra una animacion con el mensaje para el usuario
//param usuario, pasamos el login del usuario para recoger los datos de este
function mi_callback(req, usuario) {
    return function(){
        var log = document.getElementById('id_serverLog');
        if(req.readyState == 4){
            if(req.status == 200){
                hideLightboxLogin();
                getUserDataLogin(usuario);
                log.innerHTML = 'Se ha logueado con exito';
                log.style.backgroundColor = 'green';
                showanimateLog();
                hideanimateLog();
            }
            else if(req.status == 400){
                hideLightboxLogin();
                log.innerHTML = 'Datos incorrectos';
                log.style.backgroundColor = 'red';
                showanimateLog();
                hideanimateLog();
            }
            else if(req.status == 403){
                hideLightboxLogin();
                log.innerHTML = 'Credenciales no validas';
                log.style.backgroundColor = 'red';
                showanimateLog();
                hideanimateLog();
            }
        }
    }
}

//Obtine los datos del usuario que se loguea
//param: usuario, necesitamos conocer el login del usuario para hacer la peticion al servidor
function getUserDataLogin(usuario){
    var req = new XMLHttpRequest();
    req.open('GET', "api/usuarios/" + usuario, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.onreadystatechange = callbackRequestDataLogin(req);
    req.send(null);
}

//Comprueba la respuesta de la peticion al servidor y guarda el nombre del usuario en el localStorage
function callbackRequestDataLogin(req) {
    return function () {
        if(req.readyState == 4) {
            if(req.status == 200) {
                var jsonmensaje = JSON.stringify(req.responseText, "\t");
                var usermensaje = JSON.parse(jsonmensaje);
                var userLogin = JSON.parse(usermensaje);
                showUserData(userLogin.nombre);
                hideDataSignatureForm();
                localStorage.setItem('usuario', userLogin.nombre);
            }
        }
    }
}

//Muesta el bienvenido cuando el suaurio se loguea, muestra el boton de logout y oculta las opciones de registro y login
//param: usuarioNombre, con el nombre de usuario le mostramos el mensaje de bienvenido
function showUserData(usuarioNombre){
    document.getElementById('id_wellcome').innerHTML = 'Bienvenido ' + usuarioNombre;
    document.getElementById('id_wellcome').style.display = 'block';
    document.getElementById('id_logout').style.display = 'block';
    document.getElementById('id_newSignature').style.display = 'block';
    document.getElementById('id_login').style.display = 'none';
    document.getElementById('id_register').style.display = 'none';
}

//Oculta el bienbenido cuando el suaurio se loguea, oculta el boton de logout y muestra las opciones de registro y login
function hideUserData(){
    document.getElementById('id_wellcome').style.display = 'none';
    document.getElementById('id_logout').style.display = 'none';
    document.getElementById('id_login').style.display = 'block';
    document.getElementById('id_register').style.display = 'block';
    document.getElementById('id_newSignature').style.display = 'none';
}

//Hace la peticion de logout del usuario
function userLogout(){
    var req = new XMLHttpRequest();
    req.open('GET', "logout", true);
    req.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    req.onreadystatechange = callbackLogout(req);
    req.send(null);
}

//Comprueba la respuesta de la peticion al servidor
function callbackLogout(req) {
    return function() {
        if(req.readyState == 4) {
            if(req.status == 200) {
                localStorage.clear();
                hideUserData();
                showDataSignatureForm();
                var log = document.getElementById('id_serverLog');
                log.innerHTML = 'Adios!';
                log.style.backgroundColor = 'green';
                showanimateLog();
                hideanimateLog();
            }
        }
    }
}

//Hace una peticion POST json al servidor para crear el nuevo registro de usuario
function userRegister(){
    var name = document.getElementById('id_regname');
    var apellidos = document.getElementById('id_reg2name');
    var mail = document.getElementById('id_regmail');
    var pass = document.getElementById('id_regpass');
    var pass2 = document.getElementById('id_regpass2');
    if(validateRegister(name.value, apellidos.value, mail.value, pass.value, pass2.value)){
        var req = new XMLHttpRequest();
        req.open('POST', "api/usuarios", false);
        req.setRequestHeader("Content-type","application/json");
        req.onreadystatechange = callbackRegister(req);
        var json = {
            login: mail.value,
            password: pass2.value,
            nombre: name.value,
            apellidos: apellidos.value
        }
        var jsonString = JSON.stringify(json);
        req.send(jsonString);
    }
}

//COmprueba la resputa de la peticion al servidor del nuevo registro
function callbackRegister(req) {
    return function() {
        var log = document.getElementById('id_serverLog');
        if(req.readyState == 4) {
            if(req.status == 201) {
                hideLightboxReg();
                log.innerHTML = 'Se ha registrado con exito';
                log.style.backgroundColor = 'green';
                showanimateLog();
                hideanimateLog();
            }
            if(req.status == 400){
                hideLightboxReg();
                log.innerHTML = 'Datos incorrectos';
                log.style.backgroundColor = 'red';
                showanimateLog();
                hideanimateLog();
            }
        }
    }
}

//validador de los campos del registro
function validateRegister(nombre, apellido, mail, pass, pass2) {
    if(nombre === "" || apellido === "" || mail === "" || pass === ""){
        if(nombre === "" && apellido === "" && mail === "" && pass === "")
            document.getElementById('register-form').style.height = '397px';
        if(nombre == "")
            document.getElementById('id_errorNameReg').style.display = 'block';
        else
            document.getElementById('id_errorNameReg').style.display = 'none';
        if(apellido == "")
            document.getElementById('id_error2NameReg').style.display = 'block';
        else
            document.getElementById('id_error2NameReg').style.display = 'none';
        if(mail == "")
        {
            document.getElementById('id_errorMailReg').style.display = 'block';
        }
        else
            document.getElementById('id_errorMailReg').style.display = 'none';
        if(pass == "")
            document.getElementById('id_errorPassReg').style.display = 'block';
        else
            document.getElementById('id_errorPassReg').style.display = 'none';
        return false;
    }
    else{
        if(pass != pass2){
            document.getElementById('id_errorNameReg').style.display = 'none';
            document.getElementById('id_error2NameReg').style.display = 'none';
            document.getElementById('id_errorMailReg').style.display = 'none';
            document.getElementById('id_errorPassReg').style.display = 'none'
            document.getElementById('id_error2PassReg').style.display = 'block';
            return false;
        }
        else{
            document.getElementById('id_error2PassReg').style.display = 'none';
            return true;
        }
    }
}

//Hace una peticion al servidor para saber si el login esta ya disponible
function loginDisponible(){
    var login = document.getElementById('id_regmail');
    var req = new XMLHttpRequest();
    req.open('GET', "api/loginDisponible/" + login.value, true);
    req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    req.onreadystatechange = callbackLoginDisponible(req);
    req.send(null);
}

//comprueba la respuesta de la peticion al servidor para saber si el login esta o no disponible
function callbackLoginDisponible(req) {
    return function() {
        console.log(req.responseText);
        if(req.readyState == 4) {
            if(req.status == 200) {
                if(req.responseText == "OK"){
                    document.getElementById('id_loginrepe').style.display = 'none';
                }
                else if(req.responseText == "no"){
                    document.getElementById('id_loginrepe').style.display = 'block';
                }
            }
        }
    }
}

//Hace una peticion al servidor post json para crear nuevas peticiones
function crearPeticion() {
    var tituloPeticion = document.getElementById('id_tituloPeticion');
    var fechafin = document.getElementById('id_fechaEndPeticion');
    var textoPeticion = document.getElementById('id_descripcionPeticion');
    var firmasPeticion = document.getElementById('id_NumFirmasPeticion');

    var req = new XMLHttpRequest();
    req.open('POST', "api/peticiones", false);
    req.setRequestHeader("Content-type","application/json");
    req.onreadystatechange = callbackPeticion(req);
    var json = {
        titulo: tituloPeticion.value,
        fin: fechafin.value,
        texto: textoPeticion.value,
        firmasObjetivo: firmasPeticion.value
    }
    var jsonString = JSON.stringify(json);
    req.send(jsonString);
}

//compureba la respuesta de la peticion del servidor para al crear nuevas peticiones
function callbackPeticion(req) {
    return function() {
        var log = document.getElementById('id_serverLog');
        if(req.readyState == 4) {
            if(req.status == 201) {
                hideLightboxPeticion();
                log.innerHTML = 'Firma creada con exito';
                log.style.backgroundColor = 'green';
                showanimateLog();
                hideanimateLog();
            }
            if(req.status == 403){
                log.innerHTML = 'No esta autenticado';
                log.style.backgroundColor = 'red';
                showanimateLog();
                hideanimateLog();
                //NO estamos autenticados
            }
            if(req.status == 400){
                log.innerHTML = 'Datos incorrectos';
                log.style.backgroundColor = 'red';
                showanimateLog();
                hideanimateLog();
                //datos incorrectos
            }
            if(req.status == 500){
                log.innerHTML = 'El servidor no responde';
                log.style.backgroundColor = 'red';
                showanimateLog();
                hideanimateLog();
                //error servidor
            }
        }
    }
}

function firmarPeticion(){
    var peticionPublica = document.getElementById('id_checksignature');
    var peticionMotivo = document.getElementById('id_textdescription');

    var req = new XMLHttpRequest();
    req.open('POST', "api/peticiones/" + id_peticion + "/firmas/", false);
    req.setRequestHeader("Content-type","application/json");
    req.onreadystatechange = callbackFirmaPeticion(req);

    if(localStorage.getItem('usuario')){
        var json = {
            publica: peticionPublica.checked,
            comentario: peticionMotivo.value
        }
        var jsonString = JSON.stringify(json);
        req.send(jsonString);
    }
    else{
        var firmanteNombre= document.getElementById('id_nombre');
        var firmanteApellido = document.getElementById('id_2nombre');
        var firmanteEmail = document.getElementById('id_email');

        var json = {
            publica: peticionPublica.checked,
            comentario: peticionMotivo.value,
            nombre: firmanteNombre.value,
            apellidos: firmanteApellido.value,
            email: firmanteEmail.value
        }
        var jsonString = JSON.stringify(json);
        req.send(jsonString);
    }
}

function callbackFirmaPeticion(req){
    return function() {
        var log = document.getElementById('id_serverLog');
        if(req.readyState == 4) {
            if(req.status == 201) {
                log.innerHTML = 'Gracias por su firma';
                log.style.backgroundColor = 'green';
                showanimateLog();
                hideanimateLog();
            }
            if(req.status == 400){
                log.innerHTML = 'Datos incorrectos';
                log.style.backgroundColor = 'red';
                showanimateLog();
                hideanimateLog();
                //datos incorrectos
            }
            if(req.status == 500){
                log.innerHTML = 'El servidor no responde';
                log.style.backgroundColor = 'red';
                showanimateLog();
                hideanimateLog();
                //error servidor
            }
        }
    }
}

function hideDataSignatureForm(){
    if(document.getElementById('signature-form')){
        document.getElementById('id_nombre').style.display = 'none';
        document.getElementById('id_textname').style.display = 'none';

        document.getElementById('id_2nombre').style.display = 'none';
        document.getElementById('id_text2name').style.display = 'none';

        document.getElementById('id_email').style.display = 'none';
        document.getElementById('id_textmail').style.display = 'none';
    }
}

function showDataSignatureForm(){
    if(document.getElementById('signature-form')){
        document.getElementById('id_nombre').style.display = 'block';
        document.getElementById('id_textname').style.display = 'block';

        document.getElementById('id_2nombre').style.display = 'block';
        document.getElementById('id_text2name').style.display = 'block';

        document.getElementById('id_email').style.display = 'block';
        document.getElementById('id_textmail').style.display = 'block';
    }
}

function hideanimateLog(){
    $(document).ready(function() {
           setTimeout(function () {
               $(".serverLog").fadeOut(1500);
           }, 5000);
    });
}

function showanimateLog(){
    $(document).ready(function() {
        setTimeout(function () {
            $(".serverLog").fadeIn(1500);
        }, 1000);
    });
}

if(localStorage.getItem('usuario')){
    showUserData(localStorage.getItem('usuario'));
    hideDataSignatureForm();
}
else{
    showDataSignatureForm();
}
