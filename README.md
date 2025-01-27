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
Now add your OpenAI secret key, your reddit credentials.

Next you need to initialise the Reddit script. After logging into Reddit (recommend to create a new Reddit account), visit this sub page which looks like Reddit of the early 2010s:



Fill in the details, select script and find some default values for the urls (it doesn't matter what you put there).

Now copy the bot id and bot secret into your `.env`

Finally: 

```bash
npx ts-node bot.ts
```
