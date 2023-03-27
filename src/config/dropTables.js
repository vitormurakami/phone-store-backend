const db = require('./db')

async function dropTables(){

    const sql = `
      DROP TABLE IF EXISTS public.cartoes CASCADE;
      DROP TABLE IF EXISTS public.enderecos CASCADE;
      DROP TABLE IF EXISTS public.clientes CASCADE;
      DROP TABLE IF EXISTS public.admins CASCADE;
      DROP TABLE IF EXISTS public.bandeiras CASCADE;

      DROP TRIGGER IF EXISTS padrao_trigger ON enderecos CASCADE;
      DROP FUNCTION IF EXISTS atualiza_padrao() CASCADE;
      DROP TYPE IF EXISTS status_cliente CASCADE;

      DROP TRIGGER IF EXISTS crt_preferencial_trigger ON cartoes CASCADE;
      DROP FUNCTION IF EXISTS atualiza_crt_preferencial() CASCADE;

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