#!/bin/bash

CONTAINER_NAME="portal-raiz-db-1" 
DB_NAME="portalraizdb_358k"          
DB_USER="raiz"                       
BACKUP_PATH="/backup/backup_$(date +%Y%m%d).dump"
HOST_BACKUP_PATH="/home/ubuntu/backups/backup_$(date +%Y%m%d).dump" 
S3_BUCKET=

docker exec $CONTAINER_NAME mkdir -p /backup

echo "Criando backup do banco de dados..."
docker exec $CONTAINER_NAME pg_dump -U $DB_USER -d $DB_NAME -F c -b -v -f $BACKUP_PATH

if [ $? -eq 0 ]; then
    echo "Backup criado com sucesso: $BACKUP_PATH"
else
    echo "Erro ao criar o backup!"
    exit 1
fi

echo "Copiando backup para o host..."
docker cp $CONTAINER_NAME:$BACKUP_PATH $HOST_BACKUP_PATH

echo "Enviando backup para o S3..."
aws s3 cp $HOST_BACKUP_PATH $S3_BUCKET/

if [ $? -eq 0 ]; then
    echo "Backup enviado com sucesso para o S3: $S3_BUCKET"
else
    echo "Erro ao enviar o backup para o S3!"
    exit 1
fi

echo "Removendo backup antigo do container..."
docker exec $CONTAINER_NAME rm $BACKUP_PATH

echo "Removendo backup antigo do host..."
rm $HOST_BACKUP_PATH

echo "Backup concluído e enviado para o S3 com sucesso!"