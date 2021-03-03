# AdeccoApi
 Api Node Js with Express
# Daniel Valencia - FullStack Developer
Email: danielfelipeluis@outlook.com
## Colección Postman:
En la raíz del proyecto se encuentra "Adecco.postman_collection.json".

## Correr Proyecto:
Requisitos:
Tener GIT y Docker instalados.

Descargar este código con `git clone https://github.com/neildan/AdeccoApi.git`
Posicionarse en el proyecto y ejecutar los siguientes comandos:
1. `docker build -t apiadecco .`
2. `docker run --publish 3000:3000 apiadecco`

## Aclaraciones:

1. No tener la variable global "url" en postman. De ser así deshabilitarla momentáneamente mientras se hace la prueba de recursos.
2. El recurso "User Login" crea un token el cual es necesario incluir en la cabecera de todos los recursos que no sean de "Users"
3. No tener ocupado el puerto 3000 mientras se hace la prueba del API con Docker.