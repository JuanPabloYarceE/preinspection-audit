FROM node:20.11

WORKDIR /usr/src/app

# Copia los archivos de package.json y package-lock.json al directorio de trabajo en el contenedor
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Instala PM2 globalmente
RUN npm install pm2 -g

# Copia el resto del código de la aplicación al directorio de trabajo en el contenedor
COPY . .

# Define el comando para correr la aplicación con PM2
CMD ["pm2-runtime", "start", "ecosystem.config.json"]
