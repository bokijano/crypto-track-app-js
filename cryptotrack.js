//variables

const displayRow = document.querySelector(".currency-row");

// list of owner currencies
let list = [];
let buttonsDOM = [];

// getting the currency from JSON file
class Currency {
  async getCurrencies() {
    try {
      let result = await fetch("currencies.json");
      let data = await result.json();
      let currencies = data.data;
      console.log(currencies);
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
    let result = "";
    currencies.forEach(currency => {
      result += `
      <td>${currency.name}</td>
      <td>${currency.symbol}</td>
      <td>$ ${currency.price.toFixed(2)}</td>
      <td class="red-value">${currency.percent_change_24h.toFixed(2)}</td> 
      
      <td>
        <input id="amount" class="amount-input" type="text" 
           placeholder="your crypto amount" />
        <button class="amount-button" data-id=${currency.id}>Submit</button>
      </td>   
      
      <td id="ownValue">$ 0.0</td>
      `;
    });
    displayRow.innerHTML = result;
  }

  getAmountButtons = () => {
    const buttons = [...document.querySelectorAll(".amount-button")];
    buttonsDOM = buttons;
    button.forEach(button => {
      let id = button.dataset.id;
      let listItem = list.find(item => item.id === id);
      if (listItem) {
        button.innerHTML = "You own cryptocurrency";
        button.disabled = true;
      }
      button.addEventListener("click", event => {
        event.target.innerText = "You own cryptocurrency";
        event.target.disabled = true;

        // get currency from currencies
        let currencyItem = { ...Storage.getCurrency(id), amount: 0 };
        console.log(currencyItem);

        // add currency to the list
        list = [...list, currencyItem];

        // save own currency value in the local storage
        Storage.saveList(list);

        // set currency values
        this.setListValues(list);

        // display currency value

        // show list of your currencies
      });
    });
  };
  setListValues(list) {
    let tempTotal = 0;
    let itemsTotal = 0;
    list.map(item => {
      tempTotal += item.price = item.amount;
      itemsTotal += item.amount;
    })
  }
}

// local storage
class Storage {
  static saveCurrencies(currencies) {
    localStorage.setItem("currencies", JSON.stringify(currencies));
  }

  static getCurrency(id) {
    let currencies = JSON.parse(localStorage.getItem("currencies"));
    return currencies.find(item => item.id === id);
  }

  static saveList() {
    localStorage.setItem("list", JSON.stringify(list));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const currency = new Currency();

  // get all currencies
  currency
    .getCurrencies()
    .then(currencies => {
      ui.displayCurrencies(currencies);
      Storage.saveCurrencies(currencies);
    })
    .then(() => {
      ui.getAmountButtons();
    });
});
