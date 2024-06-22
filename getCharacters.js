import { Redis } from "@upstash/redis";
const redis = new Redis({
  url: process.env.CLIENT_REDIS,
  token: process.env.CLIENT_SECRET,
});

export async function getCharacters(event) {
  let characters;
  try {
    characters = await getTotalValues();
  } catch (error) {
    console.log("Error", error);
    return {
      statusCode: 200,
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ results: characters }),
  };
}

const getTotalValues = async () => {
  // Example to get the total number of keys
  const keys = await redis.keys("*");
  console.log("KEYS ", keys);
  let characters = [];

  for (const key of keys) {
    const value = await redis.get(key);
    characters.push(value);
  }

  return characters;
};
