const cron = require("node-cron");
const db = require("./db");
const ping = require("./ping");
const notify = require("./notify");
const msg = require("./messages");

let _currentTask = null;

const checkSite = async (site) => {
  const timeoutSec = parseInt(db.getSetting("timeout") || "10", 10);
  const threshold = parseInt(db.getSetting("alert_threshold") || "1", 10);

  const result = await ping(site.url, timeoutSec * 1000);

  const updated = db.updateSiteStatus(
    site.id,
    result.status,
    result.responseTime,
  );
  if (!updated) return;

  const { previousStatus, oldDowntimeStart, consecutiveFailures } = updated;

  if (result.status === "down" && consecutiveFailures === threshold) {
    console.log(`[Monitor] 🔴 ${site.name} — DOWN (${result.error})`);
    await notify.broadcast(msg.alertDown(site, result.error));
  }

  if (result.status === "up" && previousStatus === "down") {
    const fresh = db.getSiteById(site.id);
    console.log(`[Monitor] ✅ ${site.name} — UP (${result.responseTime} ms)`);
    await notify.broadcast(msg.alertUp(fresh, oldDowntimeStart));
  }
};

const checkAllSites = async () => {
  const sites = db.getAllSites();
  if (sites.length === 0) return;

  console.log(`[Monitor] 🔄 Проверяю ${sites.length} сайт(ов)…`);
  const t0 = Date.now();

  await Promise.allSettled(sites.map(checkSite));

  console.log(`[Monitor] ✔  Проверка завершена за ${Date.now() - t0} мс`);
};

const cronExpression = (minutes) => {
  if (minutes === 1) return "* * * * *";
  if (minutes === 60) return "0 * * * *";
  return `*/${minutes} * * * *`;
};

const startMonitoring = (intervalMinutes) => {
  if (_currentTask) {
    _currentTask.stop();
    _currentTask = null;
  }

  const minutes =
    intervalMinutes ?? parseInt(db.getSetting("check_interval") || "5", 10);
  const expr = cronExpression(minutes);

  console.log(
    `[Monitor] 🟢 Запуск мониторинга — интервал: ${minutes} мин  (cron: "${expr}")`,
  );

  _currentTask = cron.schedule(expr, checkAllSites, {
    scheduled: true,
    timezone: "Europe/Moscow",
  });

  return minutes;
};

const stopMonitoring = () => {
  if (_currentTask) {
    _currentTask.stop();
    _currentTask = null;
    console.log("[Monitor] 🛑 Мониторинг остановлен");
  }
};

module.exports = { startMonitoring, stopMonitoring, checkAllSites };
