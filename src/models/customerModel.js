const Address = require("../models/addressModel");
const db = require("../config/db");

const Customer = {};

Customer.login = async(credential) => {
    const query = `SELECT cli_id FROM clientes WHERE cli_email = $1 AND cli_senha = $2`;
    const value = [`${credential.email}`, `${credential.senha}`]

    try{
        const outputCustomer = await db.query(query,value);
        if(outputCustomer.rowCount === 0){
            throw {messageCode: "CUS400001"}
        }
        return outputCustomer.rows[0].cli_id;
    }catch (error){
        console.error(error);
        if (error.messageCode === "CUS400001") {
            throw { message: "Credenciais inválidas", messageCode: "CUS400001", code: 400 };
        }

        throw {message: "Erro ao buscar credenciais do usuário", messageCode: "CUS500001", code: 500}

    }
}

Customer.getInfo = async(customerId) => {
    const query = `
    SELECT 
        cli_id as "clienteId", 
        cli_nome as "nome", 
        to_char(cli_dt_nascimento, 'DD-MM-YYYY') as "dataNascimento", 
        cli_cpf as "cpf", 
        cli_genero as "genero", 
        cli_telefone as "telefone", 
        cli_status as "status", 
        cli_email as "email" 
    FROM 
        clientes WHERE cli_id = $1`
    const value = [`${customerId}`]

    try {
        const result = await db.query(query,value);
        return result.rows[0];
    } catch (error) {
        console.error(error);
        throw {message: "Erro ao obter dados cadastrais do usuário", messageCode: "CUS500002", code: 500}
    }
    
}

Customer.create = async(customer) => {

    const {nome, dataNascimento, cpf, genero, telefone, email, senha, enderecos } = customer;

    try{
        const emailExist = await db.query(`SELECT COUNT(*) FROM public.clientes WHERE cli_email = '${email}'`).then(result => result.rows[0].count);
        if (emailExist > 0) {
            throw {messageCode: "CUS400002"}
        }
    
        const cpfExist = await db.query(`SELECT COUNT(*) FROM public.clientes WHERE cli_cpf = '${cpf}'`).then(result => result.rows[0].count);
        if (cpfExist > 0) {
            throw {messageCode: "CUS400003"}
        }
    
        const phoneExist = await db.query(`SELECT COUNT(*) FROM public.clientes WHERE cli_telefone = '${telefone}'`).then(result => result.rows[0].count);
        if (phoneExist > 0) {
            throw {messageCode: "CUS400004"}
        }

        if(!customer.nome || !customer.dataNascimento || !customer.cpf || !customer.genero || !customer.telefone || !customer.email || !customer.senha || !customer.enderecos || Object.keys(customer.enderecos).length === 0){
            throw {messageCode: "CUS400005"}
        }

        if(!customer.enderecos.apelido || !customer.enderecos.tipoResidencia || !customer.enderecos.tipoLogradouro || !customer.enderecos.logradouro || !customer.enderecos.numero || !customer.enderecos.bairro || !customer.enderecos.cidade || !customer.enderecos.estado || !customer.enderecos.pais || !customer.enderecos.cep || !customer.enderecos.observacoes || !customer.enderecos.entregaPadrao || !customer.enderecos.cobrancaPadrao || !customer.enderecos.residencialPadrao){
            throw {messageCode: "CUS400005"}
        }

        const customerQuery = `INSERT INTO public.clientes (cli_nome, cli_dt_nascimento, cli_cpf, cli_genero, cli_telefone, cli_email, cli_senha) VALUES( $1, $2, $3, $4, $5, $6, $7) RETURNING cli_id;`;
        const customerValues = [nome, dataNascimento, cpf, genero, telefone, email, senha];
    
        const newCustomer = (await db.query(customerQuery, customerValues)).rows[0];

        await Address.create(newCustomer.cli_id,enderecos);
        
    }catch(error){
        console.log(error);
        if (error.messageCode === "CUS400002") {
            throw { message: "Email já cadastrado", messageCode: "CUS400002", code: 400 };
        }

        if (error.messageCode === "CUS400003") {
            throw { message: "CPF já cadastrado", messageCode: "CUS400003", code: 400 };
        }

        if (error.messageCode === "CUS400004") {
            throw { message: "Número de telefone já cadastrado", messageCode: "CUS400004", code: 400 };
        }

        if (error.messageCode === "CUS400005") {
            throw { message: "Dados obrigatórios não informado", messageCode: "CUS400005", code: 400 };
        }

        throw { message: "Erro ao cadastrar usuário", messageCode: "CUS5000003", code: 500 };
    }
},

Customer.updateInfos = async(updates, customerId) => {

    try {
        const { nome, dataNascimento, cpf, genero, telefone, email } = updates;
        const fields = [];
        
        if (nome) fields.push(`cli_nome = '${nome}'`);
        if (dataNascimento) fields.push(`cli_dt_nascimento = '${dataNascimento}'`);
        if (cpf) fields.push(`cli_cpf = '${cpf}'`);
        if (genero) fields.push(`cli_genero = '${genero}'`);
        if (telefone) fields.push(`cli_telefone = '${telefone}'`);
        if (email) fields.push(`cli_email = '${email}'`)
        
        const query = `UPDATE clientes SET ${fields.join(', ')}WHERE cli_id = $1`;
        const values = [customerId]
        await db.query(query,values);
    } catch (error) {
        throw { message: "Erro ao atualizar dados do usuário", messageCode: "CUS5000004", code: 500 };  
    }
}

Customer.updatePassword = async(updates, customerId) => {
    const senhaAtual = await db.query(`SELECT cli_senha FROM public.clientes WHERE cli_id = '${customerId}'`).then(result => result.rows[0].cli_senha);

    if(senhaAtual != updates.senhaAtual){
        throw {messageCode: "CUS400001"}
    }

    if(updates.repitaNovaSenha != updates.novaSenha){
        throw {messageCode: "CUS400002"}
    }

    try {
        const query = `UPDATE public.clientes SET cli_senha = $1 WHERE cli_id = $2`;
        const values = [updates.novaSenha, customerId]
        await db.query(query,values);        
    } catch (error) {
        if (error.messageCode === "CUS400001") {
            throw { message: "Senha atual incorreta", messageCode: "CUS400001", code: 400 };
        }

        if (error.messageCode === "CUS400002") {
            throw { message: "A nova senha e a senha repetida não são iguais", messageCode: "CUS400002", code: 400 };
        }

        throw { message: "Erro ao atualizar a senha do cliente", messageCode: "CUS500001", code: 500 };
    }
}

module.exports = Customer;
