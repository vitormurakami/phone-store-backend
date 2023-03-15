const Cliente = require("../models/clienteModel");
module.exports = {
    
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
            const outputCliente = await Cliente.update(request.body,request.params.id);
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
            const outputCliente = await Cliente.getOneById(request.params.id);
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
