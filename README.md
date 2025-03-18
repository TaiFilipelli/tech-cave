# Tech's Cave: la cueva del hardware.

## ¿Qué es Tech's Cave? 🔥

Tech's cave es un sitio web cuyo único propósito es el de ser una modesta tiendita para venta de productos. Su desarrollo está principalmente orientada a los emprendedores pequeños.

### Por qué orientado a emprendimientos? 

>Este e-commerce tiene como única caracteristica especial que no cuenta con una API Rest, ni usa servidores, bases de datos o siquiera un backend dedicado aparte. Este e-commerce reemplaza todo eso con una hoja de cálculo de Google Sheets, donde una tabla de productos con varias columnas se trae directamente gracias a herramientas como axios para hacer las peticiones y Papa Parser para convertir valores csv en json. 

## Por qué una hoja de cálculo como base de datos?

>En mi corta pero intensa experiencia desarrollando aplicaciones (más que nada, tiendas virtuales), me he encontrado siempre con el mismo problema: desarrollar una tienda virtual es un trabajo muy caro. El mero hecho de pensar en el coste de, como mínimo, dos servidores (uno para la base de datos y otro para la API, inicialmente) hacen que la migración/ampliación de un emprendimiento muy pequeño a la virtualidad sea extremadamente costosa y, por consecuencia, no rentable. Siento que esto no debería ser asi; todos aquellos que pudieron crear una marca y vender un producto original merecen tener una tienda que les ayude a crecer y sin gastar cientos de dólares en servidores. Por eso surgió Tech's Cave. Para darle fin a ese problema. Otro punto de extrema importancia es que se espera muchisimo más que los dueños de emprendimientos y tiendas tengan más conocimientos asociados a Excel o Google Sheets que a manejar querys de bases de datos. Si bien parte de nuestro trabajo supone crear una UI lo suficientemente amigable como para que los usuarios puedan manejar bases de datos sin casi darse cuenta de que están trabajando con ellas, también es importante comprender que quizá en negocios reales pequeños se trabaje con hojas de cálculo. 

## Pero una simple hoja de cálculo como única base de datos no es una mala idea?

>En parte, si. Es por eso que, en Tech's Cave, se usa un sistema de asincronismo de datos. Esto significa que, en principio, la aplicación está conectada a 3 bases de datos distintas: la hoja de productos de Excel, una base de datos NoSQL (MongoDB) para guardar las órdenes de compra y una última base de datos pequeña para almacenar usuarios. 