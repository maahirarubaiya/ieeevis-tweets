const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const DB = "ieeevisTweets";

async function main() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const col = client.db(DB).collection("tweet");

    const [top] = await col.aggregate([
      { $group: { _id: "$user.screen_name", tweetCount: { $sum: 1 } } },
      { $sort: { tweetCount: -1 } },
      { $limit: 1 },
    ]).toArray();

    console.log(`Most tweets: @${top._id} with ${top.tweetCount} tweets`);
  } finally {
    await client.close();
  }
}

main().catch(console.error);