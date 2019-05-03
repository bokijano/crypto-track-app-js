//variables

const displayRow = document.querySelector(".currency-row");

let currencyArray = [];

// getting the currency from JSON file
class Currency {
  async getCurrencies() {
    try {
      let result = await fetch("currencies.json");
      let data = await result.json();
      let currencies = data.data;
      currencies = currencies.map(item => {
        const { id, name, symbol } = item;
        const { price, percent_change_24h } = item.quote.USD;

        return { id, name, symbol, price, percent_change_24h };
      });
      return currencies;
    } catch (error) {
      console.log(error);
    }
  }
}

// display currencies
class UI {
  displayCurrencies(currencies) {
    console.log(currencies);

    let result = "";
    currencies.forEach(currency => {
      result += `
      <td>${currency.name}</td>
      <td>${currency.symbol}</td>
      <td>${currency.price.toFixed(2)}</td>
      <td class="red-value">${currency.percent_change_24h.toFixed(2)}</td> 
      
      <td>
        <input type="text" />
        <button class="amount-button" data-id=${currency.id}>Submit</button>
      </td>
      <td></td>
      `;

    });
    displayRow.innerHTML = result;
  }
}


// local storage
class Storage {}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const currency = new Currency();

  // get all currencies
  currency.getCurrencies().then(currency => ui.displayCurrencies(currency));
});
