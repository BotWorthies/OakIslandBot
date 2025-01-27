# OakIslandBot
A bot which responds to Oak Island r/Oak Island posts in the style of the Oak Island narrator (Robert Clotworthy).

For edits to the agent, please submit PR for the agent.txt file. 

To use:

```bash
git clone https://github.com/BotWorthies/OakIslandBot.git
```
```bash
cd OakIslandBot
```
```bash
npm install
```
```bash
cp .env.example .env
```
Now add your OpenAI secret key and your reddit credentials (of either your account or create a new account for your bot to post from). You will need to create an Agent too. You can do this from your OpenAI account:

https://platform.openai.com/playground/assistants

Simply add a new assistant, give it a name and copy the text in agent.txt into the agent like this:

![Screenshot 2025-01-27 183354](https://github.com/user-attachments/assets/cc5f6258-8e8e-4f16-8afc-a443daf10077)

Next you need to initialise the Reddit script. After logging into Reddit (recommend to create a new Reddit account), visit this sub page which looks like Reddit of the early 2010s:

https://www.reddit.com/prefs/apps/

Fill in the details, select script and find some default values for the urls (it doesn't matter what you put there).

Now copy the bot id and bot secret into your `.env`. The bot id you can see next to the icon under the text "personal use script".

Finally: 

```bash
npx ts-node bot.ts
```
