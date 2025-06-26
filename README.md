# 🏆 Tech's Cave: La cueva del hardware  

[Readme in English 🇬🇧](README_EN.md)

## 🔥 ¿Qué es Tech's Cave?  

**Tech's Cave** es un sitio web diseñado como una modesta tienda en línea para la venta de productos. Su desarrollo está principalmente orientado a **pequeños emprendedores** que buscan digitalizar su negocio sin costos elevados.  

## 🎯 ¿Por qué orientado a emprendimientos?  

Este e-commerce tiene una particularidad única: no utiliza una API REST, servidores dedicados ni una base de datos tradicional.  

En su lugar, Tech's Cave reemplaza toda esa infraestructura con **una hoja de cálculo de Google Sheets**. Los datos de los productos se obtienen directamente gracias a herramientas como:  

- 🚀 **Axios** → Para hacer peticiones HTTP.  
- 📊 **Papa Parser** → Para convertir valores CSV en JSON.  

Este enfoque simplifica la gestión y hace que la plataforma sea accesible para pequeños negocios.  

## 📌 ¿Por qué usar una hoja de cálculo como base de datos?  

En mi experiencia desarrollando soluciones web, y especialmente **tiendas virtuales**, siempre me encontré con el mismo problema:  

💸 **El costo de desarrollo es muy alto**. 

- Un e-commerce estándar requiere, **al menos, dos servidores** (uno para la API y otro para la base de datos). Esto hace que **migrar o escalar un pequeño emprendimiento sea costoso y poco rentable**. 

- Tech's Cave busca erradicar este problema, facilitando la migración y ampliación digital de negocios pequeños de forma mucho más sencilla y económica.

Otro punto clave es que muchos emprendedores ya están familiarizados con **Excel o Google Sheets**, pero no con bases de datos SQL o NoSQL. Es cierto: parte de nuestro trabajo es crear una UI **intuitiva**, que facilite la gestión de un e-commerce sin que los usuarios siquiera sientan que están trabajando con una base de datos.   

- Sin embargo, en muchos negocios pequeños, el manejo de productos ya se hace con hojas de cálculo, por lo que este sistema encaja de manera prácticamente natural.  

## ❓ ¿Pero una simple hoja de cálculo como base de datos no es un problema?  

⚠️ En parte, sí. Por eso, Tech's Cave utiliza **un sistema de asincronía de datos** para mejorar la estabilidad.  

En principio, la aplicación se conecta a **dos fuentes de datos distintas**:  

1. **📋 Hoja de productos (Google Sheets)** → Principal fuente de datos. Contiene todos los productos y varios campos de utilidad (stock, precio, descripción, imagen, etc.).  
2. **🗄️ Base de datos NoSQL (MongoDB)** → Para almacenar órdenes de compra y usuarios.

Esta combinación permite mantener la flexibilidad de fuentes de datos y permite "modular" el sistema, de forma que podemos comprender de dónde viene un error o cada dato. 