const http = require('http');
const mineflayer = require('mineflayer');
const protocol = require('minecraft-protocol');

// 1. Веб-сервер для Render
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('AFK Bot is running!\n');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Веб-сервер запущен на порту ${PORT}`);
});

// Перехватываем создание клиента и подменяем версию на лету на уровне сокета
const originalCreateClient = protocol.createClient;
protocol.createClient = function(options) {
  options.version = '1.20.4';
  const client = originalCreateClient.call(this, options);
  
  // Убиваем слушатель проверки версии, если он создался
  client.removeAllListeners('version');
  return client;
};

// 2. Логика Minecraft-бота
function createBot() {
  console.log('Подключение бота к серверу...');

  const bot = mineflayer.createBot({
    host: 'Obshi_chat.aternos.me',
    port: 56364,
    username: 'AFK_Bot',
    version: '1.20.4',
    skipValidation: true,
    checkTimeoutInterval: 60 * 1000
  });

  bot.on('spawn', () => {
    console.log('>>> Бот успешно зашел на сервер! <<<');

    // Прыжки от кика каждые 4 секунды
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 4000);
  });

  bot.on('end', () => {
    console.log('Отключен от сервера. Попытка перезахода через 30 секунд...');
    setTimeout(createBot, 30000);
  });

  bot.on('error', (err) => {
    console.log('Ошибка бота:', err.message);
  });
}

createBot();
