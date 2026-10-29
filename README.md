# Stream de objetos con Node.js

Este ejemplo envía objetos como JSON Lines (NDJSON) desde un servidor HTTP.
Cada objeto se produce uno a uno y se escribe inmediatamente, sin esperar a tener toda la lista en memoria.

## Ejecutar

```bash
npm start
```

En otra terminal:

```bash
curl -N http://localhost:3000/usuarios
```

Verás un objeto JSON por línea, a medida que llega al cliente.

## Flujo recomendado

1. `Readable.from(generateUsers(), { objectMode: true })` crea un stream de objetos.
2. `Transform` serializa cada objeto en texto NDJSON.
3. `pipeline` conecta productor, transformador y respuesta HTTP con manejo correcto de errores y backpressure.
