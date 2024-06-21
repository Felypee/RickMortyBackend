import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://relieved-crawdad-55843.upstash.io",
  token: "AdojAAIncDFmM2MyMTc1OGFhZDg0OTE0YWQ0MzQ1NGJiZmY2OTAxOXAxNTU4NDM",
});

export async function deleteCharacter(event) {
  const id = event.queryStringParameters.id;

  await redis.del(id);

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
  const redis = new Redis({
    url: "https://relieved-crawdad-55843.upstash.io",
    token: "AdojAAIncDFmM2MyMTc1OGFhZDg0OTE0YWQ0MzQ1NGJiZmY2OTAxOXAxNTU4NDM",
  });

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
