const db = require('./db')

async function dropTables(){

    const sql = `
      DROP TABLE public.endereco;
      DROP TABLE public.cliente;

      DROP TRIGGER IF EXISTS padrao_trigger ON endereco;
      DROP FUNCTION IF EXISTS atualiza_padrao();
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