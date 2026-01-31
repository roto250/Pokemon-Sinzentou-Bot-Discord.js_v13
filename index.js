const Discord = require('discord.js');
const { Client, Intents, MessageEmbed } = require("discord.js");

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.MESSAGE_CONTENT,
    Intents.FLAGS.GUILD_VOICE_STATES
  ]
});


//スレッドが作成された際にアナウンスチャンネルにお知らせ文を送る
const ANNOUNCEMENT_CHANNEL_ID = '1466942397748478024';

async function sendAnnouncement(thread, targetChannelId, roleMention, title, color) {
  if (thread.parentId === targetChannelId) {
    const announcementChannel = await client.channels.fetch(ANNOUNCEMENT_CHANNEL_ID);
    const threadURL = `https://discord.com/channels/${thread.guild.id}/${thread.id}`;
    const author = await client.users.fetch(thread.ownerId);
    const embed = new MessageEmbed()
      .setDescription(`# ${title}\n**タイトル名**\n${thread.name}`)
      .setColor(color)
      .setTimestamp()
      .setAuthor(author.tag, author.displayAvatarURL());
    const messages = await thread.messages.fetch({ limit: 1 });
    const lastMessage = messages.first();
    if (lastMessage) {
      embed.setDescription(embed.description + `\n\n**内容**\n${lastMessage.content}\n**投稿**\n${threadURL}`);
    }
    announcementChannel.send(roleMention);
    announcementChannel.send({ embeds: [embed] });
  }
}

client.on('threadCreate', async (thread) => {
  sendAnnouncement(thread, "1466944610399027221", `<@&1466954559095177227>`, "交換", "#f54842");
  sendAnnouncement(thread, "1091236798891560971", `<@&1066288285166600213>`, "対戦", "#4242f5");
  sendAnnouncement(thread, "1091236898132983848", `<@&1066288434953592852>`, "レイド", "#b042f5");
  sendAnnouncement(thread, "1050334598493655040", `<@&1066308203148750968>`, "イベント", "#ff8400");
  sendAnnouncement(thread, "1091268683013304380", "", "その他", "#19b30b");
  sendAnnouncement(thread, "1064147660623331389", "", "自由", "#4269f5");
  sendAnnouncement(thread, "1050379050016837692", "", "記録", "#e60000");
  sendAnnouncement(thread, "1058179809085239306", "", "質問｜相談", "#00b090");
});

//ボイスチャットに参加や退出した際にお知らせ
client.on('voiceStateUpdate', (oldState, newState) => {
  const getMemberInfo = (state) => {
    const channelId = state.channel.id;
    const memberName = state.member.user.tag;
    const memberNickname = state.member.nickname || state.member.user.username;
    return { channelId, memberName, memberNickname };
  };

  const sendVoiceUpdateMessage = (channelId, messageContent) => {
    const textChannel = newState.guild.channels.cache.get(channelId);
    if (textChannel) {
      textChannel.send(messageContent);
    } else {
      console.error('指定されたテキストチャンネルが見つかりません。');
    }
  };

  if (oldState.channelId !== newState.channelId) {
    if (newState.channel) {
      const { channelId, memberNickname } = getMemberInfo(newState);
      const messageContent = `### 参加\n${memberNickname}`;
      sendVoiceUpdateMessage(channelId, messageContent);
    }

    if (oldState.channel) {
      const { channelId, memberNickname } = getMemberInfo(oldState);
      const messageContent = `### 退出\n${memberNickname}`;
      sendVoiceUpdateMessage(channelId, messageContent);
    }
  }
});


// サーバー内の会話を記録する
const sourceServerId = '1431553463187275816';
const sourceServerId2 = '1117340830118723624';
const sourceServerId3 = '1043816560650883093';

// 転送先のサーバーID
const destinationServerId = '1431553463187275816';
const destinationServerId2 = '1043816560650883093';
const destinationServerId3 = '1043816560650883093';

// 転送先のチャンネルID
const destinationChannelId = '1465717121127415850';
const destinationChannelId2 = '1155324713963356190';
const destinationChannelId3 = '1172160984316661830';

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  if (message.guild.id === sourceServerId) {
    const destinationServer = client.guilds.cache.get(destinationServerId);

    const destinationChannel = destinationServer.channels.cache.get(destinationChannelId);

    const embed = {
      author: {
        name: message.author.tag,
        icon_url: message.author.displayAvatarURL(),
      },
      description: message.content,
      fields: [{ name: 'メッセージリンク', value: message.url }],
    };

    await destinationChannel.send({ embeds: [embed] });
  } else if (message.guild.id === sourceServerId2) {
    const destinationServer2 = client.guilds.cache.get(destinationServerId2);

    const destinationChannel2 = destinationServer2.channels.cache.get(destinationChannelId2);

    const embed = {
      author: {
        name: message.author.tag,
        icon_url: message.author.displayAvatarURL(),
      },
      description: message.content,
      fields: [{ name: 'メッセージリンク', value: message.url }],
    };

    await destinationChannel2.send({ embeds: [embed] });
      } else if (message.guild.id === sourceServerId3) {
    const destinationServer3 = client.guilds.cache.get(destinationServerId3);

    const destinationChannel3 = destinationServer3.channels.cache.get(destinationChannelId3);

    const embed = {
      author: {
        name: message.author.tag,
        icon_url: message.author.displayAvatarURL(),
      },
      description: message.content,
      fields: [{ name: 'メッセージリンク', value: message.url }],
    };

    await destinationChannel3.send({ embeds: [embed] });
  }
});



//おみくじ
const fortunes = [
  '大吉',
  '中吉',
  '小吉',
  '吉',
  '末吉',
  '凶',
  '大凶'
];
client.on('messageCreate', (message) => {
  if (message.content === '!おみくじ') {
    const randomIndex = Math.floor(Math.random() * fortunes.length);
    const fortune = fortunes[randomIndex];
    message.reply(`あなたの運勢は\n${fortune}`);
  }
});


//ポケモンのおみくじ
const axios = require('axios');

client.on('messageCreate', async (message) => {
    if (message.content === '!ランポケ') {
        const pokemonNumber = getRandomPokemonNumber();

        try {
            const pokemon = await getPokemonByNumber(pokemonNumber);
            const embed = {
                title: 'ランダムなポケモン',
                description: `図鑑番号: ${pokemon.number}\n名前: ${pokemon.name}`,
                color: 0x00ff00,
                image: {
                    url: pokemon.image,
                },
            };
            message.reply({ embeds: [embed] });
        } catch (error) {
            console.error('ポケモンの取得中にエラーが発生しました', error);
            message.reply('ポケモンの取得中にエラーが発生しました');
        }
    }
});
function getRandomPokemonNumber() {
    return Math.floor(Math.random() * 1000) + 1;
}

async function getPokemonByNumber(number) {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${number}`);
    const { name, sprites } = response.data;
    const imageUrl = sprites.front_default;

    return { number, name, image: imageUrl };
}



//匿名でのお問い合わせが可能なシステム
const targetGuildId = '1039799815996968970';
const targetChannelId = '1466942397748478024';

client.on("ready", async () => {
    const data = [{
        name: "secretmessage",
        description: "匿名でのお問い合わせ",
        options: [
          {
        name: 'message',
        type: 'STRING',
        description: '内容を記入して下さい。',
        required: true
          }    ]
   }];
    await client.application.commands.set(data);
});


client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === 'secretmessage') {
    const guild = client.guilds.cache.get(targetGuildId);
    const channel = guild.channels.cache.get(targetChannelId);
    const message = interaction.options.getString('message');

    await channel.send(message);
    await interaction.reply({ content: '## 匿名お問い合わせを確認しました。\nお問い合わせありがとうございました。', ephemeral: true });
  }
});

client.login("");//tokenの入力欄です。提出の為、外しております。