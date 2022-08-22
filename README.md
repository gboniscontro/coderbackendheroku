#Proyecto subido en heroku

se realiza un login en passport, un chat y las rutas para ejecutar por postman el backend de un ecommerce

https://nodecoderbackend.herokuapp.com/

#Ejecutar el test para probar que genera desde cero los productos y el carrito
#Crea el usuario y hace el login y genera el token en el test

npm run test

#para ejecutar el proyecto

npm start

#Rutas del proyecto

estan en el .json adjunto

usar el .env.sample para configurar el archivo .env

para probar graphql ejecutar el localhost:8080/graphql

#Notificaciones por mail

las notificaciones de registro de nuevos usuarios se realizan mediante nodemailer

(ingresar correctamente en el archivo .env la configuracion de su email de gmail para poder realizar el envio con la clave
correspondiente para poder ejecutar desde esta aplicacion)

#Ejecucion modo FORK Y CLUSTER

node src/server.js --modo "CLUSTER"

node src/server.js --modo "FORK"

//por defecto es modo fork

node src/server.js

//pm2 ejecucion

pm2 start src/server.js

//actualiza cuando hago alguna modificacion

pm2 start src/server.js --watch

//se parpadea una pantalla siempre en el modo watch es muy molesta jaja

pm2 stop 0

pm2 delete 0

//ejecutar en modo cluster con 3 instancias

pm2 start src/server.js -i 3

//configuracion con nginx

pm2 start src/server.js -- --port 8082

pm2 start src/server.js -- --port 8083

pm2 start src/server.js -- --port 8084

pm2 start src/server.js -- --port 8085

Ejecuto nginx.exe

con el archivo nginx.conf que adjunto

./nginx -s reload

para hacer lo del desafio
