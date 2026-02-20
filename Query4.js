const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const DB = "ieeevisTweets";

async function main() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const col = client.db(DB).collection("tweet");

    const results = await col.aggregate([
      {
        $group: {
          _id: "$user.screen_name",
          tweetCount: { $sum: 1 },
          avgRetweets: { $avg: "$retweet_count" },
        },
      },
      { $match: { tweetCount: { $gt: 3 } } },
      { $sort: { avgRetweets: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          screen_name: "$_id",
          tweetCount: 1,
          avgRetweets: { $round: ["$avgRetweets", 2] },
        },
      },
    ]).toArray();

    console.log("Top 10 by avg retweets (tweeted > 3 times):");
    results.forEach((r, i) =>
      console.log(
        `${i + 1}. @${r.screen_name} — avg ${r.avgRetweets} retweets over ${r.tweetCount} tweets`
      )
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);