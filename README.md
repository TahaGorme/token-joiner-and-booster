# Discord Server Joiner and Booster

Discord Server Joiner and Booster is a script that allows you to automatically join a Discord server using multiple user tokens and boost them. This script also supports server boosting and 2captcha API key for captcha solving.



## Installation

Download [nodejs](https://nodejs.org/)



```javascript
git clone https://github.com/TahaGorme/token-joiner-and-booster.git
```

```javascript
cd token-joiner-and-booster
```

```bash
npm i
```

```javascript
node .
```
## Config

The config.json file contains the following properties:

- `captcha_api_key`: (optional) Your 2captcha API key for solving captchas.
- `tokens`: An array of Discord account tokens.
- `inviteCode`: The invite code for the Discord server you wish to join.
- `joinDelay`: The delay (in milliseconds) between each join attempt.
- `boost`: (optional) An object containing properties for server boosting.
    - `enabled`: Whether or not you want to boost the server on joining.
    - `delay`: The delay (in milliseconds) before boosting the server.
    - `serverId`: The ID of the server to boost.

### Program Usage

The program will automatically attempt to join the server using each token provided in the config file. The `joinDelay` property determines the delay between each join attempt. 

If server boosting is enabled, the program will wait for the specified delay before boosting the server with the first available boost.

### Error Handling

The program includes error handling for unhandled rejections and uncaught exceptions. If an error occurs, the program will log the error message and continue running.

## Discord Server
https://discord.gg/HGfFFUQ7F7

## Contributing
Pull requests are welcomed. For major changes, please open an issue first to discuss what you would like to change.


## License
[MIT](https://choosealicense.com/licenses/mit/)
