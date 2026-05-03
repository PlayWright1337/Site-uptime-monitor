const { Markup } = require("telegraf");
const config = require("./config");
const db = require("./db");
const kb = require("./keyboards");
const msg = require("./messages");
const monitor = require("./monitor");
const { t } = require("./lang");

const HTML = { parse_mode: "HTML", disable_web_page_preview: true };

const isAdmin = (ctx) => config.ADMIN_IDS.includes(ctx.from?.id);
const adminOnly = async (ctx, next) => {
  if (isAdmin(ctx)) return next();
  await ctx
    .answerCbQuery("⛔ Access denied", { show_alert: true })
    .catch(() => {});
};

const safeEdit = async (ctx, text, extra = {}) => {
  try {
    await ctx.editMessageText(text, { ...HTML, ...extra });
  } catch {
    await ctx.reply(text, { ...HTML, ...extra });
  }
};

const registerHandlers = (bot) => {
  bot.start(async (ctx) => {
    if (!isAdmin(ctx)) return ctx.reply(t("no_access"), HTML);
    await ctx.reply(msg.welcome(ctx.from.first_name), {
      ...HTML,
      ...kb.mainMenu(),
    });
  });

  bot.action("menu:main", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    await safeEdit(ctx, msg.mainMenuText(), kb.mainMenu());
  });

  bot.action("menu:sites", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    await safeEdit(ctx, msg.sitesMenuText(), kb.sitesMenu());
  });

  bot.action("menu:status", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const sites = db.getAllSites();
    await safeEdit(
      ctx,
      msg.statusReport(sites),
      Markup.inlineKeyboard([
        [Markup.button.callback(t("kb_refresh"), "menu:status")],
        [Markup.button.callback(t("kb_main_menu"), "menu:main")],
      ]),
    );
  });

  bot.action("menu:settings", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const settings = db.getAllSettings();
    await safeEdit(ctx, msg.settingsText(settings), kb.settingsMenu(settings));
  });

  bot.action("menu:help", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    await safeEdit(ctx, msg.helpText(), kb.backToMain());
  });

  bot.action("sites:list", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const sites = db.getAllSites();
    await safeEdit(
      ctx,
      msg.sitesList(sites),
      Markup.inlineKeyboard([
        [Markup.button.callback(t("kb_refresh"), "sites:list")],
        [Markup.button.callback(t("kb_back"), "menu:sites")],
      ]),
    );
  });

  bot.action("sites:add", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.scene.enter("ADD_SITE");
  });

  bot.action("sites:remove", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const sites = db.getAllSites();
    if (sites.length === 0) {
      await safeEdit(ctx, t("remove_no_sites"), kb.backToSites());
      return;
    }
    await safeEdit(ctx, t("remove_pick"), kb.removeSiteMenu(sites));
  });

  bot.action(/^sites:remove:(\d+)$/, adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const siteId = parseInt(ctx.match[1], 10);
    const site = db.getSiteById(siteId);
    if (!site) {
      await safeEdit(ctx, t("site_not_found"), kb.backToSites());
      return;
    }

    const icon = { up: "✅", down: "🔴" }[site.status] ?? "⚪";
    await safeEdit(
      ctx,
      t("remove_confirm", icon, site.name, site.url),
      kb.confirmRemoveMenu(siteId),
    );
  });

  bot.action(/^sites:remove:confirm:(\d+)$/, adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const siteId = parseInt(ctx.match[1], 10);
    const site = db.getSiteById(siteId);
    if (!site) {
      await safeEdit(ctx, t("site_not_found"), kb.backToSites());
      return;
    }

    db.removeSite(siteId);
    await safeEdit(
      ctx,
      t("remove_done", site.name, site.url),
      kb.backToSites(),
    );
  });

  bot.action("sites:check", adminOnly, async (ctx) => {
    await ctx.answerCbQuery(t("kb_check_now"));
    const sites = db.getAllSites();
    if (sites.length === 0) {
      await safeEdit(ctx, t("no_sites_check"), kb.backToSites());
      return;
    }
    await safeEdit(ctx, t("checking", sites.length));
    await monitor.checkAllSites();
    const fresh = db.getAllSites();
    await safeEdit(
      ctx,
      msg.statusReport(fresh),
      Markup.inlineKeyboard([
        [Markup.button.callback(t("kb_check_again"), "sites:check")],
        [Markup.button.callback(t("kb_back_to_sites"), "menu:sites")],
      ]),
    );
  });

  bot.action("settings:interval", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const cur = db.getSetting("check_interval");
    await safeEdit(ctx, t("cur_interval", cur), kb.intervalMenu());
  });

  bot.action(/^settings:interval:(\d+)$/, adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const minutes = parseInt(ctx.match[1], 10);
    db.setSetting("check_interval", minutes);
    monitor.startMonitoring(minutes);
    const settings = db.getAllSettings();
    await safeEdit(
      ctx,
      t("ok_interval", minutes) + msg.settingsText(settings),
      kb.settingsMenu(settings),
    );
  });

  bot.action("settings:timeout", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const cur = db.getSetting("timeout");
    await safeEdit(ctx, t("cur_timeout", cur), kb.timeoutMenu());
  });

  bot.action(/^settings:timeout:(\d+)$/, adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const seconds = parseInt(ctx.match[1], 10);
    db.setSetting("timeout", seconds);
    const settings = db.getAllSettings();
    await safeEdit(
      ctx,
      t("ok_timeout", seconds) + msg.settingsText(settings),
      kb.settingsMenu(settings),
    );
  });

  bot.action("settings:threshold", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const cur = db.getSetting("alert_threshold");
    await safeEdit(ctx, t("cur_threshold", cur), kb.thresholdMenu());
  });

  bot.action(/^settings:threshold:(\d+)$/, adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const threshold = parseInt(ctx.match[1], 10);
    db.setSetting("alert_threshold", threshold);
    const settings = db.getAllSettings();
    await safeEdit(
      ctx,
      t("ok_threshold", threshold) + msg.settingsText(settings),
      kb.settingsMenu(settings),
    );
  });

  bot.action("settings:language", adminOnly, async (ctx) => {
    await ctx.answerCbQuery();
    const current = db.getSetting("language") || "ru";
    db.setSetting("language", current === "ru" ? "en" : "ru");
    const settings = db.getAllSettings();
    await safeEdit(
      ctx,
      t("ok_language") + msg.settingsText(settings),
      kb.settingsMenu(settings),
    );
  });

  bot.on("text", async (ctx) => {
    if (!isAdmin(ctx)) return;
    await ctx.reply(t("use_menu"), { ...HTML, ...kb.mainMenu() });
  });
};

module.exports = registerHandlers;
