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
            const userId = outputCustomer.rows.at(0).cliente_id;
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
            const endereco = {
                endereco_id: outputCustomer.endereco_id,
                apelido: outputCustomer.apelido,
                tipo_residencia: outputCustomer.tipo_residencia,
                tipo_logradouro: outputCustomer.tipo_logradouro,
                logradouro: outputCustomer.logradouro,
                numero: outputCustomer.numero,
                bairro: outputCustomer.bairro,
                cidade: outputCustomer.cidade,
                estado: outputCustomer.estado,
                pais: outputCustomer.pais,
                cep: outputCustomer.cep,
                observacoes: outputCustomer.observacoes,
                entrega_padrao: outputCustomer.entrega_padrao,
                cobranca_padrao: outputCustomer.cobranca_padrao,
                residencial_padrao: outputCustomer.residencial_padrao
            };
            outputCustomer.endereco = endereco;
            delete outputCustomer.endereco_id;
            delete outputCustomer.apelido;
            delete outputCustomer.tipo_residencia;
            delete outputCustomer.tipo_logradouro;
            delete outputCustomer.logradouro;
            delete outputCustomer.numero;
            delete outputCustomer.bairro;
            delete outputCustomer.cidade;
            delete outputCustomer.estado;
            delete outputCustomer.pais;
            delete outputCustomer.cep;
            delete outputCustomer.observacoes;
            delete outputCustomer.entrega_padrao;
            delete outputCustomer.cobranca_padrao;
            delete outputCustomer.residencial_padrao;
            response.status(200).send(outputCustomer);
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao consular dados cadastrais.'});
        }
    },

    create: async (request, response) => {
        try {
            await Customer.create(request.body);
            response.status(200).send();
        } catch (error) {
            console.error(error);
            response.status(500).send({error: error.message});
        }
    },
    
    updateInfos: async (request, response) => {
        try {
            await Customer.updateInfos(request.body, request.userId)
            response.status(200).send();
        } catch (error) {
            response.status(500).send({error: 'Erro ao atualizar dados do cliente'})
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

    getAll: async (request, response) => {
        try {
            const outputClientes = await Cliente.getAll(request.query);
            response.status(200).send(outputClientes.rows);
        } catch (error) {
            console.error(error);
            response.status(500).send({error: 'Ocorreu um erro ao consular cliente.'});
        }
    }
    */
};
