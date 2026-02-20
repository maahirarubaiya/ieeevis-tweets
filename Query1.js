const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const DB = "ieeevisTweets";

async function main() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const col = client.db(DB).collection("tweet");

    const count = await col.countDocuments({
      retweeted_status: { $exists: false },
      in_reply_to_status_id: null,
    });

    console.log(`Tweets that are NOT retweets or replies: ${count}`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);