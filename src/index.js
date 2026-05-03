const { Telegraf, session } = require("telegraf");

const config = require("./config");
const db = require("./db");
const stage = require("./scenes");
const registerHandlers = require("./handlers");
const monitor = require("./monitor");
const notify = require("./notify");

try {
  config.validate();
} catch (err) {
  console.error(err.message);
  process.exit(1);
}

const bot = new Telegraf(config.BOT_TOKEN);

notify.setBot(bot);
bot.use(session());
bot.use(stage.middleware());
registerHandlers(bot);

bot.catch((err, ctx) => {
  console.error(`[Bot] Необработанная ошибка для ${ctx.updateType}:`, err);
  if (ctx.callbackQuery) {
    ctx
      .answerCbQuery("⚠️ Произошла ошибка. Попробуйте ещё раз.", {
        show_alert: true,
      })
      .catch(() => {});
  }
});

bot
  .launch()
  .then(() => {
    console.log("");
    console.log("╔══════════════════════════════════════╗");
    console.log("║   🤖  Site Uptime Monitor  запущен   ║");
    console.log("╚══════════════════════════════════════╝");
    console.log("");
    console.log(`👑 Администраторы: ${config.ADMIN_IDS.join(", ")}`);
    console.log(
      `👥 Пользователи:   ${config.USER_IDS.length ? config.USER_IDS.join(", ") : "—"}`,
    );
    console.log(
      `💬 Группы:         ${config.GROUP_IDS.length ? config.GROUP_IDS.join(", ") : "—"}`,
    );
    console.log("");

    const interval = parseInt(db.getSetting("check_interval") || "5", 10);
    monitor.startMonitoring(interval);

    setTimeout(() => {
      console.log("[Monitor] 🚀 Начальная проверка сайтов…");
      monitor.checkAllSites();
    }, 10_000);
  })
  .catch((err) => {
    console.error("❌ Не удалось запустить бота:", err.message);
    process.exit(1);
  });

const shutdown = (signal) => {
  console.log(`\n[Bot] Получен сигнал ${signal}, завершение работы…`);
  monitor.stopMonitoring();
  bot.stop(signal);
  process.exit(0);
};

process.once("SIGINT", () => shutdown("SIGINT"));
process.once("SIGTERM", () => shutdown("SIGTERM"));
