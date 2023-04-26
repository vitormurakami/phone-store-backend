const Address = require("../models/addressModel");

module.exports = {

    create: async(request, response) => {
        try {
            await Address.create(request.userId,request.body);
            response.status(200).send({success: "Endereço cadastrado com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode})
        }
    },

    getAll: async(request, response) => {
        try {
            const outputAddress = await Address.getAll(request.userId);
            response.status(200).send(outputAddress);
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode})
        }
    },

    getAddressById: async(request, response) => {
        try {
            const outputAddress = await Address.getAddressById(request.userId, request.params.addressId);
            response.status(200).send(outputAddress);
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode})
        }
    },

    update: async(request, response) => {
        try {
            await Address.update(request.userId, request.params.addressId, request.body);
            response.status(200).send({success: "Endereço atualizado com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode})
        }
    },

    delete: async(request, response) => {
        try {
            const outputAddress = await Address.delete(request.userId,request.params.addressId);
            response.status(200).send({success: "Endereço excluido com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode})
        }
    }


}