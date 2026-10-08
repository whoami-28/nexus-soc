// script.js — Клиентская логика мобильного приложения NEXUS

document.addEventListener("DOMContentLoaded", () => {
  const phoneFrame = document.getElementById("phoneFrame");
  const btnAdaptive = document.getElementById("btnAdaptiveMode");
  const btnPhoneLock = document.getElementById("btnPhoneMode");
  const navButtons = document.querySelectorAll(".nav-link");
  const voteButtons = document.querySelectorAll(".vote-btn.up");
  const bookmarkButtons = document.querySelectorAll(".bookmark-toggle");
  const syncButton = document.getElementById("syncNodeBtn");
  const syncStatusBox = document.getElementById("syncStatusOutput");
  const fabAddBtn = document.getElementById("fabAddBtn");

  // 1. Переключение между Адаптивным режимом (1200px -> 768px -> 375px) и узкой рамкой смартфона
  if (btnAdaptive && btnPhoneLock && phoneFrame) {
    btnAdaptive.addEventListener("click", () => {
      phoneFrame.classList.remove("phone-locked");
      btnAdaptive.classList.add("active");
      btnPhoneLock.classList.remove("active");
    });

    btnPhoneLock.addEventListener("click", () => {
      phoneFrame.classList.add("phone-locked");
      btnPhoneLock.classList.add("active");
      btnAdaptive.classList.remove("active");
    });
  }

  // 2. Переключение активного пункта навигационного меню
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      navButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // 3. Интерактивные лайки (голоса) в карточках
  voteButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("active");
      const countSpan = btn.querySelector(".vote-count");
      if (!countSpan) return;

      const baseValue = countSpan.getAttribute("data-base") || countSpan.textContent;
      if (!countSpan.getAttribute("data-base")) {
        countSpan.setAttribute("data-base", baseValue);
      }

      if (btn.classList.contains("active")) {
        countSpan.textContent = baseValue === "+1.8k" ? "+1.9k" : baseValue;
      } else {
        countSpan.textContent = baseValue === "+2.4k" ? "+2.3k" : baseValue;
      }
    });
  });

  // 4. Переключение закладок на карточках
  bookmarkButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.classList.toggle("saved");
    });
  });

  // 5. Основная кнопка действия: синхронизация узла и вывод телеметрии
  const syncMessages = [
    "NEXUS Mobile App [Kernel v4.19 | Узел #882] has started! Синхронизация векторов завершена за 0.0028ns.",
    "Welcome! Все 3 нейро-узла подключены. Потери пакетов: 0.00%.",
    "Loading... Квантовый буфер телеметрии обновлен (120 FPS, режим SOTA -42%)."
  ];
  let msgIndex = 0;

  if (syncButton && syncStatusBox) {
    syncButton.addEventListener("click", () => {
      const currentText = syncMessages[msgIndex % syncMessages.length];
      msgIndex++;

      syncStatusBox.innerHTML = `<span class="term-prompt">&gt; cowsay.say:</span> ${currentText}`;
      syncStatusBox.classList.add("visible");
    });
  }

  if (fabAddBtn && syncButton) {
    fabAddBtn.addEventListener("click", () => {
      syncButton.click();
      syncButton.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }
});
