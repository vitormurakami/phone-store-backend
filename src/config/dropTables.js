const db = require('./db')

async function dropTables(){

    const sql = `
      DROP TABLE IF EXISTS public.endereco;
      DROP TABLE IF EXISTS public.cliente;
      DROP TABLE IF EXISTS public.admin;

      DROP TRIGGER IF EXISTS padrao_trigger ON endereco;
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