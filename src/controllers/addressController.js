const Address = require("../models/addressModel");

module.exports = {

    create: async(request, response) => {
        try {
            await Address.create(request.userId,request.body);
            response.status(200).send({success: "Endereço cadastrado com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(500).send({error: "Ocorreu um erro ao cadastrar um endereço"});
        }
    },

    getAll: async(request, response) => {
        try {
            const outputAddress = await Address.getAll(request.userId);
            response.status(200).send(outputAddress);
        } catch (error) {
            console.error(error);
            response.status(500).send({error: "Ocorreu um erro ao consultar os endereços"});
        }
    },

    getAddressById: async(request, response) => {
        try {
            const outputAddress = await Address.getAddressById(request.userId, request.params.addressId);
            response.status(200).send(outputAddress);
        } catch (error) {
            console.error(error);
            response.status(500).send({error: "Ocorreu um erro ao consultar o endereço"});
        }
    },

    update: async(request, response) => {
        try {
            await Address.update(request.userId, request.params.addressId, request.body);
            response.status(200).send({success: "Endereço atualizado com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(500).send({error: "Ocorreu um erro ao atualizar o endereço"});
        }
    },

    delete: async(request, response) => {
        try {
            const outputAddress = await Address.delete(request.userId,request.params.addressId);
            if (outputAddress.rowCount === 0) {
                return response.status(404).send({error: 'Endereço não encontrado'});
            }
            response.status(200).send({success: "Endereço excluido com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao excluir o endereço.'});
        }
    }


}