const db = require("../config/db");

const Endereco = {};

Endereco.create = async(endereco) => {
    let query = `INSERT INTO endereco (cliente_id, apelido, tipo_residencia, tipo_logradouro, logradouro, numero, bairro, cidade, estado, pais, cep, observacoes, entrega_padrao, cobranca_padrao, residencial_padrao) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15);`
    const values = [endereco.cliente_id, endereco.apelido, endereco.tipo_residencia, endereco.tipo_logradouro, endereco.logradouro, endereco.numero, endereco.bairro, endereco.cidade, endereco.estado, endereco.pais, endereco.cep, endereco.observacoes, endereco.entrega_padrao, endereco.cobranca_padrao, endereco.residencial_padrao];

    await db.query(query, values);
}

Endereco.getAllByCliente = async(cliente_id) => {
    return (await db.query(`SELECT * FROM public.endereco WHERE cliente_id = ${cliente_id}`)).rows
}

Endereco.getOneByClient = async(cliente_id, enderecoId) => {
    return (await db.query(`SELECT * FROM public.endereco WHERE cliente_id = ${cliente_id} AND endereco_id = ${enderecoId}`)).rows 
}

Endereco.update = async(fieldsToUpdate, cliente_id, enderecoId) => {  

    const query = `UPDATE endereco SET ${Object.keys(fieldsToUpdate).map((key, i) => `${key}=$${i + 1}`).join(',')} WHERE endereco_id=$${Object.keys(fieldsToUpdate).length + 1} AND cliente_id=$${Object.keys(fieldsToUpdate).length + 2}`;
    const values = [...Object.values(fieldsToUpdate), enderecoId, cliente_id];

  await db.query(query, values)
}

Endereco.delete = async (cliente_id, enderecoId) => {
    return await db.query(`DELETE FROM public.endereco WHERE cliente_id = ${cliente_id} AND endereco_id = ${enderecoId}`);
};


module.exports = Endereco;
