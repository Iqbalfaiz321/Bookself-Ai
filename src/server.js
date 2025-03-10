const hapi = require('@hapi/hapi'); 
const routes = require('./routes')

const init = async (request, h) => {
    const server = hapi.server({
        port: 9000,
        host: "localhost"
    });

    server.route(routes);
    await server.start();
    console.log("Server running on %s", server.info.uri);
}

init();
