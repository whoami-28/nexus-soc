const cowsay = require("cowsay");

// Переменные для формирования текста сообщений (Задание 7)
const appName = "NEXUS Mobile App";
const kernelVersion = "Kernel v4.19";
const nodeName = "Узел #882";
const syncStatus = "Низколатентная синхронизация векторов активна";

// 1. Первое сообщение — о запуске приложения с использованием cowsay.say(), глаз (e) и языка (T)
console.log(
  cowsay.say({
    text: `${appName} [${kernelVersion} | ${nodeName}] has started! ${syncStatus}`,
    e: "oO",
    T: "U "
  })
);

// Функция, которая принимает текст и выводит его с помощью cowsay (Задание 7)
function showMessage(text) {
  console.log(
    cowsay.say({
      text: text,
      e: "oo",
      T: "  "
    })
  );
}

// Вызов функции несколько раз с разными сообщениями
showMessage("Welcome!");
showMessage("Loading...");
showMessage("Goodbye!");

// 2. Второе сообщение — о завершении работы приложения с использованием cowsay.think()
const shutdownMessage = `${appName} (${nodeName}) завершил сеанс. Соединение с подпространством закрыто.`;
console.log(
  cowsay.think({
    text: shutdownMessage,
    e: "--",
    T: "  "
  })
);
