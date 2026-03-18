# IEEE VIS 2020 Tweets — MongoDB Assignment

## Setup

### 1. Download the data
Download the tweet dump from:
https://johnguerra.co/viz/influentials/ieeevis2020/ieeevis2020Tweets.dump.bz2

### 2. Unzip the file
Use [Keka](https://www.keka.io/) (Mac) or [7-Zip](https://www.7-zip.org/) (Windows) to extract the `.bz2` file. You should end up with a `.dump` file.

### 3. Import into MongoDB
Run the following command:
```
mongoimport -h localhost:27017 -d ieeevisTweets -c tweet --file ieeevis2020Tweets.dump
```

### 4. Install dependencies
```
npm install
```

## Running the Queries

| File | Description |
|------|-------------|
| `Query1.js` | Count tweets that are not retweets or replies |
| `Query2.js` | Top 10 screen_names by follower count |
| `Query3.js` | Person who posted the most tweets |
| `Query4.js` | Top 10 by avg retweets (tweeted more than 3 times) |
| `Query5.js` | Separates users into a `Users` collection and creates `Tweets_Only` |

Run any query with:
```
node Query1.js
```
