const BASE_URL = "https://api.coingecko.com/api/v3";

export async function getMarketData() {
  try {
    const response = await fetch(
      `${BASE_URL}/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd&include_24hr_change=true`,
      {
        next: {
          revalidate: 30, // Cache for 30 seconds
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch market data");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return null;
  }
}