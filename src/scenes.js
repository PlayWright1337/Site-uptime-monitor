const { Scenes } = require("telegraf");
const db = require("./db");
const kb = require("./keyboards");
const { t } = require("./lang");

const HTML = { parse_mode: "HTML" };

const leaveWithCancel = async (ctx) => {
  await ctx.answerCbQuery().catch(() => {});
  await ctx.reply(t("wiz_cancel"), { ...HTML, ...kb.sitesMenu() });
  return ctx.scene.leave();
};

const addSiteScene = new Scenes.WizardScene(
  "ADD_SITE",

  async (ctx) => {
    await ctx.reply(t("wiz_step1"), { ...HTML, ...kb.cancelMenu() });
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (ctx.callbackQuery) return leaveWithCancel(ctx);
    if (!ctx.message?.text) return ctx.reply(t("wiz_bad_name"), HTML);

    const name = ctx.message.text.trim();
    if (name.length > 64) return ctx.reply(t("wiz_name_long"), HTML);

    ctx.wizard.state.name = name;
    await ctx.reply(t("wiz_step2", name), { ...HTML, ...kb.cancelMenu() });
    return ctx.wizard.next();
  },

  async (ctx) => {
    if (ctx.callbackQuery) return leaveWithCancel(ctx);
    if (!ctx.message?.text) return ctx.reply(t("wiz_no_url"), HTML);

    let url = ctx.message.text.trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;

    try {
      new URL(url);
    } catch {
      return ctx.reply(t("wiz_bad_url", url), HTML);
    }

    const name = ctx.wizard.state.name;

    try {
      db.addSite(name, url);
      await ctx.reply(t("wiz_done", name, url), { ...HTML, ...kb.sitesMenu() });
    } catch (err) {
      if (err.message?.includes("UNIQUE")) {
        await ctx.reply(t("wiz_dup_url", url), { ...HTML, ...kb.sitesMenu() });
      } else {
        console.error("[AddSite] DB error:", err);
        await ctx.reply(t("wiz_error"), { ...HTML, ...kb.sitesMenu() });
      }
    }

    return ctx.scene.leave();
  },
);

addSiteScene.action("wizard:cancel", leaveWithCancel);

const stage = new Scenes.Stage([addSiteScene]);

module.exports = stage;
