const Cliente = require("../models/clienteModel");
const jwt = require("jsonwebtoken");
const SECRET = require("../config/jwtSecret");

module.exports = {
    
    login: async (request, response) => {
        try {
            const outputCliente = await Cliente.login(request.body);
            if(outputCliente.rowCount === 0){
                return response.status(401).send({error: "Dados Inválidos"});
            }
            const userId = outputCliente.rows.at(0).cliente_id;
            const token = jwt.sign({userId: userId}, SECRET, {expiresIn: 300})
            return response.status(200).json({auth: true, token});   
        } catch (error) {
            console.log(error);
            response.status(500).send({error: "Ocorreu um erro ao realizar o login"});
        }
    },

    delete: async (request, response) => {
        try {
            const outputCliente = await Cliente.delete(request.params.id);
            if (outputCliente.rowCount === 0) {
                return response.status(404).send({error: 'Cliente não encontrado'});
            }
            response.status(200).send();
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao excluir o cliente.'});
        }
    },

    update: async (request, response) => {
        try{
            const outputCliente = await Cliente.update(request.body,request.userId);
            if (outputCliente.rowCount === 0) {
                return response.status(404).send({error: 'Cliente não encontrado'});
            }
            response.status(200).send();
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao atualizar o cliente.'});
        }
    },

    create: async (request, response) => {
        try {
            await Cliente.create(request.body);
            response.status(200).send();
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao cadastar cliente.'});
        }
    },

    getAll: async (request, response) => {
        try {
            const outputClientes = await Cliente.getAll(request.query);
            response.status(200).send(outputClientes.rows);
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao consular cliente.'});
        }
    },
    
    getOneById: async (request, response) => {
        try {
            const outputCliente = await Cliente.getOneById(request.userId);
            if (!outputCliente) {
                response.status(404).send('Cliente não encontrado');
            } else {
                response.status(200).send(outputCliente);
            }
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao consultar cliente.'});
        }
    }
};
