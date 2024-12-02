# Etapa 1: Construção da aplicação React
FROM node:14-alpine as react-build

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

# Etapa 2: Servir a aplicação com Nginx
FROM nginx:alpine

# Copia a configuração do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos compilados da etapa de construção para o Nginx
COPY --from=react-build /app/build /usr/share/nginx/html

# Exponha a porta do container (geralmente 80 para aplicações servidas por nginx)
EXPOSE 80

# Comando para iniciar o servidor nginx
CMD ["nginx", "-g", "daemon off;"]
