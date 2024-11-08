FROM node:14-alpine

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o package.json e o package-lock.json para o container
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante do código da aplicação
COPY . .

# Compila a aplicação React para produção
RUN npm run build

# Usa o servidor web nginx para servir os arquivos estáticos
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Exponha a porta do container (geralmente 80 para aplicações servidas por nginx)
EXPOSE 80

# Comando para iniciar o servidor nginx
CMD ["nginx", "-g", "daemon off;"]