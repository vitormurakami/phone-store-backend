const db = require('./db')

async function createTables(){

    const sql = `
    CREATE TYPE status_cliente AS ENUM ('ACTIVE', 'INACTIVE');

    CREATE TABLE cliente (cliente_id SERIAL PRIMARY KEY, nome VARCHAR(255) NOT NULL, data_nascimento DATE NOT NULL, numero_documento VARCHAR(20) NOT NULL, genero VARCHAR(10) NOT NULL, numero_telefone VARCHAR(20) NOT NULL, status status_cliente NOT NULL DEFAULT 'ACTIVE', email VARCHAR(255) NOT NULL, senha VARCHAR(10) NOT NULL);
      
    INSERT INTO public.cliente (nome,data_nascimento,numero_documento,genero,numero_telefone, email, senha) VALUES ('João Silva','1985-03-14','123.456.789-00','Masculino','(11) 99999-9999', 'joaosilva@gmail.com', '123456');

    INSERT INTO public.cliente (nome,data_nascimento,numero_documento,genero,numero_telefone, email, senha) VALUES ('Fulano da Silva','1998-01-19','123.456.789-00','Masculino','(11) 99999-9999', 'fulanodaSilva@outlook.com', '123456');
      
    INSERT INTO public.cliente (nome,data_nascimento,numero_documento,genero,numero_telefone, email, senha) VALUES ('Rosa Laura da Mota','1993-03-06','969.474.187-47','Feminino','(27) 98250-1022','rosalaura@gmail.com', '123456');

    INSERT INTO public.cliente (nome,data_nascimento,numero_documento,genero,numero_telefone, email, senha) VALUES ('Lais Nair Joana Dias','1994-03-02','899.841.760-02','Feminino','(11) 99886-82232','laisdias@outlook.com', '123456');

    CREATE TABLE endereco ( endereco_id SERIAL PRIMARY KEY,  cliente_id INTEGER NOT NULL REFERENCES cliente (cliente_id) ON DELETE RESTRICT, apelido VARCHAR(255) NOT NULL, tipo_residencia VARCHAR(255) NOT NULL, tipo_logradouro VARCHAR(255) NOT NULL, logradouro VARCHAR(255) NOT NULL, numero VARCHAR(20) NOT NULL, bairro VARCHAR(255) NOT NULL, cidade VARCHAR(255) NOT NULL, estado VARCHAR(255) NOT NULL, pais VARCHAR(255) NOT NULL, cep VARCHAR(20) NOT NULL, observacoes TEXT, entrega_padrao BOOLEAN DEFAULT FALSE, cobranca_padrao BOOLEAN DEFAULT FALSE, residencial_padrao BOOLEAN DEFAULT FALSE);

    INSERT INTO endereco (cliente_id, apelido, tipo_residencia, tipo_logradouro, logradouro, numero, bairro, cidade, estado, pais, cep, observacoes, entrega_padrao, cobranca_padrao, residencial_padrao) VALUES (1, 'Casa Principal', 'Casa', 'Rua', 'Rua Principal', '123', 'Centro', 'São Paulo', 'SP', 'Brasil', '01234-567', 'Próximo à praça', TRUE, TRUE, TRUE);

    INSERT INTO endereco (cliente_id, apelido, tipo_residencia, tipo_logradouro, logradouro, numero, bairro, cidade, estado, pais, cep, observacoes, entrega_padrao, cobranca_padrao, residencial_padrao) VALUES (2, 'Escritório', 'Casa', 'Avenida', 'Avenida Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', 'Brasil', '01234-567', 'Próximo à estação de metrô', TRUE, TRUE, TRUE);

    INSERT INTO endereco (cliente_id, apelido, tipo_residencia, tipo_logradouro, logradouro, numero, bairro, cidade, estado, pais, cep, observacoes, entrega_padrao, cobranca_padrao, residencial_padrao) VALUES (3, 'Cobrança', 'Apartamento', 'Rua', 'Rua das Flores', '456', 'Jardim das Flores', 'São Paulo', 'SP', 'Brasil', '01234-567', 'Próximo ao supermercado', TRUE, TRUE, TRUE);

    INSERT INTO endereco (cliente_id, apelido, tipo_residencia, tipo_logradouro, logradouro, numero, bairro, cidade, estado, pais, cep, observacoes, entrega_padrao, cobranca_padrao, residencial_padrao) VALUES (4, 'Casa Nova', 'Casa', 'Rua', 'Rua das Palmeiras', '789', 'Jardim das Palmeiras', 'Rio de Janeiro', 'RJ', 'Brasil', '12345-678', NULL, TRUE, TRUE, TRUE);

    CREATE TABLE admin (admin_id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(10) NOT NULL);

    INSERT INTO admin (name, email, password) VALUES ('John Doe', 'johndoe@phonestore.com', '123456');
    
    CREATE OR REPLACE FUNCTION atualiza_padrao() RETURNS TRIGGER AS $$
    BEGIN
        IF (NEW.entrega_padrao = TRUE) THEN
            UPDATE endereco SET entrega_padrao = FALSE WHERE cliente_id = NEW.cliente_id AND endereco_id <> NEW.endereco_id AND EXISTS (SELECT 1 FROM endereco WHERE cliente_id = NEW.cliente_id AND endereco_id <> NEW.endereco_id AND entrega_padrao <> FALSE);
        END IF;
    
        IF (NEW.cobranca_padrao = TRUE) THEN
            UPDATE endereco SET cobranca_padrao = FALSE WHERE cliente_id = NEW.cliente_id AND endereco_id <> NEW.endereco_id AND EXISTS (SELECT 1 FROM endereco WHERE cliente_id = NEW.cliente_id AND endereco_id <> NEW.endereco_id AND cobranca_padrao <> FALSE);
        END IF;
    
        IF (NEW.residencial_padrao = TRUE) THEN
            UPDATE endereco SET residencial_padrao = FALSE WHERE cliente_id = NEW.cliente_id AND endereco_id <> NEW.endereco_id AND EXISTS (SELECT 1 FROM endereco WHERE cliente_id = NEW.cliente_id AND endereco_id <> NEW.endereco_id AND residencial_padrao <> FALSE);
        END IF;
    
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER padrao_trigger
    BEFORE INSERT OR UPDATE ON endereco
    FOR EACH ROW
    EXECUTE FUNCTION atualiza_padrao();

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