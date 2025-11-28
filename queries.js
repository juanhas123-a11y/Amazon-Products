// Database: amazon_products
// Collection: products_reviews

// FUNCIÓN ROBUSTA DE CONVERSIÓN DE RATING
// Usa $convert con onError: null para manejar datos sucios (como pipes, espacios o strings vacíos)
var safeRating = {
    $convert: {
        input: "$rating",
        to: "double",
        onError: null, // Si falla la conversión (ej. encuentra un '|'), lo pone en NULL
        onNull: null  // Si el campo rating no existe, también lo pone en NULL
    }
};

// FUNCIÓN ROBUSTA DE LIMPIEZA Y CONVERSIÓN DE PRECIO
var cleanPrice = {
    $convert: {
        input: {
            // Primero, removemos el símbolo de Rupia
            $replaceAll: {
                input: "$discounted_price",
                find: "₹",
                replacement: ""
            }
        },
        to: "double",
        onError: null, 
        onNull: null
    }
};

// 1. REPORTE: TOP 5 CATEGORÍAS PRINCIPALES POR VOLUMEN DE PRODUCTOS Y RATING PROMEDIO.
// Muestra las categorías más populares extrayendo solo la primera parte de la cadena 'A|B|C'.
var topCategories = [
    {
        // 1. Añadimos un campo temporal que aísla la Categoría Principal
        $addFields: {
            main_category: {
                $arrayElemAt: [
                    { $split: ["$category", "|"] }, // Divide la cadena por el pipe
                    0                              // Toma el primer elemento (la Categoría Principal)
                ]
            }
        }
    },
    {
        $group: {
            _id: "$main_category", // <-- Agrupamos por la nueva categoría principal
            TotalProducts: { $sum: 1 },
            AverageRating: { $avg: safeRating } // <-- Usamos la conversión segura
        }
    },
    { $sort: { TotalProducts: -1 } },
    { $limit: 5 } // Top 5
];

// 2. REPORTE: PRODUCTOS CON MAYOR DESCUENTO Y MEJOR VALORACIÓN (para ofertas).
// Usaremos $match para filtrar los documentos con rating válido antes de proyectar.
var bestDiscountedItems = [
    {
        // El rating debe ser convertible a doble y el porcentaje de descuento debe existir
        $match: {
            "discount_percentage": { $ne: null, $ne: "" }, 
            "rating": { $ne: null, $ne: "" }
        }
    },
    {
        $project: {
            product_name: 1,
            discount_percentage: cleanPrice, // Usamos cleanPrice para convertir % a double
            rating: safeRating,             // Usamos safeRating para convertir rating a double
            discounted_price_num: cleanPrice
        }
    },
    { $sort: { discount_percentage: -1, rating: -1 } },
    { $limit: 10 }
];

// 3. REPORTE: TÍTULOS DE RESEÑAS MÁS FRECUENTES (para análisis de sentimiento básico).
var reviewTitleAnalysis = [
    { $match: { "review_title": { $exists: true, $ne: null, $ne: "" } } },
    {
        $group: {
            _id: "$review_title",
            TotalProducts: { $sum: 1 },
            AvgRating: { $avg: safeRating } // <-- Usamos la conversión segura
        }
    },
    { $sort: { TotalProducts: -1 } },
    { $limit: 10 }
];

// Comandos para ejecutar en la Mongo Shell/Compass:
// db.products_reviews.aggregate(topCategories);
// db.products_reviews.aggregate(bestDiscountedItems);
// db.products_reviews.aggregate(reviewTitleAnalysis);