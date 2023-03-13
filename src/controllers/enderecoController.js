const Endereco = require("../models/enderecoModel");
module.exports = {
    create: async (request, response) => {
        await Endereco.create(request.body);
        response.status(200).send();
    },

    getAllByCliente: async (request, response) => {
        const outputEnderecos = await Endereco.getAllByCliente(request.params.clienteId);
        response.status(200).send(outputEnderecos);
    },

    getOneByClient: async (request, response) => {
        const outputEndereco = await Endereco.getOneByClient(request.params.clienteId,request.params.enderecoId);
        response.status(200).send(outputEndereco);
    },

    delete: async (request, response, next) => {
        try {
            await Endereco.delete(request.params.clienteId,request.params.enderecoId);
            response.status(200).send();
        } catch (error) {
            next(error);
        }
    },
};
