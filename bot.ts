import Snoowrap from 'snoowrap';
import dotenv from 'dotenv';
import 'node:process';
import OpenAI from 'openai';
import { getHasPosted, initDb, updateCompletedPost } from './database';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const redditScan = new Snoowrap({
  userAgent: 'ClotBot',
  clientId: process.env.BOT_ID,
  clientSecret: process.env.BOT_SECRET,
  username: process.env.REDDIT_USERNAME,
  password: process.env.REDDIT_PASSWORD
});

console.log(`${process.env.REDDIT_USERNAME} is logged in`);

const fetchLatestPost = async (subreddit: string) => {
  try {
    const posts = await redditScan.getSubreddit(subreddit).getNew({ limit: 1 });
    const latestPost = posts[0];
    console.log('Latest Post:', latestPost.title);

    const hasPosted = getHasPosted(latestPost.id);
    if (hasPosted) {
      console.log('Post already responded to');
      return;
    }

    console.log('Latest Post Body:', latestPost.selftext);
    console.log('latest post id:', latestPost.id);
    const fullText = latestPost.title + " " + latestPost.selftext;

    return fetchAIResponse(fullText)
      .then(response => {
        console.log('AI Response:', response);
        updateCompletedPost(latestPost.id, response);
        return latestPost.reply(response);
      })
      .then(replyResult => {
        console.log('Reply posted:', replyResult.id);
      });

  } catch (error) {
    console.error(error);
  }
};

async function fetchAIResponse(prompt: string): Promise<string> {
  let textOutput = "";
  const assistantId: string = process.env.ASSISTANT_ID || "";

  try {
    console.log("assistantId", assistantId);

    const thread = await openai.beta.threads.create({
      messages: [
        {
          role: 'user',
          content: `${prompt}`,
        },
      ],
    });

    await openai.beta.threads.runs
      .stream(thread.id, {
        assistant_id: assistantId,
      })
      .on('event', (event) => { })
      .on('textDelta', (delta, snapshot) => { textOutput = snapshot.value; })
      .on('run', (run) => console.log(run))
      .on('connect', () => console.log())
      .finalRun();

  } catch (error) {
    console.error('Error communicating with AI service', error);
  }

  return textOutput;
}


initDb();

const startBot = async () => {
  while (true) {
    await fetchLatestPost('OakIsland');
    await new Promise(resolve => setTimeout(resolve, 30 * 60 * 1000));
  }
};

startBot().catch(console.error);
