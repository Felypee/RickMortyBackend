import { Redis } from "@upstash/redis";
import https from "https";
import { stringify } from "querystring";

const redis = new Redis({
  url: process.env.CLIENT_REDIS,
  token: process.env.CLIENT_SECRET,
});
export async function addCharacters(event) {
  let characters;
  try {
    characters = await fetchCharacters();
    characters = characters.results;
  } catch (error) {
    console.log("Error in lambda server", error);
    return {
      statusCode: 200,
    };
  }

  try {
    for (let i = 0; i < characters.length; i++) {
      const character = characters[i];
      await redis.set(character.id, character);
    }
  } catch (error) {
    console.log("Error in saving data");
    return {
      statusCode: 200,
    };
  }

  return {
    statusCode: 200,
  };
}
async function fetchCharacters() {
  return new Promise((resolve, reject) => {
    https
      .get("https://rickandmortyapi.com/api/character", (resp) => {
        let data = "";

        // A chunk of data has been received.
        resp.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on("end", () => {
          try {
            const characters = JSON.parse(data);
            resolve(characters);
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", (err) => {
        reject(err);
      });
  });
}
