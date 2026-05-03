const { t } = require("./lang");

const DIV = "━━━━━━━━━━━━━━━━━━━━━━━━━";

const fmt = (ms) => (ms != null ? `${ms} ms` : "—");

const nowRU = () =>
  new Date().toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

const duration = (isoStr) => {
  if (!isoStr) return "?";
  const sec = Math.floor((Date.now() - new Date(isoStr).getTime()) / 1000);
  const m = Math.floor(sec / 60);
  const h = Math.floor(m / 60);
  const d = Math.floor(h / 24);
  if (d > 0) return `${d}d ${h % 24}h ${m % 60}m`;
  if (h > 0) return `${h}h ${m % 60}m ${sec % 60}s`;
  if (m > 0) return `${m}m ${sec % 60}s`;
  return `${sec}s`;
};

const welcome = (firstName) => t("welcome", firstName);
const mainMenuText = () => t("main_menu_text");
const sitesMenuText = () => t("sites_menu_text");

const sitesList = (sites) => {
  if (sites.length === 0) return t("sites_empty", DIV);

  const lines = sites.map((s) => {
    const icon = { up: "✅", down: "🔴" }[s.status] ?? "⚪";
    const rt = fmt(s.response_time);
    const when = s.last_check ?? t("not_checked");
    return (
      `${icon} <b>${s.name}</b>\n` +
      `   🔗 <code>${s.url}</code>\n` +
      `   ⚡ ${rt}  |  🕐 ${when}`
    );
  });

  return (
    t("sites_header", sites.length) +
    "\n\n" +
    DIV +
    "\n" +
    lines.join("\n" + DIV + "\n") +
    "\n" +
    DIV
  );
};

const statusReport = (sites) => {
  const up = sites.filter((s) => s.status === "up").length;
  const down = sites.filter((s) => s.status === "down").length;
  const unknown = sites.filter((s) => s.status === "unknown").length;

  let header =
    t("status_title") +
    "\n\n" +
    t("total", sites.length) +
    "\n" +
    t("working", up) +
    "\n";
  if (down > 0) header += t("unavailable", down) + "\n";
  if (unknown > 0) header += t("unchecked", unknown) + "\n";
  header += "\n" + DIV + "\n";

  if (sites.length === 0) return header + t("no_sites");

  const lines = sites.map((s) => {
    if (s.status === "up") return t("site_up", s.name, fmt(s.response_time));
    if (s.status === "down") return t("site_down", s.name);
    return t("site_unk", s.name);
  });

  return (
    header + lines.join("\n") + "\n" + DIV + "\n\n" + t("updated_at", nowRU())
  );
};

const settingsText = (settings) =>
  t("settings_title") +
  "\n\n" +
  DIV +
  "\n" +
  t("s_interval", settings.check_interval) +
  "\n" +
  t("s_timeout", settings.timeout) +
  "\n" +
  t("s_threshold", settings.alert_threshold) +
  "\n" +
  t("s_language") +
  "\n" +
  DIV +
  "\n\n" +
  t("s_edit_hint");

const helpText = () => t("help_text", DIV);

const alertDown = (site, error) =>
  t("alert_down", site.name, site.url, error || t("no_response"), nowRU(), DIV);

const alertUp = (site, downtimeStart) =>
  t(
    "alert_up",
    site.name,
    site.url,
    fmt(site.response_time),
    duration(downtimeStart),
    nowRU(),
    DIV,
  );

module.exports = {
  DIV,
  welcome,
  mainMenuText,
  sitesMenuText,
  sitesList,
  statusReport,
  settingsText,
  helpText,
  alertDown,
  alertUp,
};
