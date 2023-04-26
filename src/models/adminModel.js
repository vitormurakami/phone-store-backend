const db = require("../config/db");

const Admin = {};

Admin.login = async(credential) => {
    const query = `SELECT adm_id FROM admins WHERE adm_email = $1 AND adm_senha = $2`;
    const value = [`${credential.email}`, `${credential.senha}`]

    try {
        const outputAdmin = await db.query(query,value);
        if(outputAdmin.rowCount === 0){
            throw {messageCode: "ADM400001"}
        }
        return outputAdmin.rows[0].cli_id;
    } catch (error) {
        console.error(error);
        if(error.messageCode === "ADM400001"){
            throw { message: "Credenciais inválidas", messageCode: "ADM40001", code: 400};
        }

        throw {message: "Erro ao buscar credencias do usuário", messageCode: "ADM500001", code: 500}
    }
}

Admin.getCustomersByFilters = async (filters) => {
    const { clienteId, nome, dataNascimentoMax, dataNascimentoMin, cpf, genero, telefone, email , status} = filters;

    let sql = `
    SELECT 
        cli_id as "clienteId",
        cli_nome as "nome", 
        cli_genero as "genero", 
        to_char(cli_dt_nascimento, 'DD/MM/YYYY') as "dataNascimento", 
        cli_status as "status" 
    FROM 
        clientes WHERE 1=1`;

    if (clienteId) sql += ` AND cli_id ='${clienteId}'`
    if (nome) sql += ` AND cli_nome ILIKE '%${nome}%'`;
    if (dataNascimentoMin) sql += ` AND cli_dt_nascimento >= '${dataNascimentoMin}'`;
    if (dataNascimentoMax) sql += ` AND cli_dt_nascimento <= '${dataNascimentoMax}'`;
    if (cpf) sql += ` AND cli_cpf ILIKE '%${cpf}%'`;
    if (genero) {
        if (Array.isArray(genero)){
            sql += ` AND cli_genero IN ('${genero.join("','")}')`
        }else{
            sql += ` AND cli_genero IN ('${genero}')`
        }
    }
    if (telefone) sql += ` AND cli_telefone = '${telefone}'`;
    if (status) {
        if (Array.isArray(status)) {
            sql += ` AND cli_status IN ('${status.join("','")}')`;
        } else {
            sql += ` AND cli_status = '${status}'`;
        }
    }
    if (email) sql += ` AND cli_email LIKE '%${email}%'`;

    sql += ' ORDER BY cli_id ASC'

    try {
        const customerList = await db.query(sql);
        
        if(customerList.rowCount === 0){
            throw {messageCode: "ADM404001"}
        }
        return customerList.rows;
    } catch (error) {
        console.error(error);
        if(error.messageCode == "ADM404001"){
            throw {message: "Cliente não encontrado", messageCode: "ADM404001", code: 404}
        }

        throw {message: "Erro ao buscar clientes", messageCode: "ADM500002", code: 500}
    }
};

Admin.geCustomerById = async(id) => {
    const query = {
        text: `
        SELECT 
            cli_id as "clienteId", 
            cli_nome as "nome", 
            cli_status as "status", 
            to_char(cli_dt_nascimento, 'DD-MM-YYYY') as "dataNascimento", 
            cli_genero as "genero", 
            cli_cpf as "cpf", 
            cli_email as "email", 
            cli_telefone as "telefone"
        FROM 
            public.clientes WHERE cli_id = $1
        `,
        values: [id],
    };

    try {
        const customer = await db.query(query);
        if(customer.rowCount === 0){
            throw {messageCode: "ADM404002"}
        }
        return customer.rows[0];
    } catch (error) {
        console.error(error)
        if(error.messageCode == "ADM404002"){
            throw {message: "Cliente não encontrado", messageCode: "ADM404002", code: 404}   
        }

        throw {message: "Ocorreu um erro ao consultar cliente", messageCode: "ADM500003", code: 500}
    }
};

Admin.activateCustomer = async(id) => {
    const query = {
        text: "UPDATE public.clientes SET cli_status='Ativo' WHERE cli_id = $1;",
        values: [id],
    };

    await Admin.geCustomerById(id);
    
    try {
        return await db.query(query);
    } catch (error) {
        console.error(error)
        throw {message: "Ocorreu um erro ao ativar o cliente", messageCode: "ADM500004", code: 500}
    }
    
};

Admin.inactivateCustomer = async(id) => {
    const query = {
        text: "UPDATE public.clientes SET cli_status='Inativo' WHERE cli_id = $1;",
        values: [id],
    };

    await Admin.geCustomerById(id);
    
    try{
        return await db.query(query);
    }catch(error){
        console.error(error)
        throw{message: "Ocorreu um erro ao ativar o cliente", messageCode: "ADM500005", code: 500}
    }
    
};
module.exports = Admin;
