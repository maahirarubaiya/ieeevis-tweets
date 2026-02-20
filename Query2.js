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
          followers: { $max: "$user.followers_count" },
        },
      },
      { $sort: { followers: -1 } },
      { $limit: 10 },
      { $project: { _id: 0, screen_name: "$_id", followers: 1 } },
    ]).toArray();

    console.log("Top 10 screen_names by followers:");
    results.forEach((r, i) =>
      console.log(`${i + 1}. @${r.screen_name} — ${r.followers} followers`)
    );
  } finally {
    await client.close();
  }
}

main().catch(console.error);