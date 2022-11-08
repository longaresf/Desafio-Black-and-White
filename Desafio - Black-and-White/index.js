// Importar módulos
const http = require('http');
const fs = require('fs');
const url = require('url');
const yargs = require('yargs');
const jimp = require('jimp');

// Clave que se usará como argumento del comando de Yargs
const key = 123;

// Implementación de Yargs para levantar el servidor a partir de la línea de comandos con argumentos
const argv = yargs
    .command(
        'levantar_servidor',
        'Comando para levantar servidor',
        {
            key: {
                describe: 'Argumento para validar la clave de acceso',
                demand: true,
                alias: 'k',
            },
        },
        // Creación del servidor en el cuarto parámetro de Yargs (<callback>)
        (args) => {
            args.key == key
                ?
                http.createServer((req,res) => {
                    
                    // Ruta raíz que devuelve formulario
                    if (req.url == '/') {
                        res.writeHead(200,{'Content-Type':'text/html'});
                        fs.readFile('index.html','utf8',(err,html) => {
                            res.end(html);
                        })
                    }

                    // Estilos CSS diponibles a través de esta ruta
                    if (req.url == '/estilos') {
                        res.writeHead(200,{'Content-Type':'text/css'});
                        fs.readFile('estilos.css',(err,css) => {
                            res.end(css);
                        })
                    }

                    // Constantes para obtener la url de la imagen desde el formulario
                    const params = url.parse(req.url,true).query;
                    const url_imagen = params.ruta;

                    // Ruta que muestra la imagen procesada con Jimp
                    if (req.url.includes('/imagen')){
                    
                        jimp.read(url_imagen,
                        (err,imagen) => {
                            imagen
                                .resize(350,jimp.AUTO)
                                .grayscale()
                                .quality(60)
                                .writeAsync('newImg.jpg')
                                .then(() => {
                                    fs.readFile('newImg.jpg',(err,Imagen) => {
                                        res.writeHead(200,{'Content-Type':'image/jpeg'});
                                        res.end(Imagen);
                                    })
                                })
                        })
                    }
                })
                .listen(8080, () => console.log('Escuchando el puerto 8080'))
                :
                console.log('Key incorrecta, intente nuevamente.')
        }
    )
    .help().argv