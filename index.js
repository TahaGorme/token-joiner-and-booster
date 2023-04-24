process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection at:", promise, "reason:", reason);
  // Application specific logging, throwing an error, or other logic here
});

process.on("uncaughtException", (err, origin) => {
  console.log("Uncaught Exception at:", origin, "reason:", err);
  // Application specific logging, throwing an error, or other logic here
});

const config = require("./config.json");
const { Client } = require("discord.js-selfbot-v13");
var totalJoined = 0;
var failed = 0;

const fs = require("fs");
//read from tokens.txt
async function readTokens() {
  const tokens = fs.readFileSync("tokens.txt").toString().split("\n");

  for (i in tokens) {
    await new Promise((resolve) => setTimeout(resolve, i * config.joinDelay));
    doEverything(
      tokens[i]?.trim()?.replace("\r", "")?.replace("\n", ""),
      tokens
    );
  }
}
readTokens();

async function doEverything(token, tokens) {
  // console.log(token);
  const client = config.captcha_api_key
    ? new Client({
        captchaService: "2captcha",
        captchaKey: config.captcha_api_key,
        checkUpdate: false,
      })
    : new Client({ checkUpdate: false });

  client.on("ready", async () => {
    console.log(`Logged in as: ${client.user.username}`);
    await client
      .fetchInvite(config.inviteCode)
      .then(async (invite) => {
        await invite
          .acceptInvite(true)
          .then(async () => {
            console.log("Joined server as " + client.user.tag);
            totalJoined++;

            if (client.token === tokens[tokens.length - 1]) {
              console.log(
                `Joined ${totalJoined} servers and failed to join ${failed} servers`
              );
            }

            if (config.boost.enabled) {
              setTimeout(async () => {
                const allBoosts = await client.billing.fetchGuildBoosts();
                const firstBoost = allBoosts.first();
                await firstBoost.subscribe(config.boost.serverId);
                console.log(`Boosted Activated from ${client.user.tag}`);
              }, config.boost.delay);
            }
          })
          .catch((err) => {
            console.log("Unable to join the server as " + client.user.tag);
            failed++;

            console.error(err);

            if (client.token === tokens[tokens.length - 1]) {
              console.log(
                `Joined ${totalJoined} servers and failed to join ${failed} servers`
              );
            }
          });
      })
      .catch((err) => {
        console.error(err);
      });
  });
  client.login(token).catch(() => {
    console.log("The token "+token + " is invalid.");
    if (client.token === tokens[tokens.length - 1]) {
      console.log(
        `Joined ${totalJoined} servers and failed to join ${failed} servers`
      );
    }
  });
}
