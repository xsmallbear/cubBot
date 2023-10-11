export default class TelegrafLogger {
  options: any;
  constructor(options: any) {
    this.options = Object.assign(
      {
        log: console.log,
        format: "%ut => @%u %fn %ln (%fi): <%ust> %c",
        contentLength: 100,
      },
      options
    );
  }

  middleware() {
    return (ctx: any, next: any) => {
      let content;
      let updateTypeId;

      switch (ctx.updateType) {
        case "message":
          updateTypeId = ctx.message.message_id;

          if (ctx.message.text) {
            content = ctx.message.text;
          } else if (ctx.message.sticker) {
            content = ctx.message.sticker.emoji;
          } else {
            content = "";
          }

          break;

        case "edited_message":
          updateTypeId = ctx.editedMessage.message_id;
          content = ctx.editedMessage.text || "";
          break;

        case "channel_post":
          updateTypeId = ctx.channelPost.message_id;

          if (ctx.channelPost.text) {
            content = ctx.channelPost.text;
          } else if (ctx.channelPost.sticker) {
            content = ctx.channelPost.sticker.emoji;
          } else {
            content = "";
          }

          break;

        case "edited_channel_post":
          updateTypeId = ctx.editedChannelPost.message_id;
          content = ctx.editedChannelPost.text || "";
          break;

        case "callback_query":
          updateTypeId = ctx.callbackQuery.id;
          content = ctx.callbackQuery.data || "";
          break;

        case "inline_query":
          updateTypeId = ctx.inlineQuery.id;
          content = ctx.inlineQuery.query || "";
          break;

        case "chosen_inline_result":
          updateTypeId = ctx.chosenInlineResult.result_id;
          content = ctx.chosenInlineResult.query || "";
          break;

        case "shipping_query":
          updateTypeId = ctx.shippingQuery.id;
          content = ctx.shippingQuery.invoice_payload || "";
          break;

        case "pre_checkout_query":
          updateTypeId = ctx.preCheckoutQuery.id;
          content = ctx.preCheckoutQuery.invoice_payload || "";
          break;

        default:
          content = "";
          updateTypeId = null;
      }

      const { from = {}, chat = {}, session = {}, updateSubTypes = [] } = ctx;
      const text = this.options.format
        .replace(/%me\b/gim, ctx.me || null)
        .replace(/%u\b/gim, from.username || null)
        .replace(/%fn\b/gim, from.first_name)
        .replace(/%ln\b/gim, from.last_name || "")
        .replace(/%fi\b/gim, from.id)
        .replace(/%ci\b/gim, chat.id || null)
        .replace(/%ct\b/gim, chat.type || null)
        .replace(/%ctl\b/gim, chat.title || null)
        .replace(/%cu\b/gim, chat.username || null)
        .replace(/%ui\b/gim, ctx.update.update_id)
        .replace(/%ut\b/gim, ctx.updateType)
        .replace(/%uti\b/gim, updateTypeId)
        .replace(
          /%ust\b/gim,
          ctx.updateSubType || updateSubTypes[0] || ctx.updateType
        )
        .replace(
          /%si\b/gim,
          (session.__scenes && session.__scenes.current) || null
        )
        .replace(/ +/g, " ");

      if (content.length > this.options.contentLength) {
        content = `${content.slice(0, this.options.contentLength)}...`;
      }

      this.options.log(text.replace(/%c\b/gim, content.replace(/\n/g, " ")));
      return next();
    };
  }
}
