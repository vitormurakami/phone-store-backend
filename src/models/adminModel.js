const db = require("../config/db");

const Admin = {};

Admin.login = async(credential) => {
    const query = `SELECT admin_id FROM admin WHERE email = $1 AND password = $2`;
    const value = [`${credential.email}`, `${credential.password}`]

    return await db.query(query,value);
}

Admin.getCustomersByFilters = async (filters) => {
    const { cliente_id, nome, data_nascimento_max, data_nascimento_min, numero_documento, genero, numero_telefone, status_ativo, status_inativo, email } = filters;

    let sql = "SELECT cliente_id, nome, genero, to_char(data_nascimento, 'DD-MM-YYYY') as data_nascimento, status FROM cliente WHERE 1=1";

    if (cliente_id) sql += ` cliente_id LIKE '%${cliente_id}%'`
    if (nome) sql += ` AND nome ILIKE '%${nome}%'`;
    if (data_nascimento_min) sql += ` AND data_nascimento >= '${data_nascimento_min}'`;
    if (data_nascimento_max) sql += ` AND data_nascimento <= '${data_nascimento_max}'`;
    if (numero_documento) sql += ` AND numero_documento ILIKE '%${numero_documento}%'`;
    if (genero) sql += ` AND genero = '${genero}'`;
    if (numero_telefone) sql += ` AND numero_telefone = '${numero_telefone}'`;
    if (status_ativo && status_inativo) {
        sql += " AND status = 'ATIVO' OR status = 'INATIVO'"
    } else if (status_ativo) {
        sql += " AND status = 'ATIVO'"
    } else if (status_inativo) {
        sql += " AND status = 'INATIVO'"
    };
    if (email) sql += ` AND email LIKE '%${email}%'`;

    return await db.query(sql);
};

Admin.geCustomerById = async(id) => {
    const query = {
        text: "SELECT cliente_id, nome, status, to_char(data_nascimento, 'DD-MM-YYYY'), genero, numero_documento, email, numero_telefone FROM public.cliente WHERE cliente_id = $1",
        values: [id],
    };
    const result = await db.query(query);
    return result.rows[0];
};

Admin.activateCustomer = async(id) => {
    const query = {
        text: "UPDATE public.cliente SET status='ACTIVE' WHERE cliente_id = $1;",
        values: [id],
    };
    await db.query(query);
},

Admin.inactivateCustomer = async(id) => {
    const query = {
        text: "UPDATE public.cliente SET status='INACTIVE' WHERE cliente_id = $1;",
        values: [id],
    };
    await db.query(query);
}
module.exports = Admin;
