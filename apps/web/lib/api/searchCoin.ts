const BASE_URL = "https://api.coingecko.com/api/v3";

export async function searchCoin(coin: string) {
  const response = await fetch(
    `${BASE_URL}/coins/${coin}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    return null;
  }

  return await response.json();
}