\# 🛍️ Amazon Product Analytics Project (MongoDB NoSQL)

Este repositorio contiene la implementación backend de un proyecto de análisis de datos de comercio electrónico, utilizando el stack de MongoDB para almacenamiento, validación, agregación de datos y visualización.

\*\*Plataforma de Base de Datos:\*\* MongoDB Atlas (M0 Free Tier)
\*\*Herramientas:\*\* MongoDB Compass, Git.
\*\*Fuente de Datos:\*\* `amazon.csv` (Dataset de Productos y Reseñas de Amazon)

---

\## 1. Configuración de la Base de Datos (MongoDB Atlas)

\### 1.1. Clúster

El proyecto se aloja en un clúster compartido \*\*M0 Sandbox\*\* en MongoDB Atlas.

\* \*\*Nombre del Clúster:\*\* `\\\[Coloca el nombre de tu clúster aquí, ej: GlobalMarketCluster]`
\* \*\*Cadena de Conexión (URI):\*\* `mongodb+srv://<username>:<password>@tucluster.mongodb.net/...`

\*\*Nota:\*\* Asegúrese de tener un usuario de base de datos creado con permisos de lectura y escritura (`Read and write to any database`) y que la dirección IP de conexión esté autorizada en \*\*Network Access\*\* de Atlas.

\### 1.2. Estructura de la Base de Datos

| Componente | Nombre | Descripción |
| :--- | :--- | :--- |
| \*\*Base de Datos\*\* | `amazon\\\_products` | Contiene toda la información del proyecto Amazon. |
| \*\*Colección Principal\*\* | `products\\\_reviews` | Colección desnormalizada que almacena los detalles de cada producto y sus reseñas (un documento por fila del CSV). |

\### 1.3. Carga de Datos

1\. \*\*Conexión:\*\* Conectar \*\*MongoDB Compass\*\* a la URI de su clúster de Atlas.
2\. \*\*Creación:\*\* Crear la Base de Datos `amazon\\\_products` y la Colección `products\\\_reviews` en Compass.
3\. \*\*Importación:\*\* Utilizar la función \*\*"Import File"\*\* en Compass, seleccionando el archivo \*\*`amazon.csv`\*\* y configurando el formato como \*\*CSV\*\*. (El archivo contiene 25,601 documentos).

---

\## 2. Implementación de Scripts

Los scripts se ejecutan en la \*\*Mongo Shell\*\* (disponible en MongoDB Compass) contra la base de datos `amazon\\\_products`.

\### 2.1. Validación de Esquema (`validation.js`)

El archivo `validation.js` define una regla de validación (`$jsonSchema`) para asegurar la integridad de los campos críticos de la colección `products\\\_reviews`.

\*\*Para Aplicar la Validación:\*\*

1\. Abrir el archivo `validation.js` y copiar su contenido.
2\. Pegar el contenido directamente en la \*\*Mongo Shell\*\* de Compass y ejecutarlo.
3\. Verificar que el comando `db.runCommand(...)` retorne `{ "ok" : 1 }`.

\### 2.2. Consultas de Agregación (`queries.js`)

El archivo `queries.js` contiene tres \*pipelines\* de agregación complejos (utilizando `$group`, `$match`, `$sort`, `$project`, etc.) para el análisis del *dataset*:

1\. \*\*`topCategories`:\*\* Identifica el Top 5 de categorías por volumen de productos y calcula el *rating* promedio.
2\. \*\*`bestDiscountedItems`:\*\* Identifica los productos con mayor porcentaje de descuento (>50%) y *rating* superior a 3.0.
3\. \*\*`reviewTitleAnalysis`:\*\* Agrupa por los títulos de reseña más frecuentes para un análisis de sentimiento básico.

\*\*Para Ejecutar las Consultas:\*\*

1\. Copiar el contenido de la variable del \*pipeline\* (ej: `var topCategories = \\\[...]`) y pegarlo en la Mongo Shell.
2\. Ejecutar el pipeline con: `db.products\\\_reviews.aggregate(nombreDelPipeline);`

---

\## 3. Demostración de Rendimiento (Explain Plan)

Para cumplir con el requerimiento de rendimiento, se demuestra la mejora de la eficiencia al consultar.

\### 3.1. Creación de Índice

Se recomienda crear un índice compuesto para optimizar la consulta de productos con alto descuento y rating. Este índice acelera la búsqueda en los campos más filtrados o utilizados para ordenar.

\*\*Comando de Creación (en Mongo Shell):\*\*
```javascript
db.products\_reviews.createIndex({ "discount\_percentage": -1, "rating": -1, "discounted\_price": 1 });

```

\### 3.2. Verificación de Uso de Índice



El siguiente comando demuestra que la consulta usa el índice (IXSCAN) en lugar de escanear toda la colección (COLLSCAN), lo que prueba la mejora de rendimiento.



\*\*Comando de Verificación (en Mongo Shell):\*\*

```JavaScript

db.products_reviews.aggregate(bestDiscountedItems).explain('executionStats');

```

## 4. Resultados de Análisis y Visualización 

### 4.1. Dashboard de Visualización (MongoDB Charts)

Se creó un Dashboard en MongoDB Atlas Charts para visualizar los resultados de las agregaciones.

* **Gráfico Demostrado:** Gráfico de barras que muestra el **rating** promedio por **category** principal.

**ENLACE PÚBLICO AL DASHBOARD:**

https://charts.mongodb.com/charts-project-0-bdwbysr/public/dashboards/692a0620-297a-42be-895e-ab8ea38fcdbe

\## 5. Repositorio de GitHub

El código fuente completo de este proyecto se encuentra en el siguiente enlace:

https://github.com/juanhas123-a11y/Amazon-Products.git
