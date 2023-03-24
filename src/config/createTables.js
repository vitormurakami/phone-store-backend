const db = require('./db')

async function createTables(){

    const sql = `
    CREATE TYPE status_cliente AS ENUM ('Ativo', 'Inativo');

    CREATE TABLE clientes (
        cli_id SERIAL PRIMARY KEY,
        cli_nome VARCHAR(255) NOT NULL,
        cli_dt_nascimento DATE NOT NULL,
        cli_cpf VARCHAR(20) NOT NULL,
        cli_genero VARCHAR(10) NOT NULL,
        cli_telefone VARCHAR(20) NOT NULL,
        cli_status status_cliente NOT NULL DEFAULT 'Ativo',
        cli_email VARCHAR(255) NOT NULL,
        cli_senha VARCHAR(10) NOT NULL
    );

    INSERT INTO public.clientes (cli_nome,cli_dt_nascimento,cli_cpf,cli_genero,cli_telefone,cli_email,cli_senha) VALUES ('João Silva','1985-03-14','123.456.789-00','Masculino','(11) 99999-9999', 'joaosilva@gmail.com', '123456');
    INSERT INTO public.clientes (cli_nome,cli_dt_nascimento,cli_cpf,cli_genero,cli_telefone,cli_email,cli_senha) VALUES ('Fulano da Silva','1998-01-19','123.456.789-00','Masculino','(11) 99999-9999', 'fulanodaSilva@outlook.com', '123456');
    INSERT INTO public.clientes (cli_nome,cli_dt_nascimento,cli_cpf,cli_genero,cli_telefone,cli_email,cli_senha) VALUES ('Rosa Laura da Mota','1993-03-06','969.474.187-47','Feminino','(27) 98250-1022','rosalaura@gmail.com', '123456');
    INSERT INTO public.clientes (cli_nome,cli_dt_nascimento,cli_cpf,cli_genero,cli_telefone,cli_email,cli_senha) VALUES ('Lais Nair Joana Dias','1994-03-02','899.841.760-02','Feminino','(11) 99886-82232','laisdias@outlook.com', '123456');

    CREATE TABLE enderecos ( 
      end_id SERIAL PRIMARY KEY,
      end_cli_id INTEGER NOT NULL REFERENCES clientes (cli_id) ON DELETE RESTRICT, 
      end_apelido VARCHAR(255) NOT NULL,
      end_tipo_residencia VARCHAR(255) NOT NULL,
      end_tipo_logradouro VARCHAR(255) NOT NULL,
      end_logradouro VARCHAR(255) NOT NULL,
      end_numero VARCHAR(20) NOT NULL,
      end_bairro VARCHAR(255) NOT NULL,
      end_cidade VARCHAR(255) NOT NULL,
      end_estado VARCHAR(255) NOT NULL,
      end_pais VARCHAR(255) NOT NULL,
      end_cep VARCHAR(20) NOT NULL,
      end_observacoes TEXT,
      end_entrega_padrao BOOLEAN DEFAULT FALSE, 
      end_cobranca_padrao BOOLEAN DEFAULT FALSE, 
      end_residencial_padrao BOOLEAN DEFAULT FALSE
    );

    INSERT INTO enderecos (end_cli_id, end_apelido, end_tipo_residencia, end_tipo_logradouro, end_logradouro, end_numero, end_bairro, end_cidade, end_estado, end_pais, end_cep, end_observacoes, end_entrega_padrao, end_cobranca_padrao, end_residencial_padrao) VALUES (1, 'Casa Principal', 'Casa', 'Rua', 'Rua Principal', '123', 'Centro', 'São Paulo', 'SP', 'Brasil', '01234-567', 'Próximo à praça', TRUE, TRUE, TRUE);
    INSERT INTO enderecos (end_cli_id, end_apelido, end_tipo_residencia, end_tipo_logradouro, end_logradouro, end_numero, end_bairro, end_cidade, end_estado, end_pais, end_cep, end_observacoes, end_entrega_padrao, end_cobranca_padrao, end_residencial_padrao) VALUES (2, 'Escritório', 'Casa', 'Avenida', 'Avenida Paulista', '1000', 'Bela Vista', 'São Paulo', 'SP', 'Brasil', '01234-567', 'Próximo à estação de metrô', TRUE, TRUE, TRUE);
    INSERT INTO enderecos (end_cli_id, end_apelido, end_tipo_residencia, end_tipo_logradouro, end_logradouro, end_numero, end_bairro, end_cidade, end_estado, end_pais, end_cep, end_observacoes, end_entrega_padrao, end_cobranca_padrao, end_residencial_padrao) VALUES (3, 'Cobrança', 'Apartamento', 'Rua', 'Rua das Flores', '456', 'Jardim das Flores', 'São Paulo', 'SP', 'Brasil', '01234-567', 'Próximo ao supermercado', TRUE, TRUE, TRUE);
    INSERT INTO enderecos (end_cli_id, end_apelido, end_tipo_residencia, end_tipo_logradouro, end_logradouro, end_numero, end_bairro, end_cidade, end_estado, end_pais, end_cep, end_observacoes, end_entrega_padrao, end_cobranca_padrao, end_residencial_padrao) VALUES (4, 'Casa Nova', 'Casa', 'Rua', 'Rua das Palmeiras', '789', 'Jardim das Palmeiras', 'Rio de Janeiro', 'RJ', 'Brasil', '12345-678', NULL, TRUE, TRUE, TRUE);
    
    CREATE TABLE bandeiras ( 
      bnd_id SERIAL PRIMARY KEY,
      bnd_nome VARCHAR(50) NOT NULL
    );

    INSERT INTO bandeiras (bnd_nome) VALUES ('Visa');
    INSERT INTO bandeiras (bnd_nome) VALUES ('Mastercard');
    INSERT INTO bandeiras (bnd_nome) VALUES ('Elo');
    INSERT INTO bandeiras (bnd_nome) VALUES ('American Express');
    INSERT INTO bandeiras (bnd_nome) VALUES ('Hipercard');

    CREATE TABLE cartoes (
      crt_id SERIAL PRIMARY KEY,
      crt_cli_id INTEGER NOT NULL REFERENCES clientes (cli_id) ON DELETE RESTRICT,
      crt_bnd_id INTEGER NOT NULL REFERENCES bandeiras (bnd_id) ON DELETE RESTRICT,
      crt_nome_impresso VARCHAR(100) NOT NULL,
      crt_numero_impresso VARCHAR(21) NOT NULL,
      crt_codigo_seguranca VARCHAR(3) NOT NULL,
      crt_preferencial BOOLEAN NOT NULL DEFAULT FALSE
    );

    INSERT INTO cartoes (crt_cli_id, crt_bnd_id, crt_nome_impresso, crt_numero_impresso, crt_codigo_seguranca, crt_preferencial) VALUES (1,2,'Joao Silva','1111.2222.3333.4444','456', TRUE);
    INSERT INTO cartoes (crt_cli_id, crt_bnd_id, crt_nome_impresso, crt_numero_impresso, crt_codigo_seguranca, crt_preferencial) VALUES (1,1,'Joao Silva','8888.2222.9999.4444','123', FALSE);
    INSERT INTO cartoes (crt_cli_id, crt_bnd_id, crt_nome_impresso, crt_numero_impresso, crt_codigo_seguranca, crt_preferencial) VALUES (2,4,'Fulano da Silva','1111.2222.3333.4444','999', TRUE);
    INSERT INTO cartoes (crt_cli_id, crt_bnd_id, crt_nome_impresso, crt_numero_impresso, crt_codigo_seguranca, crt_preferencial) VALUES (3,3,'Rosa Laura','5555.6666.3333.4444','456', TRUE);
    INSERT INTO cartoes (crt_cli_id, crt_bnd_id, crt_nome_impresso, crt_numero_impresso, crt_codigo_seguranca, crt_preferencial) VALUES (4,3,'Denise Campos','1111.2222.3333.4444','989', TRUE);

    CREATE TABLE admins (
      adm_id SERIAL PRIMARY KEY,
      adm_nome VARCHAR(255) NOT NULL,
      adm_email VARCHAR(255) NOT NULL,
      adm_senha VARCHAR(10) NOT NULL
    );

    INSERT INTO admins (adm_nome, adm_email, adm_senha) VALUES ('John Doe', 'johndoe@phonestore.com', '123456');
    
    CREATE OR REPLACE FUNCTION atualiza_padrao() RETURNS TRIGGER AS $$
    BEGIN
        IF (NEW.end_entrega_padrao = TRUE) THEN
            UPDATE enderecos SET end_entrega_padrao = FALSE WHERE end_cli_id = NEW.end_cli_id AND end_id <> NEW.end_id AND EXISTS (SELECT 1 FROM enderecos WHERE end_cli_id = NEW.end_cli_id AND end_id <> NEW.end_id AND end_entrega_padrao <> FALSE);
        END IF;
    
        IF (NEW.end_cobranca_padrao = TRUE) THEN
            UPDATE enderecos SET end_cobranca_padrao = FALSE WHERE end_cli_id = NEW.end_cli_id AND end_id <> NEW.end_id AND EXISTS (SELECT 1 FROM enderecos WHERE end_cli_id = NEW.end_cli_id AND end_id <> NEW.end_id AND end_cobranca_padrao <> FALSE);
        END IF;
    
        IF (NEW.end_residencial_padrao = TRUE) THEN
            UPDATE enderecos SET end_residencial_padrao = FALSE WHERE end_cli_id = NEW.end_cli_id AND end_id <> NEW.end_id AND EXISTS (SELECT 1 FROM enderecos WHERE end_cli_id = NEW.end_cli_id AND end_id <> NEW.end_id AND end_residencial_padrao <> FALSE);
        END IF;
    
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
    
    CREATE TRIGGER padrao_trigger
    BEFORE INSERT OR UPDATE ON enderecos
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