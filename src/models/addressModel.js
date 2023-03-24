const db = require("../config/db")

const Address = {};

Address.create = async(customerId, address) => {
    const query = `
    INSERT INTO public.enderecos (
        end_cli_id, 
        end_apelido, 
        end_tipo_residencia, 
        end_tipo_logradouro, 
        end_logradouro, 
        end_numero, 
        end_bairro, 
        end_cidade, 
        end_estado, 
        end_pais, 
        end_cep, 
        end_observacoes, 
        end_entrega_padrao, 
        end_cobranca_padrao, 
        end_residencial_padrao
    ) VALUES (
        (SELECT cli_id FROM public.clientes WHERE cli_id = '${customerId}'), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
    )`;
    const values = [address.apelido, address.tipoResidencia, address.tipoLogradouro, address.logradouro, address.numero, address.bairro, address.cidade, address.estado, address.pais, address.cep, address.observacoes, address.entregaPadrao, address.cobrancaPadrao, address.residencialPadrao];
    
    await db.query(query, values);
}

Address.getAll = async(customerId) => {
    const query = `
    SELECT 
        end_id as "enderecoId",
        end_apelido as "apelido",
        end_tipo_logradouro as "tipoLogradouro",
        end_logradouro as "logradouro",
        end_numero as "numero",
        end_bairro as "bairro",
        end_entrega_padrao as "entregaPadrao",
        end_cobranca_padrao as "cobrancaPadrao",
        end_residencial_padrao as "residencialPadrao"
    FROM 
        public.enderecos WHERE end_cli_id = $1`;
    const value = [customerId];

    const result = await db.query(query,value);
    return result.rows;
}

Address.getAddressById = async(customerId, addressId) => {
    const query = `
    SELECT 
        end_id as "enderecoId",
        end_apelido as "apelido",
        end_tipo_residencia as "tipoResidencia",
        end_tipo_logradouro as "tipoLogradouro",
        end_logradouro as "logradouro",
        end_numero as "numero",
        end_bairro as "bairro", 
        end_cidade as "cidade",
        end_estado as "estado",
        end_pais as "pais",
        end_cep as "cep",
        end_observacoes as "observacoes",
        end_entrega_padrao as "entregaPadrao", 
        end_cobranca_padrao as "cobrancaPadrao",
        end_residencial_padrao as "residencialPadrao"
    FROM 
        public.enderecos WHERE end_cli_id = $1 AND end_id = $2`;
    const value = [customerId, addressId];

    const result = await db.query(query,value);
    return result.rows[0];
}

Address.delete = async(customerId, addressId) => {
    return db.query(`
    DELETE 
    FROM public.enderecos 
    WHERE end_cli_id = ${customerId} AND end_id = ${addressId}`
    )
}

Address.update = async(customerId, addressId, updates) => {
    try {
        const { apelido, tipoResidencia, tipoLogradouro, logradouro, numero, bairro, cidade, estado, pais, cep, observacoes, entregaPadrao, cobrancaPadrao, residencialPadrao} = updates;
        const fields = [];
        
        if (apelido) fields.push(`end_apelido = '${apelido}'`);
        if (tipoResidencia) fields.push(`end_tipo_residencia = '${tipoResidencia}'`);
        if (tipoLogradouro) fields.push(`end_tipo_logradouro = '${tipoLogradouro}'`);
        if (logradouro) fields.push(`end_logradouro = '${logradouro}'`);
        if (numero) fields.push(`end_numero = '${numero}'`);
        if (bairro) fields.push(`end_bairro = '${bairro}'`);
        if (cidade) fields.push(`end_cidade = '${cidade}'`);
        if (estado) fields.push(`end_estado = '${estado}'`);
        if (pais) fields.push(`end_pais = '${pais}'`);
        if (cep) fields.push(`end_cep = '${cep}'`);
        if (observacoes) fields.push(`end_observacoes = '${observacoes}'`);
        if (entregaPadrao) fields.push(`end_entrega_padrao = '${entregaPadrao}'`);
        if (cobrancaPadrao) fields.push(`end_cobranca_padrao = '${cobrancaPadrao}'`);
        if (residencialPadrao) fields.push(`end_residencial_padrao = '${residencialPadrao}'`);

        const query = `UPDATE public.enderecos SET ${fields.join(', ')} WHERE end_id = $1 AND end_cli_id = $2`;
        const values = [addressId, customerId]
        await db.query(query,values);
    } catch (error) {
        throw new Error('Erro ao atualizar endereço');   
    }
}


module.exports = Address;