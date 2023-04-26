const Customer = require("../models/customerModel");
const jwt = require("jsonwebtoken");
const { updateInfos } = require("../models/customerModel");

module.exports = {
    login: async (request, response) => {
        try {
            const outputCustomer = await Customer.login(request.body);
            const userId = outputCustomer;
            const token = jwt.sign({userId: userId, userType: "CUSTOMER"}, process.env.JWT_SECRET_KEY, {expiresIn: 3600})
            return response.status(200).json({auth: true, token});   
        } catch (error) {
            console.log(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    getInfo: async (request, response) => {
        try {
            const outputCustomer = await Customer.getInfo(request.userId);
            response.status(200).send(outputCustomer);
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    create: async (request, response) => {
        try {
            await Customer.create(request.body);
            response.status(201).send({success: "Cliente cadastrado com sucesso"});
        } catch (error) {
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },
    
    updateInfos: async (request, response) => {
        try {
            await Customer.updateInfos(request.body, request.userId)
            response.status(200).send({success: "Cliente atualizado com sucesso"});
        } catch (error) {
            console.log(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    updatePassword: async (request, response) => {
        try {
            await Customer.updatePassword(request.body, request.userId)
            response.status(201).send({success: "Senha atualizada com sucesso"});
        } catch (error) {
            console.log(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode})
        }
    }

};
