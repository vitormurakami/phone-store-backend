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
    
    try{
        console.log(card)
        if(!('numeroImpresso' in card) || !('nomeImpresso' in card) || !('codigoSeguranca' in card) || !('preferencial' in card) || !('bandeiraId' in card)){
            throw {messageCode: "CAR400001"}
        }
        await db.query(query, values);
    }catch(error){
        if(error.messageCode){
            throw {message: "Dados obrigatórios não informados", messageCode: "CAR400001", code: 400}
        }
        throw {message: "Ocorreu um erro ao cadastrar cartão", messageCode: "CAR500001", code: "500"}
    }
    
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
        crt_cli_id = ${customerId}
    ORDER BY crt_id ASC`;

    try{
        const result = await db.query(query);
        return result.rows;
    }catch(error){
        console.error(error);
        throw {message: "Ocorreu um erro ao consultar cartões do usuário", messageCode: "CAR500002", code: 500}
    }
}

Card.getCardById = async(customerId, cardId) => {
    const query = `
    SELECT 
        crt_id as "cartaoId", 
        crt_numero_impresso as "numeroImpresso", 
        bnd_nome as "nomeBandeira",
        crt_codigo_seguranca as "codigoSeguranca"
    FROM 
        cartoes INNER JOIN bandeiras ON crt_bnd_id = bnd_id 
    WHERE 
        crt_cli_id = ${customerId} AND crt_id = ${cardId}
    ORDER BY crt_id ASC`;

    try{
        const result = await db.query(query);

        if(result.rowCount == 0){
            throw {messageCode: "CAR404001"}
        }
        return result.rows[0];
    }catch(error){
        console.error(error);
        if(error.messageCode == "CAR404001"){
            throw {message: "Cartão não existe", messageCode: "CAR404001", code: 404}
        }
        throw {message: "Ocorreu um erro ao consultar cartão do usuário", messageCode: "CAR500004", code: 500}
    }
}

Card.delete = async(customerId, cardId) => {
    const query = `DELETE FROM public.cartoes WHERE crt_cli_id = ${customerId} AND crt_id = ${cardId}`
    
    await Card.getCardById(customerId, cardId);
    try{
        return await db.query(query);
    }catch(error){
        throw{message:"Ocorreu um erro ao excluir o cartão", messageCode: "CAR500003", code: 500}
    }
}

Card.setPreference = async(customerId, cardId) => {
    const query = `UPDATE public.cartoes SET crt_preferencial = true WHERE crt_id = $1 AND crt_cli_id = $2`;
    const values = [cardId, customerId]

    await Card.getCardById(customerId, cardId);
    try {
        return await db.query(query,values);
    } catch (error) {
        console.error(error);
        throw {message: "Ocorreu um erro ao definir o cartão como preferencial", messageCode: "CAR500005", code: 500}
    }
}

module.exports = Card;
