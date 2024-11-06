# Estágio de runtime com imagem do ASP.NET
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
EXPOSE 8080
EXPOSE 8081

# Estágio de build com imagem do SDK do .NET
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src

# Copia o arquivo do projeto e restaura as dependências
COPY ["api-raiz.csproj", "."]
RUN dotnet restore "api-raiz.csproj"

# Copia todo o conteúdo do diretório atual
COPY . .
WORKDIR "/src/."

# Compila o projeto
RUN dotnet build "api-raiz.csproj" -c $BUILD_CONFIGURATION -o /app/build

# Estágio de publish
FROM build AS publish
ARG BUILD_CONFIGURATION=Release

# Publica o projeto
RUN dotnet publish "api-raiz.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Estágio final - runtime apenas
FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Inicia a aplicação
ENTRYPOINT ["dotnet", "api-raiz.dll"]
