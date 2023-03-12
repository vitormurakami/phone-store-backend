const db = require("../config/db");

const Cliente = {};

Cliente.create = async(cliente) => {
    let query = "INSERT INTO public.cliente (nome,dataNascimento,numeroDocumento,genero,numeroTelefone, status, email) VALUES ($1, $2, $3, $4, $5, $6, $7); "
    const values = [`${cliente.nome}`, `${cliente.dataNascimento}`, `${cliente.numeroDocumento}` , `${cliente.genero}`, `${cliente.numeroTelefone}`, `${cliente.status}`, `${cliente.email}`,]

    return await db.query(query, values);
}

Cliente.update = async(updates, id) => {
    const columns = Object.keys(updates).map((key, index) => `${key} = $${index + 1}`).join(', ');
  
    const values = Object.values(updates);

    db.query(
        `UPDATE public.cliente SET ${columns} WHERE clienteid = $${Object.keys(updates).length + 1}`,
        [...values, id],
        (error, results) => {
          if (error) {
            throw error;
          }
        }
      );
}

Cliente.delete = async(id) => {
    db.query(`DELETE FROM public.cliente WHERE clienteid = ${id}`)
}

Cliente.getAll = async (filters) => {
    let query = "SELECT * FROM public.cliente";
    const values = [];

    if (filters.nome) {
        if (values.length == 0) {
            query += ` WHERE`;
        }
        if (values.length > 0) {
            query += ` AND`;
        }
        query += ` nome ILIKE $${values.length + 1}`;
        values.push(`%${filters.nome}%`);
    }

    if (filters.genero) {
        if (values.length == 0) {
            query += ` WHERE`;
        }
        if (values.length > 0) {
            query += ` AND`;
        }
        query += ` genero ILIKE $${values.length + 1}`;
        values.push(`${filters.genero}`);
    }

    if (filters.status) {
        if (values.length == 0) {
            query += ` WHERE`;
        }
        if (values.length > 0) {
            query += ` AND`;
        }
        query += ` status = $${values.length + 1}`;
        values.push(`${filters.status}`);
    }
    if (filters.genero) {
        if (values.length == 0) {
            query += ` WHERE`;
        }
        if (values.length > 0) {
            query += ` AND`;
        }
        query += ` genero ILIKE $${values.length + 1}`;
        values.push(`${filters.genero}`);
    }

    if (filters.datanascimentomin && filters.datanascimentomax) {
        if (values.length == 0) {
            query += ` WHERE`;
        }
        if (values.length > 0) {
            query += ` AND`;
        }
        query += ` datanascimento BETWEEN $${values.length + 1} AND $${
            values.length + 2
        }`;
        values.push(`${filters.datanascimentomin}`);
        values.push(`${filters.datanascimentomax}`);
    }

    if (filters.numerotelefone) {
        if (values.length == 0) {
            query += ` WHERE`;
        }
        if (values.length > 0) {
            query += ` AND`;
        }
        query += ` numerotelefone LIKE $${values.length + 1}`;
        values.push(`${filters.numerotelefone}`);
    }

    if (filters.numerodocumento) {
        if (values.length == 0) {
            query += ` WHERE`;
        }
        if (values.length > 0) {
            query += ` AND`;
        }
        query += ` numerodocumento LIKE $${values.length + 1}`;
        values.push(`%${filters.numerodocumento}%`);
    }

    if (filters.clienteid) {
        if (values.length == 0) {
            query += ` WHERE`;
        }
        if (values.length > 0) {
            query += ` AND`;
        }
        query += ` clienteid = $${values.length + 1}`;
        values.push(`${filters.clienteid}`);
    }
    
    if (filters.email) {
        if (values.length == 0) {
            query += ` WHERE`;
        }
        if (values.length > 0) {
            query += ` AND`;
        }
        query += ` email ILIKE $${values.length + 1}`;
        values.push(`%${filters.email}%`);
    }

    return await db.query(query, values);
};

module.exports = Cliente;
