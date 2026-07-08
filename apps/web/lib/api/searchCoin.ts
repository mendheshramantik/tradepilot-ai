const BASE_URL = "https://api.coingecko.com/api/v3";

export async function searchCoin(symbol: string) {
  const searchResponse = await fetch(
    `${BASE_URL}/search?query=${symbol}`,
    {
      cache: "no-store",
    }
  );

  const searchData = await searchResponse.json();

  if (!searchData.coins.length) {
    return null;
  }

  const coin = searchData.coins[0];

  const detailResponse = await fetch(
    `${BASE_URL}/coins/${coin.id}`,
    {
      cache: "no-store",
    }
  );

  return await detailResponse.json();
}