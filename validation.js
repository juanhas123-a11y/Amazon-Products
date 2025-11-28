// Database: amazon_products (Tu base de datos)
// Collection: products_reviews (Tu colección)

db.runCommand({
    collMod: "products_reviews",
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["product_id", "category", "rating", "discounted_price"],
            properties: {
                "product_id": {
                    bsonType: "string",
                    description: "Debe ser el ID unico del producto."
                },
                "rating": {
                    // El rating viene como string '4.2', pero debe ser convertible a double.
                    bsonType: "string", 
                    pattern: "^[0-5](\\.[0-9])?$", // Patrón para ratings entre 0.0 y 5.0
                    description: "Debe ser un valor de rating (string)."
                },
                "discounted_price": {
                    bsonType: "string", // Viene como texto (ej: '₹399'), se convierte en consultas.
                    description: "Debe ser el precio con descuento."
                },
                "category": {
                    bsonType: "string",
                    description: "Debe contener una categoria valida."
                }
            }
        }
    },
    validationAction: "warn" // Usamos 'warn' para que no detenga la importación, solo registre una advertencia si falla.
});