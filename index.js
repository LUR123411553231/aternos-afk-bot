const mineflayer = require('mineflayer');

function createBot() {
  const bot = mineflayer.createBot({
    host: 'Obshi_chat.aternos.me:56364', // Замените на ваш IP с Aternos
    port: 56364,                         // Ваш порт (если стандартный - 25565)
    username: 'AFK_Bot',                 // Ник бота
    version: 26.2                        // Авто-определение версии
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
