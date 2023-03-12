const db = require('./db')

async function createTables(){

    const sql = `
    CREATE TABLE cliente (clienteId SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, dataNascimento DATE NOT NULL, numeroDocumento VARCHAR(20) NOT NULL, genero VARCHAR(10) NOT NULL, numeroTelefone VARCHAR(20) NOT NULL, status VARCHAR(7) NOT NULL, email VARCHAR(255) NOT NULL);
      
    INSERT INTO public.cliente (nome,dataNascimento,numeroDocumento,genero,numeroTelefone, status, email) VALUES ('João Silva','1985-03-14','123.456.789-00','Masculino','(11) 99999-9999', 'ATIVO', 'joaosilva@gmail.com');

    INSERT INTO public.cliente (nome,dataNascimento,numeroDocumento,genero,numeroTelefone, status, email) VALUES ('Fulano da Silva','1998-01-19','123.456.789-00','Masculino','(11) 99999-9999', 'INATIVO', 'fulanodaSilva@outlook.com');
      
    INSERT INTO public.cliente (nome,dataNascimento,numeroDocumento,genero,numeroTelefone, status, email) VALUES ('Rosa Laura da Mota','1993-03-06','969.474.187-47','Feminino','(27) 98250-1022', 'ATIVO', 'rosalaura@gmail.com');

    INSERT INTO public.cliente (nome,dataNascimento,numeroDocumento,genero,numeroTelefone, status, email) VALUES ('Lais Nair Joana Dias','1994-03-02','899.841.760-02','Feminino','(11) 99886-82232', 'INATIVO', 'laisdias@outlook.com');

    CREATE TABLE endereco ( enderecoId SERIAL PRIMARY KEY, clienteId INTEGER REFERENCES cliente (clienteId), apelido VARCHAR(50) NOT NULL, tipoResidencia VARCHAR(20) NOT NULL, tipoLogradouro VARCHAR(20) NOT NULL, logradouro VARCHAR(100) NOT NULL, numero varchar(20) NOT NULL, bairro varchar(100) NOT NULL, city VARCHAR(100) NOT NULL, estado VARCHAR(100) NOT NULL, pais VARCHAR(100) NOT NULL, cep VARCHAR(100) NOT NULL, observacoes VARCHAR(255));

    INSERT INTO public.endereco ( clienteId, apelido, tipoResidencia, tipoLogradouro, logradouro, numero, bairro, city, estado, pais, cep, observacoes) VALUES ( 1, 'Casa', 'Casa', 'Rua', 'Rua das Flores', '123', 'Jardim das Oliveiras', 'São Paulo', 'São Paulo', 'Brasil', '12345-678', 'Próximo à padaria');
    
    `

    db.query(sql)
      .then(() => {
        console.log('---Tabelas criada e populadas com sucesso---');
      })
      .catch((error) => {
        console.log('Erro ao criar tabela: ' + error);
      });
}

createTables();