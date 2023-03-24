const db = require("../config/db");

const Admin = {};

Admin.login = async(credential) => {
    const query = `SELECT adm_id FROM admins WHERE adm_email = $1 AND adm_senha = $2`;
    const value = [`${credential.email}`, `${credential.senha}`]

    return await db.query(query,value);
}

Admin.getCustomersByFilters = async (filters) => {
    const { clienteId, nome, dataNascimentoMax, dataNascimentoMin, cpf, genero, telefone, statusAtivo, statusInativo, email } = filters;

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
    if (genero) sql += ` AND cli_genero = '${genero}'`;
    if (telefone) sql += ` AND cli_telefone = '${telefone}'`;
    if (statusAtivo && statusInativo) {
        sql += " AND cli_status = 'Ativo' OR cli_status = 'Inativo'"
    } else if (statusAtivo) {
        sql += " AND cli_status = 'Ativo'"
    } else if (statusInativo) {
        sql += " AND cli_status = 'Inativo'"
    };
    if (email) sql += ` AND cli_email LIKE '%${email}%'`;

    return await db.query(sql);
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
    const result = await db.query(query);
    return result.rows[0];
};

Admin.activateCustomer = async(id) => {
    const query = {
        text: "UPDATE public.clientes SET cli_status='Ativo' WHERE cli_id = $1;",
        values: [id],
    };
    await db.query(query);
},

Admin.inactivateCustomer = async(id) => {
    const query = {
        text: "UPDATE public.clientes SET cli_status='Inativo' WHERE cli_id = $1;",
        values: [id],
    };
    await db.query(query);
}
module.exports = Admin;
