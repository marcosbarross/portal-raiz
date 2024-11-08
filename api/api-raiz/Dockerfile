# Estágio de runtime com imagem do ASP.NET
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Copie o certificado SSL autoassinado para o container
COPY /etc/ssl/certs/selfsigned.crt /etc/ssl/certs/
COPY /etc/ssl/private/selfsigned.key /etc/ssl/private/

# Estágio de build com imagem do SDK do .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia o arquivo do projeto e restaura as dependências
COPY ["api-raiz.csproj", "."]
RUN dotnet restore "api-raiz.csproj"

# Copia todo o conteúdo do diretório atual
COPY . .
WORKDIR "/src/."

# Compila o projeto
RUN dotnet build "api-raiz.csproj" -c Release -o /app/build

# Estágio de publish
FROM build AS publish
RUN dotnet publish "api-raiz.csproj" -c Release -o /app/publish

# Estágio final - runtime apenas
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Configuração do ponto de entrada
ENTRYPOINT ["dotnet", "api-raiz.dll"]