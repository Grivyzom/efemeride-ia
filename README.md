# Documentación del proyecto

## Configuración de Apache

Para servir las páginas estáticas con rutas amigables puedes utilizar el
archivo `.htaccess` incluido en este repositorio. Este archivo redirige las
URL `/`, `/login` y `/register` a los archivos `index.html`, `login.html` y
`register.html` respectivamente. Así podrás acceder a las páginas con
direcciones como `https://localhost:5500/login` sin exponer la extensión
`.html`.