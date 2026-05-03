const config = require("./config");

let _bot = null;

const setBot = (bot) => {
  _bot = bot;
};

const broadcast = async (text, extra = {}) => {
  if (!_bot) return;

  const seen = new Set();
  const targets = [
    ...config.ADMIN_IDS,
    ...config.USER_IDS,
    ...config.GROUP_IDS,
  ].filter((id) => {
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });

  if (targets.length === 0) return;

  const results = await Promise.allSettled(
    targets.map((id) =>
      _bot.telegram.sendMessage(id, text, {
        parse_mode: "HTML",
        disable_web_page_preview: true,
        ...extra,
      }),
    ),
  );

  results.forEach((r, i) => {
    if (r.status === "rejected") {
      console.warn(
        `[Notify] Не удалось отправить сообщение в чат ${targets[i]}:`,
        r.reason?.description || r.reason?.message || r.reason,
      );
    }
  });
};

module.exports = { setBot, broadcast };
