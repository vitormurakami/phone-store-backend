const Customer = require("../models/customerModel");
const jwt = require("jsonwebtoken");
const { updateInfos } = require("../models/customerModel");

module.exports = {
    login: async (request, response) => {
        try {
            const outputCustomer = await Customer.login(request.body);
            if(outputCustomer.rowCount === 0){
                return response.status(401).send({error: "Dados Inválidos"});
            }
            const userId = outputCustomer.rows.at(0).cli_id;
            const token = jwt.sign({userId: userId, userType: "CUSTOMER"}, process.env.JWT_SECRET_KEY, {expiresIn: 300})
            return response.status(200).json({auth: true, token});   
        } catch (error) {
            console.log(error);
            response.status(500).send({error: "Ocorreu um erro ao realizar o login"});
        }
    },

    getInfo: async (request, response) => {
        try {
            const outputCustomer = await Customer.getInfo(request.userId);
            response.status(200).send(outputCustomer);
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao consular dados cadastrais.'});
        }
    },

    create: async (request, response) => {
        try {
            await Customer.create(request.body);
            response.status(200).send({success: "Cliente cadastrado com sucesso"});
        } catch (error) {
            console.error(error);
            response.status(500).send({error: error.message});
        }
    },
    
    updateInfos: async (request, response) => {
        try {
            await Customer.updateInfos(request.body, request.userId)
            response.status(200).send({success: "Cliente atualizado com sucesso"});
        } catch (error) {
            console.log(error);
            response.status(500).send({error: 'Erro ao atualizar dados do cliente'})
        }
    },

    updatePassword: async (request, response) => {
        try {
            await Customer.updatePassword(request.body, request.userId)
            response.status(200).send({success: "Senha atualizada com sucesso"});
        } catch (error) {
            console.log(error);
            response.status(500).send({error: error.message})
        }
    }

};
