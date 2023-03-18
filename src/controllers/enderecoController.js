const Endereco = require("../models/enderecoModel");
module.exports = {
    create: async (request, response) => {
        await Endereco.create(request.body);
        response.status(200).send();
    },

    getAllByCliente: async (request, response) => {
        const outputEnderecos = await Endereco.getAllByCliente(request.userId);
        response.status(200).send(outputEnderecos);
    },

    getOneByClient: async (request, response) => {
        const outputEndereco = await Endereco.getOneByClient(request.userId,request.params.enderecoId);
        response.status(200).send(outputEndereco);
    },

    update: async(request, response) => {
        await Endereco.update(request.body, request.userId, request.params.enderecoId);
        response.status(200).send();
    },

    delete: async (request, response, next) => {
        try {
            await Endereco.delete(request.userId, request.params.enderecoId);
            response.status(200).send();
        } catch (error) {
            next(error);
        }
    },
};
