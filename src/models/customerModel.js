const db = require("../config/db");

const Customer = {};

Customer.login = async(credential) => {
    const query = `SELECT cliente_id FROM cliente WHERE email = $1 AND senha = $2`;
    const value = [`${credential.email}`, `${credential.password}`]

    return await db.query(query,value);
}

Customer.getInfo = async(customerId) => {
    const query = `SELECT c.cliente_id, nome, data_nascimento, numero_documento, genero, numero_telefone, status, email, endereco_id, apelido, tipo_residencia, tipo_logradouro, logradouro, numero, bairro, cidade, estado, pais, cep, observacoes, entrega_padrao, cobranca_padrao, residencial_padrao FROM cliente c INNER JOIN endereco e ON c.cliente_id = e.cliente_id WHERE c.cliente_id = $1`
    const value = [`${customerId}`]

    const result = await db.query(query,value);
    return result.rows[0]
}

Customer.create = async(customer) => {

    try{
        const emailExist = await db.query(`SELECT COUNT(*) FROM public.cliente WHERE email = '${customer.email}'`).then(result => result.rows[0].count);
        if (emailExist > 0) {
            throw new Error('Email já cadastrado');
        }
    
        const cpfExist = await db.query(`SELECT COUNT(*) FROM public.cliente WHERE numero_documento = '${customer.documentNumber}'`).then(result => result.rows[0].count);
        if (cpfExist > 0) {
            throw new Error('Documento já cadastrado');
        }
    
        const phoneExist = await db.query(`SELECT COUNT(*) FROM public.cliente WHERE numero_telefone = '${customer.phoneNumber}'`).then(result => result.rows[0].count);
        if (phoneExist > 0) {
            throw new Error('Número de telefone já cadastrado');
        }

        const customerQuery = `INSERT INTO public.cliente (nome, data_nascimento, numero_documento, genero, numero_telefone, email, senha) VALUES( $1, $2, $3, $4, $5, $6, $7)`;
        const customerValues = [customer.fullName, customer.birthDate, customer.documentNumber, customer.gender, customer.phoneNumber, customer.email, customer.password];
    
        await db.query(customerQuery, customerValues);
    
        const addressQuery = `INSERT INTO public.endereco (cliente_id, apelido, tipo_residencia, tipo_logradouro, logradouro, numero, bairro, cidade, estado, pais, cep, observacoes, entrega_padrao, cobranca_padrao, residencial_padrao) VALUES ((SELECT cliente_id FROM public.cliente WHERE email = '${customer.email}'), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
        
        const addressValues = [customer.address.nickname, customer.address.residenceType, customer.address.streetType, customer.address.street, customer.address.number, customer.address.neighborhood, customer.address.city, customer.address.state, customer.address.country, customer.address.zip, customer.address.observations, customer.address.standardDelivery, customer.address.standardBilling, customer.address.standardResidential];
    
        await db.query(addressQuery, addressValues);
    }catch(error){
        if (error.message === 'Email já cadastrado') {
            throw new Error('Erro ao cadastrar usuário: Email já cadastrado');
        } else if (error.message === 'Documento já cadastrado') {
            throw new Error('Erro ao cadastrar usuário: Documento já cadastrado');
        } else if (error.message === 'Número de telefone já cadastrado') {
            throw new Error('Erro ao cadastrar usuário: Número de telefone já cadastrado');
        } else {
            console.log(error)
            throw new Error('Erro ao cadastrar usuário');
        }
    }
},

Customer.updateInfos = async(updates, id) => {

    try {
        const { fullName, birthDate, documentNumber, gender, phoneNumber, status, email } = updates;

        const fields = [];
        
        if (fullName) fields.push(`nome = '${fullName}'`);
        if (birthDate) fields.push(`data_nascimento = '${birthDate}'`);
        if (documentNumber) fields.push(`numero_documento = '${documentNumber}'`);
        if (gender) fields.push(`genero = '${gender}'`);
        if (phoneNumber) fields.push(`numero_telefone = '${phoneNumber}'`);
        if (email) fields.push(`email = '${email}'`)
        if (status) fields.push(`status = '${status}'`);

        console.log(status)
        
        const query = `UPDATE cliente SET ${fields.join(', ')}WHERE cliente_id = $1`;
        const values = [id]
        await db.query(query,values);
    } catch (error) {
        throw new Error('Erro ao cadastrar usuário');   
    }
}
/*

Cliente.create = async(cliente) => {
    const query = "INSERT INTO public.cliente (nome,data_nascimento,numero_documento,genero,numero_telefone, status, email, senha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8); "
    const values = [`${cliente.nome}`, `${cliente.data_nascimento}`, `${cliente.numero_documento}` , `${cliente.genero}`, `${cliente.numero_telefone}`, `${cliente.status}`, `${cliente.email}`, `${cliente.senha}`]

    return await db.query(query, values);
}

Cliente.update = async(updates, id) => {
    const columns = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
  
    const values = Object.values(updates);

    const result = await db.query(
        `UPDATE public.cliente SET ${columns} WHERE cliente_id = $${Object.keys(updates).length + 1}`,
        [...values, id],
      );
    
    return result;
}

Cliente.delete = async(id) => {
    return db.query(`DELETE FROM public.cliente WHERE cliente_id = ${id}`)
}

Cliente.getOneById = async(id) => {
    const query = {
        text: "SELECT cliente_id, nome, status, to_char(data_nascimento, 'DD-MM-YYYY'), genero, numero_documento, email, numero_telefone FROM public.cliente WHERE cliente_id = $1",
        values: [id],
    };
    const result = await db.query(query);
    return result.rows[0];
};
*/

module.exports = Customer;
