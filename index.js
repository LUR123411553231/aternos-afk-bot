const http = require('http');
const mineflayer = require('mineflayer');
const mc = require('minecraft-protocol');

// 1. Веб-сервер для Render
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('AFK Bot is running!\n');
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log(`Веб-сервер запущен на порту ${PORT}`);
});

// Отключаем строгую проверку версии в самом клиенте протокола
const originalCreateClient = mc.createClient;
mc.createClient = function(options) {
  options.version = '1.20.4'; // Подменяем версию для сокета
  return originalCreateClient.call(this, options);
};

// 2. Логика Minecraft-бота
function createBot() {
  console.log('Подключение бота к серверу...');
  
  const bot = mineflayer.createBot({
    host: 'Obshi_chat.aternos.me',
    port: 56364,
    username: 'AFK_Bot',
    version: '1.20.4',
    checkTimeoutInterval: 60 * 1000
  });

  bot.on('spawn', () => {
    console.log('>>> Бот успешно зашел на сервер! <<<');
    
    // Прыжки от кика за АФК каждые 4 секунды
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
