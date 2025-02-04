const fetch = require('node-fetch');

const listSym = $symbols.split(",").map(symbol => symbol.trim());
const apiKey = "RCZ9L50ZHU3106EL";
const baseUrl = "https://www.alphavantage.co/query";

try {
    // Fetch stock prices for each symbol
    const results = await Promise.all(
        listSym.map(async (symbol) => {
            try {
                const url = `${baseUrl}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`;
                const response = await fetch(url);
                const data = await response.json();

                if (!data["Global Quote"]) {
                    return { symbol, error: "Data not available" };
                }

                return {
                    symbol,
                    price: data["Global Quote"]["05. price"]
                };
            } catch (err) {
                // Error when mapping a company had an error
                return { symbol, error: err.message };
            }
        })
    );

    return { stocks: results };
} catch (error) {
    // Error when fetching data cannot be completed.
    return { error: "Failed to fetch stock data", details: error.message };
}
