const db = require('./db');

const T = {
  ru: {
    kb_sites:         '🌐 Сайты',
    kb_status:        '📊 Статус',
    kb_settings:      '⚙️ Настройки',
    kb_help:          'ℹ️ Помощь',
    kb_main_menu:     '◀️ Главное меню',
    kb_back:          '◀️ Назад',
    kb_back_to_sites: '◀️ К сайтам',
    kb_sites_list:    '📋 Список сайтов',
    kb_add_site:      '➕ Добавить сайт',
    kb_remove_site:   '🗑 Удалить сайт',
    kb_check_now:     '🔄 Проверить сейчас',
    kb_refresh:       '🔄 Обновить',
    kb_check_again:   '🔄 Проверить снова',
    kb_cancel:        '❌ Отмена',
    kb_confirm_del:   '✅ Да, удалить',
    kb_cancel_del:    '❌ Отмена',
    kb_language:      '🌍 Язык: RU',
    kb_interval:      (v) => `⏱ Интервал: ${v} мин`,
    kb_timeout_btn:   (v) => `⌛ Таймаут: ${v} сек`,
    kb_threshold_btn: (v) => `🔔 Порог: ${v}`,

    int_1: '1 мин',   int_5: '5 мин',   int_10: '10 мин',
    int_30: '30 мин', int_60: '60 мин',
    to_5: '5 сек',    to_10: '10 сек',  to_15: '15 сек',
    to_30: '30 сек',  to_60: '60 сек',
    thr_1: '1 провал', thr_2: '2 провала', thr_3: '3 провала', thr_5: '5 провалов',

    no_access: '⛔ У вас нет доступа к этому боту.',
    use_menu:  '🏠 Используйте кнопки меню для управления ботом.\n\nЕсли меню исчезло — нажмите /start',

    welcome: (name) =>
      `👋 Привет, <b>${name}</b>!\n\n` +
      `🤖 Я <b>Site Uptime Monitor</b> — ваш персональный бот для мониторинга сайтов.\n\n` +
      `<b>Что я умею:</b>\n` +
      `• 🔍 Периодически проверяю доступность сайтов\n` +
      `• 🚨 Мгновенно оповещаю при падении сайта\n` +
      `• ✅ Сообщаю когда сайт восстановился\n` +
      `• 📊 Показываю статус и время отклика\n\n` +
      `Выберите раздел ниже 👇`,

    main_menu_text:  '🏠 <b>Главное меню</b>\n\nВыберите раздел:',
    sites_menu_text: '🌐 <b>Управление сайтами</b>\n\nЗдесь можно добавлять и удалять сайты, а также запустить проверку вручную.',
    not_checked:     'ещё не проверялся',

    sites_empty: (D) =>
      `📋 <b>Список сайтов</b>\n\n${D}\n` +
      `😕 Пока нет ни одного сайта.\n\n` +
      `Нажмите <b>➕ Добавить сайт</b>, чтобы начать мониторинг.`,
    sites_header: (n) => `📋 <b>Список сайтов</b>  (${n})`,

    status_title:    '📊 <b>СТАТУС МОНИТОРИНГА</b>',
    total:       (n) => `Всего сайтов: <b>${n}</b>`,
    working:     (n) => `✅ Работают:  <b>${n}</b>`,
    unavailable: (n) => `🔴 Недоступны: <b>${n}</b>`,
    unchecked:   (n) => `⚪ Не проверены: <b>${n}</b>`,
    no_sites:        '😕 Нет добавленных сайтов.',
    site_up:     (name, rt)  => `✅ <b>${name}</b> — ${rt}`,
    site_down:   (name)      => `🔴 <b>${name}</b> — Недоступен`,
    site_unk:    (name)      => `⚪ <b>${name}</b> — Ожидание проверки`,
    updated_at:  (time)      => `📅 Обновлено: ${time}`,

    settings_title: '⚙️ <b>Настройки мониторинга</b>',
    s_interval:  (v) => `⏱ <b>Интервал проверки:</b>  ${v} мин`,
    s_timeout:   (v) => `⌛ <b>Таймаут запроса:</b>    ${v} сек`,
    s_threshold: (v) => `🔔 <b>Порог оповещений:</b>  ${v} провал(а) подряд`,
    s_language:       '🌍 <b>Язык интерфейса:</b>     RU 🇷🇺',
    s_edit_hint:      'Нажмите на параметр, чтобы изменить его:',

    cur_interval:  (v) => `⏱ <b>Интервал проверки</b>\n\nТекущий: <b>${v} мин</b>\n\nВыберите новый интервал:`,
    cur_timeout:   (v) => `⌛ <b>Таймаут соединения</b>\n\nТекущий: <b>${v} сек</b>\n\nВыберите новый таймаут:`,
    cur_threshold: (v) =>
      `🔔 <b>Порог оповещений</b>\n\nТекущий: <b>${v} провал(а)</b>\n\n` +
      `Бот отправит оповещение только после N последовательных провалов подряд.\n\n` +
      `Выберите порог:`,

    ok_interval:  (v) => `✅ Интервал обновлён: <b>${v} мин</b>\n\n`,
    ok_timeout:   (v) => `✅ Таймаут обновлён: <b>${v} сек</b>\n\n`,
    ok_threshold: (v) => `✅ Порог оповещений: <b>${v} провал(а)</b>\n\n`,
    ok_language:       '✅ Язык установлен: <b>Русский 🇷🇺</b>\n\n',

    help_text: (D) =>
      `ℹ️ <b>Справка</b>\n\n${D}\n` +
      `<b>🌐 Управление сайтами</b>\n` +
      `• Добавляйте URL для мониторинга\n` +
      `• Удаляйте ненужные сайты\n` +
      `• Запускайте ручную проверку\n\n` +
      `<b>📊 Мониторинг</b>\n` +
      `• Автоматическая проверка по расписанию\n` +
      `• Уведомление при падении\n` +
      `• Уведомление при восстановлении\n\n` +
      `<b>⚙️ Параметры</b>\n` +
      `• <b>Интервал</b> — как часто проверять (1–60 мин)\n` +
      `• <b>Таймаут</b> — время ожидания ответа (5–60 сек)\n` +
      `• <b>Порог</b> — сколько провалов подряд до оповещения\n\n` +
      `<b>👥 Получатели уведомлений</b>\n` +
      `• Администраторы (ADMIN_IDS)\n` +
      `• Пользователи (USER_IDS)\n` +
      `• Группы/каналы (GROUP_IDS)\n${D}`,

    remove_no_sites: '🗑 <b>Удаление сайта</b>\n\n😕 Нет добавленных сайтов.',
    remove_pick:     '🗑 <b>Удаление сайта</b>\n\nВыберите сайт из списка:',
    remove_confirm:  (icon, name, url) =>
      `🗑 <b>Удаление сайта</b>\n\n${icon} <b>${name}</b>\n🔗 <code>${url}</code>\n\n` +
      `Вы уверены, что хотите удалить этот сайт из мониторинга?`,
    remove_done:     (name, url) => `✅ <b>Сайт удалён!</b>\n\n🌐 ${name}\n🔗 <code>${url}</code>`,
    site_not_found:  '❌ Сайт не найден.',
    checking:        (n) => `🔄 <b>Проверяю ${n} сайт(ов)…</b>\n\nПожалуйста, подождите.`,
    no_sites_check:  '😕 Нет добавленных сайтов для проверки.',

    wiz_cancel:    '❌ <b>Добавление отменено.</b>',
    wiz_step1:     `➕ <b>Добавление сайта</b>\n\n<b>Шаг 1 из 2</b> — Введите <u>название</u> сайта:\n<i>Например: Google, Мой блог, API-сервер</i>`,
    wiz_step2:     (name) => `➕ <b>Добавление сайта</b>\n\n🌐 Название: <b>${name}</b>\n\n<b>Шаг 2 из 2</b> — Введите <u>URL</u> сайта:\n<i>Например: https://example.com</i>`,
    wiz_done:      (name, url) =>
      `✅ <b>Сайт добавлен!</b>\n\n🌐 <b>Название:</b> ${name}\n🔗 <b>URL:</b> <code>${url}</code>\n\n` +
      `Бот начнёт мониторить его при следующей проверке.`,
    wiz_bad_name:  '⚠️ Введите текстовое название.',
    wiz_name_long: '⚠️ Название слишком длинное (максимум 64 символа).',
    wiz_bad_url:   (url) => `⚠️ Некорректный URL: <code>${url}</code>\n\nПопробуйте ещё раз. Пример: <code>https://example.com</code>`,
    wiz_dup_url:   (url) => `⚠️ <b>URL уже добавлен!</b>\n\n<code>${url}</code>`,
    wiz_error:     '❌ Ошибка при сохранении. Попробуйте позже.',
    wiz_no_url:    '⚠️ Введите URL.',

    alert_down: (name, url, error, time, D) =>
      `🚨 <b>САЙТ НЕДОСТУПЕН!</b>\n\n${D}\n` +
      `🌐 <b>Сайт:</b>    ${name}\n` +
      `🔗 <b>URL:</b>     <code>${url}</code>\n` +
      `❌ <b>Статус:</b>  Недоступен\n` +
      `📡 <b>Причина:</b> ${error}\n` +
      `⏰ <b>Время:</b>   ${time}\n${D}`,
    alert_up: (name, url, rt, down, time, D) =>
      `✅ <b>САЙТ ВОССТАНОВЛЕН!</b>\n\n${D}\n` +
      `🌐 <b>Сайт:</b>         ${name}\n` +
      `🔗 <b>URL:</b>          <code>${url}</code>\n` +
      `⚡ <b>Время отклика:</b> ${rt}\n` +
      `⏱ <b>Простой:</b>       ${down}\n` +
      `⏰ <b>Время:</b>         ${time}\n${D}`,
    no_response: 'Нет ответа',
  },

  en: {
    kb_sites:         '🌐 Sites',
    kb_status:        '📊 Status',
    kb_settings:      '⚙️ Settings',
    kb_help:          'ℹ️ Help',
    kb_main_menu:     '◀️ Main Menu',
    kb_back:          '◀️ Back',
    kb_back_to_sites: '◀️ To Sites',
    kb_sites_list:    '📋 Sites List',
    kb_add_site:      '➕ Add Site',
    kb_remove_site:   '🗑 Remove Site',
    kb_check_now:     '🔄 Check Now',
    kb_refresh:       '🔄 Refresh',
    kb_check_again:   '🔄 Check Again',
    kb_cancel:        '❌ Cancel',
    kb_confirm_del:   '✅ Yes, delete',
    kb_cancel_del:    '❌ Cancel',
    kb_language:      '🌍 Language: EN',
    kb_interval:      (v) => `⏱ Interval: ${v} min`,
    kb_timeout_btn:   (v) => `⌛ Timeout: ${v} sec`,
    kb_threshold_btn: (v) => `🔔 Threshold: ${v}`,

    int_1: '1 min',   int_5: '5 min',   int_10: '10 min',
    int_30: '30 min', int_60: '60 min',
    to_5: '5 sec',    to_10: '10 sec',  to_15: '15 sec',
    to_30: '30 sec',  to_60: '60 sec',
    thr_1: '1 fail',  thr_2: '2 fails', thr_3: '3 fails', thr_5: '5 fails',

    no_access: '⛔ You do not have access to this bot.',
    use_menu:  '🏠 Use the menu buttons to manage the bot.\n\nIf the menu disappeared — press /start',

    welcome: (name) =>
      `👋 Hello, <b>${name}</b>!\n\n` +
      `🤖 I am <b>Site Uptime Monitor</b> — your personal website monitoring bot.\n\n` +
      `<b>What I can do:</b>\n` +
      `• 🔍 Periodically check website availability\n` +
      `• 🚨 Instantly alert when a site goes down\n` +
      `• ✅ Notify when a site comes back online\n` +
      `• 📊 Show status and response time\n\n` +
      `Choose a section below 👇`,

    main_menu_text:  '🏠 <b>Main Menu</b>\n\nChoose a section:',
    sites_menu_text: '🌐 <b>Site Management</b>\n\nHere you can add and remove sites, and run a manual check.',
    not_checked:     'not checked yet',

    sites_empty: (D) =>
      `📋 <b>Sites List</b>\n\n${D}\n` +
      `😕 No sites added yet.\n\n` +
      `Press <b>➕ Add Site</b> to start monitoring.`,
    sites_header: (n) => `📋 <b>Sites List</b>  (${n})`,

    status_title:    '📊 <b>MONITORING STATUS</b>',
    total:       (n) => `Total sites: <b>${n}</b>`,
    working:     (n) => `✅ Online:    <b>${n}</b>`,
    unavailable: (n) => `🔴 Offline:   <b>${n}</b>`,
    unchecked:   (n) => `⚪ Unchecked: <b>${n}</b>`,
    no_sites:        '😕 No sites added.',
    site_up:     (name, rt)  => `✅ <b>${name}</b> — ${rt}`,
    site_down:   (name)      => `🔴 <b>${name}</b> — Offline`,
    site_unk:    (name)      => `⚪ <b>${name}</b> — Awaiting check`,
    updated_at:  (time)      => `📅 Updated: ${time}`,

    settings_title: '⚙️ <b>Monitoring Settings</b>',
    s_interval:  (v) => `⏱ <b>Check Interval:</b>   ${v} min`,
    s_timeout:   (v) => `⌛ <b>Request Timeout:</b>  ${v} sec`,
    s_threshold: (v) => `🔔 <b>Alert Threshold:</b>  ${v} failure(s) in a row`,
    s_language:       '🌍 <b>Interface Language:</b> EN 🇬🇧',
    s_edit_hint:      'Click a parameter to change it:',

    cur_interval:  (v) => `⏱ <b>Check Interval</b>\n\nCurrent: <b>${v} min</b>\n\nSelect new interval:`,
    cur_timeout:   (v) => `⌛ <b>Connection Timeout</b>\n\nCurrent: <b>${v} sec</b>\n\nSelect new timeout:`,
    cur_threshold: (v) =>
      `🔔 <b>Alert Threshold</b>\n\nCurrent: <b>${v} failure(s)</b>\n\n` +
      `The bot sends an alert only after N consecutive check failures.\n\n` +
      `Select threshold:`,

    ok_interval:  (v) => `✅ Interval updated: <b>${v} min</b>\n\n`,
    ok_timeout:   (v) => `✅ Timeout updated: <b>${v} sec</b>\n\n`,
    ok_threshold: (v) => `✅ Alert threshold: <b>${v} failure(s)</b>\n\n`,
    ok_language:       '✅ Language set to: <b>English 🇬🇧</b>\n\n',

    help_text: (D) =>
      `ℹ️ <b>Help</b>\n\n${D}\n` +
      `<b>🌐 Site Management</b>\n` +
      `• Add URLs to monitor\n` +
      `• Remove unwanted sites\n` +
      `• Run manual checks\n\n` +
      `<b>📊 Monitoring</b>\n` +
      `• Automatic scheduled checks\n` +
      `• Alert on downtime\n` +
      `• Alert on recovery\n\n` +
      `<b>⚙️ Parameters</b>\n` +
      `• <b>Interval</b> — how often to check (1–60 min)\n` +
      `• <b>Timeout</b> — max wait time for response (5–60 sec)\n` +
      `• <b>Threshold</b> — consecutive failures before alert\n\n` +
      `<b>👥 Notification recipients</b>\n` +
      `• Admins (ADMIN_IDS)\n` +
      `• Users (USER_IDS)\n` +
      `• Groups / channels (GROUP_IDS)\n${D}`,

    remove_no_sites: '🗑 <b>Remove Site</b>\n\n😕 No sites added.',
    remove_pick:     '🗑 <b>Remove Site</b>\n\nSelect a site from the list:',
    remove_confirm:  (icon, name, url) =>
      `🗑 <b>Remove Site</b>\n\n${icon} <b>${name}</b>\n🔗 <code>${url}</code>\n\n` +
      `Are you sure you want to remove this site from monitoring?`,
    remove_done:     (name, url) => `✅ <b>Site removed!</b>\n\n🌐 ${name}\n🔗 <code>${url}</code>`,
    site_not_found:  '❌ Site not found.',
    checking:        (n) => `🔄 <b>Checking ${n} site(s)…</b>\n\nPlease wait.`,
    no_sites_check:  '😕 No sites to check.',

    wiz_cancel:    '❌ <b>Adding cancelled.</b>',
    wiz_step1:     `➕ <b>Add Site</b>\n\n<b>Step 1 of 2</b> — Enter the site <u>name</u>:\n<i>E.g.: Google, My Blog, API Server</i>`,
    wiz_step2:     (name) => `➕ <b>Add Site</b>\n\n🌐 Name: <b>${name}</b>\n\n<b>Step 2 of 2</b> — Enter the site <u>URL</u>:\n<i>E.g.: https://example.com</i>`,
    wiz_done:      (name, url) =>
      `✅ <b>Site added!</b>\n\n🌐 <b>Name:</b> ${name}\n🔗 <b>URL:</b> <code>${url}</code>\n\n` +
      `The bot will start monitoring it at the next check.`,
    wiz_bad_name:  '⚠️ Please enter a text name.',
    wiz_name_long: '⚠️ Name is too long (maximum 64 characters).',
    wiz_bad_url:   (url) => `⚠️ Invalid URL: <code>${url}</code>\n\nTry again. Example: <code>https://example.com</code>`,
    wiz_dup_url:   (url) => `⚠️ <b>URL already added!</b>\n\n<code>${url}</code>`,
    wiz_error:     '❌ Error saving. Please try later.',
    wiz_no_url:    '⚠️ Please enter a URL.',

    alert_down: (name, url, error, time, D) =>
      `🚨 <b>SITE IS DOWN!</b>\n\n${D}\n` +
      `🌐 <b>Site:</b>   ${name}\n` +
      `🔗 <b>URL:</b>    <code>${url}</code>\n` +
      `❌ <b>Status:</b> Offline\n` +
      `📡 <b>Reason:</b> ${error}\n` +
      `⏰ <b>Time:</b>   ${time}\n${D}`,
    alert_up: (name, url, rt, down, time, D) =>
      `✅ <b>SITE IS BACK ONLINE!</b>\n\n${D}\n` +
      `🌐 <b>Site:</b>          ${name}\n` +
      `🔗 <b>URL:</b>           <code>${url}</code>\n` +
      `⚡ <b>Response time:</b>  ${rt}\n` +
      `⏱ <b>Downtime:</b>       ${down}\n` +
      `⏰ <b>Time:</b>           ${time}\n${D}`,
    no_response: 'No response',
  },
};

const getLang = () => {
  try {
    return db.getSetting('language') || 'ru';
  } catch {
    return 'ru';
  }
};

const t = (key, ...args) => {
  const lang = getLang();
  const val = T[lang]?.[key] ?? T.ru[key] ?? key;
  return typeof val === 'function' ? val(...args) : val;
};

module.exports = { t, getLang };
