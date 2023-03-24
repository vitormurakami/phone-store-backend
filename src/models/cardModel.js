const db = require("../config/db")

const Card = {};

Card.create = async(customerId, card) => {
    const query = `
    INSERT INTO public.cartoes (
        crt_cli_id, 
        crt_bnd_id, 
        crt_numero_impresso, 
        crt_nome_impresso, 
        crt_codigo_seguranca, 
        crt_preferencial
    ) VALUES (
        (SELECT cli_id FROM public.clientes WHERE cli_id = '${customerId}'),
        (SELECT bnd_id FROM public.bandeiras WHERE bnd_id = '${card.bandeiraId}'), $1, $2, $3, $4)`;

    const values = [card.numeroImpresso, card.nomeImpresso, card.codigoSeguranca, card.preferencial];
    
    await db.query(query, values);
}

Card.getAll = async(customerId) => {
    const query = `
    SELECT 
        crt_id as "cartaoId", 
        RIGHT(crt_numero_impresso,4) as "finalNumeroImpresso", 
        bnd_nome as "nomeBandeira", 
        crt_preferencial as "preferencial"
    FROM 
        cartoes INNER JOIN bandeiras ON crt_bnd_id = bnd_id 
    WHERE 
        crt_cli_id = ${customerId}`;
    const result = await db.query(query);
    return result.rows;
}

Card.delete = async(customerId, cardId) => {
    const query = `DELETE FROM public.cartoes WHERE crt_cli_id = ${customerId} AND crt_id = ${cardId}`
    
    return await db.query(query);
}

module.exports = Card;
