import Snoowrap from 'snoowrap';
import dotenv from 'dotenv';
import 'node:process';
import OpenAI from 'openai';
import { getHasPosted, initDb, updateCompletedPost } from './database';

dotenv.config();

const triggerWords = [
  "could it be",
  "in situ",
  "chappel vault",
  "lot 5"
];

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
    const posts = await redditScan.getSubreddit(subreddit).getNew({ limit: 20 });
    //now run through all the posts searching for one that has "could it be" in the title or text
    for (const post of posts) {
      if (triggerWords.some(word => post.title.toLowerCase().includes(word) || post.selftext.toLowerCase().includes(word))) {
        console.log('Found post:', post.title);
        // check post ID against db:
        const hasPosted = getHasPosted(post.id);
        if (hasPosted) {
          console.log('Post already responded to, stop checking');
          return;
        }
        const fullText = post.title + " " + post.selftext;
        return fetchAIResponse(fullText)
          .then(response => {
            console.log('AI Response:', response);
            updateCompletedPost(post.id, response);
            return post.reply(response);
          })
          .then(replyResult => {
            console.log('Reply posted:', replyResult.id);
          });
      }
    }

    console.log("No post found");

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
    await new Promise(resolve => setTimeout(resolve, 60 * 60 * 1000));
  }
};

startBot().catch(console.error);
