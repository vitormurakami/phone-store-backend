const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");

module.exports = {
    
    login: async (request, response) => {
        try {
            const outputAdmin = await Admin.login(request.body);
            if(outputAdmin.rowCount === 0){
                return response.status(401).send({error: "Dados Inválidos"});
            }
            const userId = outputAdmin.rows.at(0).admin_id;
            const token = jwt.sign({userId: userId, userType: "ADMIN"}, process.env.JWT_SECRET_KEY, {expiresIn: 300})
            return response.status(200).json({auth: true, token});   
        } catch (error) {
            console.log(error);
            response.status(500).send({error: "Ocorreu um erro ao realizar o login"});
        }
    },

    getAll: async (request, response) => {
        try {
            const outputCustomers = await Admin.getCustomersByFilters(request.query);
            response.status(200).send(outputCustomers.rows);
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao consular cliente.'});
        }
    },

    getCustomerById: async (request, response) => {
        try {
            const outputCustomer = await Admin.geCustomerById(request.params.customerId);
            if (!outputCustomer) {
                response.status(404).send('Cliente não encontrado');
            } else {
                response.status(200).send(outputCustomer);
            }
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao consultar cliente.'});
        }
    },

    activateCustomer: async (request, response) => {
        try{
            await Admin.activateCustomer(request.params.customerId);
            response.status(200).send();
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao ativar cliente.'})
        }
    },

    inactivateCustomer: async (request, response) => {
        try{
            await Admin.inactivateCustomer(request.params.customerId);
            response.status(200).send();
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao inativar cliente.'})
        }
    }


    /*

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
    */
};
