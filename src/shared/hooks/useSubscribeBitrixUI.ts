type ButtonHandler = (button: HTMLButtonElement, event: MouseEvent) => void;


export function SubscribeBitrixUI(classNames: string[], handler: ButtonHandler):() => void {
  // Обработчик кликов
  const clickListener = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target) return;

    const button = target.closest('button');
    if (!button) return;

    // Проверяем, что кнопка содержит хотя бы один из указанных классов
    if (classNames.some(cls => button.classList.contains(cls))) {
      handler(button, event);
    }
  };

  // Вешаем глобальный клик
  document.addEventListener('click', clickListener);

  // Используем MutationObserver, чтобы ловить динамически добавленные кнопки
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach(node => {
        if (!(node instanceof HTMLElement)) return;

        const buttons = node.querySelectorAll('button');
        buttons.forEach(button => {
          if (classNames.some(cls => button.classList.contains(cls))) {
            // Можно здесь повесить обработчик на конкретную кнопку, если нужно
            // Но глобальный клик уже ловит все события
          }
        });
      });
    });
  });   

  observer.observe(document.body, { childList: true, subtree: true });

  // Возвращаем функцию отписки
  return () => {
    document.removeEventListener('click', clickListener);
    observer.disconnect();
  };
}

