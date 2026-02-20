const { MongoClient } = require("mongodb");

const URI = "mongodb://localhost:27017";
const DB = "ieeevisTweets";

async function main() {
  const client = new MongoClient(URI);
  try {
    await client.connect();
    const db = client.db(DB);
    const tweets = db.collection("tweet");

    // 1. Build unique Users collection
    console.log("Building Users collection...");
    await db.collection("Users").drop().catch(() => {});

    await tweets.aggregate([
      { $group: { _id: "$user.id", user: { $first: "$user" } } },
      { $replaceRoot: { newRoot: "$user" } },
      { $out: "Users" },
    ]).toArray();

    const userCount = await db.collection("Users").countDocuments();
    console.log(`Users collection created with ${userCount} unique users.`);

    // 2. Build Tweets_Only collection
    console.log("Building Tweets_Only collection...");
    await db.collection("Tweets_Only").drop().catch(() => {});

    await tweets.aggregate([
      { $addFields: { user_id: "$user.id" } },
      { $unset: "user" },
      { $out: "Tweets_Only" },
    ]).toArray();

    const tweetCount = await db.collection("Tweets_Only").countDocuments();
    console.log(`Tweets_Only collection created with ${tweetCount} tweets.`);

    // 3. Sanity check
    const sample = await db.collection("Tweets_Only").findOne({});
    console.log("\nSample Tweets_Only doc keys:", Object.keys(sample));
    console.log("Has 'user' field?", "user" in sample);
    console.log("Has 'user_id' field?", "user_id" in sample);
  } finally {
    await client.close();
  }
}

main().catch(console.error);