const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

module.exports = {
    
    login: async (request, response) => {
        try {
            const outputAdmin = await Admin.login(request.body);
            const userId = outputAdmin;
            const token = jwt.sign({userId: userId, userType: "ADMIN"}, process.env.JWT_SECRET_KEY, {expiresIn: 3600})
            return response.status(200).json({auth: true, token});   
        } catch (error) {
            console.log(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    getAll: async (request, response) => {
        try {
            const outputCustomers = await Admin.getCustomersByFilters(request.query);
            response.status(200).send(outputCustomers);
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    getCustomerById: async (request, response) => {
        try {
            const outputCustomer = await Admin.geCustomerById(request.params.customerId);
            response.status(200).send(outputCustomer);
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    activateCustomer: async (request, response) => {
        try{
            await Admin.activateCustomer(request.params.customerId);
            response.status(200).send({success: "Cliente Ativado"});
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    },

    inactivateCustomer: async (request, response) => {
        try{
            await Admin.inactivateCustomer(request.params.customerId);
            response.status(200).send({success: "Cliente Inavitado"});
        } catch (error) {
            console.error(error);
            response.status(error.code).send({error: error.message, messageCode: error.messageCode});
        }
    }

};
