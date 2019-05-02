//variables

// getting the currency from JSON file
class Currency {
  async getCurrencies() {
    try {
      let result = await fetch("currencies.json");
      let data = await result.json();
      let currency = data.data;
      currency = currency.map(item => {
        const { id, name, symbol } = item;
        const { price, percent_change_24h } = item.quote.USD;
        return { id, name, symbol, price, percent_change_24h };
      });
      return currency;
    } catch (error) {
      console.log(error);
    }
  }
}

// display currency
class UI {}

// local storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM fully loaded and parsed!");
  const ui = new UI();
  const currency = new Currency();

  // get all currencies
  currency.getCurrencies().then(res => console.log(res));
});
