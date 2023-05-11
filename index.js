const chalk = require("chalk");

process.on("unhandledRejection", (reason, promise) => {
  console.log(`${chalk.redBright("[ERROR]")} Unhandled rejection at ${promise}, reason: ${reason}`);
  // Application specific logging, throwing an error, or other logic here
});

process.on("uncaughtException", (err, origin) => {
  console.log(`${chalk.redBright("[ERROR]")} Uncaught exception: ${err} at ${origin}}`);
  // Application specific logging, throwing an error, or other logic here
});
const gradient = require('gradient-string');
var retry = []
const config = require("./config.json");
const { Client } = require("discord.js-selfbot-v13-proxy");
var totalJoined = 0;
var failed = 0;
const HttpsProxyAgent = require('https-proxy-agent');
const fs = require("fs");
//read from tokens.txt

const proxies = fs.readFileSync("proxies.txt").toString().split("\n");


console.log(gradient.rainbow("Token Joiner by T4H4"));

async function readTokens() {
  const tokens = fs.readFileSync("tokens.txt").toString().split("\n");
  var j = 1;
  for (i in tokens) {
    // await new Promise((resolve) => setTimeout(resolve, i * 100));
    doEverything(
      tokens[i]?.trim()?.replace("\r", "")?.replace("\n", ""),
      tokens,
      j
    );
    j++;
  }
}
readTokens();

async function doEverything(token, tokens, i) {
  const randomProxy = proxies[Math.floor(Math.random() * proxies.length)]?.replace("\r", "")?.replace("\n", "");
  var client;
  if (config.useProxies) {


    client = config.captcha_api_key
      ? new Client({
        captchaService: config.captcha_service.toLowerCase(),
        captchaKey: config.captcha_api_key,
        checkUpdate: false,
        proxy: randomProxy,
        restRequestTimeout: 60 * 1000,
        interactionTimeout: 60 * 1000,
        restWsBridgeTimeout: 5 * 1000
      })
      : new Client({ checkUpdate: false });

  }

  else {
    client = config.captcha_api_key
      ? new Client({
        captchaService: config.captcha_service.toLowerCase(),
        captchaKey: config.captcha_api_key,
        checkUpdate: false,
      })
      : new Client({ checkUpdate: false });
  }
  client.on("ready", async () => {
    console.log(chalk.green("Logged in as ") + gradient.cristal(client.user.tag));

    setTimeout(async () => {
      await client
        .fetchInvite(config.inviteCode)
        .then(async (invite) => {

          await invite
            .acceptInvite(true)
            .then(async () => {
              console.log(chalk.greenBright(`Joined as ${gradient.passion(client.user.tag)}`));
              totalJoined++;
              process.title = `Joined: ${totalJoined} | Failed: ${failed}`;

              // var data = fs.readFileSync("tokens.txt", "utf-8");
              // fs.writeFileSync("tokens.txt", data.replace(token+"\n", ""));

              if (client.token === tokens[tokens.length - 1]) {
                console.log(`${chalk.magentaBright("[INFO]")} Joined ${gradient.passion(totalJoined)} servers and failed to join ${gradient.passion(failed)} servers}`)

                process.title = `Joined: ${totalJoined} | Failed: ${failed}`;
              }

              if (config.boost.enabled) {
                setTimeout(async () => {
                  const allBoosts = await client.billing.fetchGuildBoosts();
                  const firstBoost = allBoosts.first();
                  await firstBoost.subscribe(config.boost.serverId);
                  console.log(`${chalk.greenBright("[SUCCESS]")} Boosted Server as ${gradient.cristal(client.user.tag)}}`);
                  client.destroy();
                }, config.boost.delay);
              } else {
                client.destroy();
              }
            })
            .catch((err) => {
              console.log(`${chalk.redBright("[ERROR]")} Failed to join as ${gradient.fruit(client.user.tag)}`);
              failed++;
              process.title = `Joined: ${totalJoined} | Failed: ${failed}`;


              console.error(chalk.redBright(err));

              if (client.token === tokens[tokens.length - 1]) {
                console.log(`${chalk.magentaBright("[INFO]")} Joined ${gradient.passion(totalJoined)} servers and failed to join ${gradient.passion(failed)} servers}`)

                process.title = `Joined: ${totalJoined} | Failed: ${failed}`;

              }

              if (err?.toString()?.includes("DiscordAPIError: Unknown Message")) {
                if (!retry.includes(client.user.id)) {
                  setTimeout(async () => {
                    retry.push(client.user.id)
                    doEverything(token, tokens, i);
                  }, 10000)
                }
                else client.destroy();

              } else {
                client.destroy();
              }
            });
        })
        .catch((err) => {
          console.error(err);
        });
    }, config.joinDelay * i);
  });
  client.login(token).catch(() => {
    console.log(`${chalk.redBright("[ERROR]")} Invalid token ${gradient.instagram(token)}}`);
    var data = fs.readFileSync("tokens.txt", "utf-8");
    fs.writeFileSync("tokens.txt", data.replace(token + "\n", ""));

    if (client.token === tokens[tokens.length - 1]) {
      console.log(`${chalk.magentaBright("[INFO]")} Joined ${gradient.passion(totalJoined)} servers and failed to join ${gradient.passion(failed)} servers}`)

      process.title = `Joined: ${totalJoined} | Failed: ${failed}`;

    }
  });
}