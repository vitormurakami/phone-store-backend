const db = require("../config/db");

const Customer = {};

Customer.login = async(credential) => {
    const query = `SELECT cli_id FROM clientes WHERE cli_email = $1 AND cli_senha = $2`;
    const value = [`${credential.email}`, `${credential.senha}`]

    return await db.query(query,value);
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

    const result = await db.query(query,value);
    return result.rows[0]
}

Customer.create = async(customer) => {

    const {nome, dataNascimento, cpf, genero, telefone, email, senha, enderecos } = customer;

    try{
        const emailExist = await db.query(`SELECT COUNT(*) FROM public.clientes WHERE cli_email = '${email}'`).then(result => result.rows[0].count);
        if (emailExist > 0) {
            throw new Error('Email já cadastrado');
        }
    
        const cpfExist = await db.query(`SELECT COUNT(*) FROM public.clientes WHERE cli_cpf = '${cpf}'`).then(result => result.rows[0].count);
        if (cpfExist > 0) {
            throw new Error('Documento já cadastrado');
        }
    
        const phoneExist = await db.query(`SELECT COUNT(*) FROM public.clientes WHERE cli_telefone = '${telefone}'`).then(result => result.rows[0].count);
        if (phoneExist > 0) {
            throw new Error('Número de telefone já cadastrado');
        }

        const customerQuery = `INSERT INTO public.clientes (cli_nome, cli_dt_nascimento, cli_cpf, cli_genero, cli_telefone, cli_email, cli_senha) VALUES( $1, $2, $3, $4, $5, $6, $7)`;
        const customerValues = [nome, dataNascimento, cpf, genero, telefone, email, senha];
    
        await db.query(customerQuery, customerValues);
    
        const addressQuery = `INSERT INTO public.enderecos (end_cli_id, end_apelido, end_tipo_residencia, end_tipo_logradouro, end_logradouro, end_numero, end_bairro, end_cidade, end_estado, end_pais, end_cep, end_observacoes, end_entrega_padrao, end_cobranca_padrao, end_residencial_padrao) VALUES ((SELECT cli_id FROM public.clientes WHERE cli_email = '${email}'), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`;
        
        const addressValues = [enderecos.apelido, enderecos.tipoResidencia, enderecos.tipoLogradouro, enderecos.logradouro, enderecos.numero, enderecos.bairro, enderecos.cidade, enderecos.estado, enderecos.pais, enderecos.cep, enderecos.observacoes, enderecos.entregaPadrao, enderecos.cobrancaPadrao, enderecos.residencialPadrao];
    
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
