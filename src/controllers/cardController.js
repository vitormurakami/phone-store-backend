const Card = require("../models/cardModel");

module.exports = {

    create: async(request, response) => {
        try {
            await Card.create(request.userId,request.body);
            response.status(200).send({success: "Cartão cadastrado com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    getAll: async(request, response) => {
        try {
            const outputCard = await Card.getAll(request.userId);
            response.status(200).send(outputCard);
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    getCardById: async(request, response) => {
        try {
            const outputCard = await Card.getCardById(request.userId, request.params.cardId);
            response.status(200).send(outputCard);
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    delete: async(request, response) => {
        try {
            const outputCard = await Card.delete(request.userId,request.params.cardId);
            if (outputCard.rowCount === 0) {
                return response.status(404).send({error: 'Cartão não encontrado'});
            }
            response.status(200).send({success: "Cartão excluido com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    setPreference: async(request, response) => {
        try {
            await Card.setPreference(request.userId, request.params.cardId, request.body)
            response.status(200).send({success: "Cartão definido como preferencial com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    }
}