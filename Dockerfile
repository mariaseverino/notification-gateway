# Usa a imagem oficial do Node.js
FROM node:24-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependência primeiro (aproveita o cache do Docker)
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies como o tsx)
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta da aplicação
EXPOSE 3333

# Comando para iniciar a aplicação em modo desenvolvimento
CMD ["npm", "run", "dev"]