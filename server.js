import http from "node:http";
import { Readable, Transform, pipeline } from "node:stream";
import { promisify } from "node:util";

const pipelineAsync = promisify(pipeline);

async function* generateUsers() {
  const users = [
    { id: 1, nombre: "Ana" },
    { id: 2, nombre: "Luis" },
    { id: 3, nombre: "María" }
  ];

  for (const user of users) {
    await new Promise((resolve) => setTimeout(resolve, 500));
    yield user;
  }
}

function createNdjsonTransform() {
  return new Transform({
    objectMode: true,
    transform(object, _encoding, callback) {
      callback(null, `${JSON.stringify(object)}\n`);
    }
  });
}

const server = http.createServer(async (request, response) => {
  if (request.method !== "GET" || request.url !== "/usuarios") {
    response.writeHead(404, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Ruta no encontrada" }));
    return;
  }

  response.writeHead(200, {
    "Content-Type": "application/x-ndjson; charset=utf-8",
    "Cache-Control": "no-cache",
    "Transfer-Encoding": "chunked"
  });

  try {
    await pipelineAsync(
      Readable.from(generateUsers(), { objectMode: true }),
      createNdjsonTransform(),
      response
    );
  } catch (error) {
    if (error.code !== "ERR_STREAM_PREMATURE_CLOSE") {
      console.error("Error al transmitir usuarios:", error);
    }
  }
});

server.listen(3000, () => {
  console.log("Servidor: http://localhost:3000/usuarios");
});
