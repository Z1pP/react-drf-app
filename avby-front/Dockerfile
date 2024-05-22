# Используем официальный образ Node.js
FROM node:20.11.1-alpine3.19

# Устанавливаем рабочую директорию
WORKDIR /avby-front

# Копируем только package.json и package-lock.json для кэширования зависимости
COPY package.json package-lock.json ./

# Устанавливаем зависимости
RUN npm install --silent

COPY . .

# Команда для запуска приложения
CMD ["npm", "run", "dev"]