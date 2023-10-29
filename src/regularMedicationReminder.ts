import { Telegraf } from "telegraf";
import corm from 'node-cron'
import hitokotoUtil from "./util/hitokotoUtil";

interface GroupChat {
    id: string;
    title: string;
    type: string
}

interface UserChat {
    id: string;
    first_name: string;
    username: string;
    type: string;
}

const isGroupChat = (obj: any): obj is GroupChat => {
    return 'id' in obj && 'title' in obj && 'type' in obj;
}

const isUserChat = (obj: any): obj is UserChat => {
    return 'id' in obj && 'first_name' in obj && 'username' in obj && 'type' in obj;
}

const grouplist: GroupChat[] = [
    { id: "-1001515727351", title: 'PrimCraftX2', type: 'supergroup' },
    { id: "-1001909939298", title: '从百草园到精神病群', type: 'supergroup' }
]

export default class RegularMedicationReminder {
    bot: Telegraf
    constructor(bot: Telegraf) {
        this.bot = bot;

        const task = corm.schedule("* * 4 * * *", () => {
            grouplist.forEach(g => {
                hitokotoUtil().then((data: any) => {
                    this.bot.telegram.sendMessage(g.id, "我是吃药小助手: 吃药了!吃药了! 温馨提示 ,快快吃药!!! 吃药 吃药")
                });

            })
        }, {
            scheduled: false
        })

        task.start()
    }

    command() {
        this.bot.command("subscription", ctx => {
            if (isGroupChat(ctx.chat)) {

            }
        })
    }
}