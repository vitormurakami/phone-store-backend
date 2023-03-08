const db = require('./db')

async function dropTables(){

    const sql = `
      DROP TABLE public.endereco;
      DROP TABLE public.cliente;
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