const db = require("../config/db");

const Cliente = {};

Cliente.login = async(credential) => {
    const query = `SELECT cliente_id FROM cliente WHERE email = $1 AND senha = $2`;
    const value = [`${credential.email}`, `${credential.senha}`]

    return await db.query(query,value);
}

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

Cliente.getAll = async (filters) => {
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

Cliente.getOneById = async(id) => {
    const query = {
        text: "SELECT cliente_id, nome, status, to_char(data_nascimento, 'DD-MM-YYYY'), genero, numero_documento, email, numero_telefone FROM public.cliente WHERE cliente_id = $1",
        values: [id],
    };
    const result = await db.query(query);
    return result.rows[0];
};

module.exports = Cliente;
