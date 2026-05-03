const { Markup } = require("telegraf");
const { t } = require("./lang");

const btn = (label, data) => Markup.button.callback(label, data);
const kb = (...rows) => Markup.inlineKeyboard(rows);

const mainMenu = () =>
  kb(
    [btn(t("kb_sites"), "menu:sites"), btn(t("kb_status"), "menu:status")],
    [btn(t("kb_settings"), "menu:settings"), btn(t("kb_help"), "menu:help")],
  );

const sitesMenu = () =>
  kb(
    [btn(t("kb_sites_list"), "sites:list")],
    [btn(t("kb_add_site"), "sites:add")],
    [btn(t("kb_remove_site"), "sites:remove")],
    [btn(t("kb_check_now"), "sites:check")],
    [btn(t("kb_main_menu"), "menu:main")],
  );

const settingsMenu = (settings) =>
  kb(
    [btn(t("kb_interval", settings.check_interval), "settings:interval")],
    [btn(t("kb_timeout_btn", settings.timeout), "settings:timeout")],
    [
      btn(
        t("kb_threshold_btn", settings.alert_threshold),
        "settings:threshold",
      ),
    ],
    [btn(t("kb_language"), "settings:language")],
    [btn(t("kb_main_menu"), "menu:main")],
  );

const intervalMenu = () =>
  kb(
    [
      btn(t("int_1"), "settings:interval:1"),
      btn(t("int_5"), "settings:interval:5"),
      btn(t("int_10"), "settings:interval:10"),
    ],
    [
      btn(t("int_30"), "settings:interval:30"),
      btn(t("int_60"), "settings:interval:60"),
    ],
    [btn(t("kb_back"), "menu:settings")],
  );

const timeoutMenu = () =>
  kb(
    [
      btn(t("to_5"), "settings:timeout:5"),
      btn(t("to_10"), "settings:timeout:10"),
      btn(t("to_15"), "settings:timeout:15"),
    ],
    [
      btn(t("to_30"), "settings:timeout:30"),
      btn(t("to_60"), "settings:timeout:60"),
    ],
    [btn(t("kb_back"), "menu:settings")],
  );

const thresholdMenu = () =>
  kb(
    [
      btn(t("thr_1"), "settings:threshold:1"),
      btn(t("thr_2"), "settings:threshold:2"),
      btn(t("thr_3"), "settings:threshold:3"),
    ],
    [btn(t("thr_5"), "settings:threshold:5")],
    [btn(t("kb_back"), "menu:settings")],
  );

const removeSiteMenu = (sites) => {
  if (sites.length === 0) {
    return kb([btn(t("kb_back"), "menu:sites")]);
  }
  const statusIcon = (s) => ({ up: "✅", down: "🔴" })[s] ?? "⚪";
  const rows = sites.map((site) => [
    btn(`${statusIcon(site.status)} ${site.name}`, `sites:remove:${site.id}`),
  ]);
  rows.push([btn(t("kb_back"), "menu:sites")]);
  return Markup.inlineKeyboard(rows);
};

const confirmRemoveMenu = (siteId) =>
  kb([
    btn(t("kb_confirm_del"), `sites:remove:confirm:${siteId}`),
    btn(t("kb_cancel_del"), "menu:sites"),
  ]);

const cancelMenu = () => kb([btn(t("kb_cancel"), "wizard:cancel")]);
const backToSites = () => kb([btn(t("kb_back_to_sites"), "menu:sites")]);
const backToMain = () => kb([btn(t("kb_main_menu"), "menu:main")]);

module.exports = {
  mainMenu,
  sitesMenu,
  settingsMenu,
  intervalMenu,
  timeoutMenu,
  thresholdMenu,
  removeSiteMenu,
  confirmRemoveMenu,
  cancelMenu,
  backToSites,
  backToMain,
};
