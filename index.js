const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'Obshi_chat.aternos.me', // Только IP/адрес сервера без двоеточия и порта
    port: 56364,                  // Порт сервера
    username: 'AFK_Bot'           // Ник бота
    // Строку version удалили, теперь Mineflayer определит версию автоматически
  });

  bot.on('spawn', () => {
    console.log('Бот успешно зашел на сервер!');
    // Каждые 4 секунды бот прыгает, чтобы его не кикало за АФК
    setInterval(() => {
      bot.setControlState('jump', true);
      setTimeout(() => bot.setControlState('jump', false), 500);
    }, 4000);
  });

  // Автоматический перезаход при выключении/перезагрузке сервера
  bot.on('end', () => {
    console.log('Отключен от сервера. Попытка перезахода через 30 секунд...');
    setTimeout(createBot, 30000);
  });

  bot.on('error', (err) => console.log('Ошибка бота:', err));
}

createBot();
