const { response } = require("express");
const Cliente = require("../models/modelClientes");
module.exports = {
    
    delete: async (request, response) => {
        await Cliente.delete(request.params.id);
        response.status(200).send();
    },

    update: async (request, response) => {
        const outputCliente = await Cliente.update(request.body,request.params.id);
        response.status(200).send();
    },

    create: async (request, response) => {
        await Cliente.create(request.body);
        response.status(200).send();
    },

    getAll: async (request, response) => {
        const outputClientes = await Cliente.getAll(request.query);
        response.send(outputClientes.rows);
    },
};
