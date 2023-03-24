const db = require('./db')

async function dropTables(){

    const sql = `
      DROP TABLE IF EXISTS public.cartoes;
      DROP TABLE IF EXISTS public.enderecos;
      DROP TABLE IF EXISTS public.clientes;
      DROP TABLE IF EXISTS public.admins;
      DROP TABLE IF EXISTS public.bandeiras;

      DROP TRIGGER IF EXISTS padrao_trigger ON enderecos;
      DROP FUNCTION IF EXISTS atualiza_padrao();
      DROP TYPE IF EXISTS status_cliente;

    `

    db.query(sql)
      .then(() => {
        console.log('---Tabelas excluidas com sucesso---');
      })
      .catch((error) => {
        console.log('Erro ao excluir tabela: ' + error);
      });
}

dropTables();