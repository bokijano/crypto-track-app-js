moveCart = () => {
  document.querySelector(".cart-overlay").classList.remove("transparent");
  document.querySelector(".cart").classList.remove("showCart");
};

//variables

const displayRow = document.querySelector(".currency-row");
const currencyTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-content");

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
      
      <td>$ <span class="total-value">0<span></td>
      `;
    });
    displayRow.innerHTML = result;
  }

  getAmountButtons = () => {
    const buttons = [...document.querySelectorAll(".amount-button")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
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
        let currencyItem = { ...Storage.getCurrency(id), amount: 2 };
        console.log(currencyItem);

        // add currency to the list
        list = [...list, currencyItem];

        // save own currency value in the local storage
        Storage.saveList(list);

        // set currency values
        this.setListValues(list);

        // display currency value
        this.addListItem(currencyItem);

        // show list of your currencies
        this.showCart();
      });
    });
  };
  setListValues(list) {
    let tempTotal = 0;
    list.map(item => {
      tempTotal = item.price * item.amount;
    });
    // currencyTotal.innerText = parseFloat(tempTotal.toFixed(2));
  }
  addListItem(item) {
    const tr = document.createElement("tr");
    tr.classList.add("cart-item");
    tr.innerHTML = `
    <td>${item.name}</td>
    <td>${item.symbol}</td>
    <td>$ ${item.price.toFixed(2)}</td>
    <td class="red-value">${item.percent_change_24h.toFixed(2)}</td> 
    
    <td>
      <input id="amount" class="amount-input" type="text" 
         value=${item.amount} />
      <button class="amount-button" data-id=${item.id}>Submit</button>
    </td>   
    
    <td>$ <span class="total-value">0<span></td> 
    `;
    cartContent.appendChild(tr);
  }
  showCart() {
    document.querySelector(".cart-overlay").classList.add("transparent");
    document.querySelector(".cart").classList.add("showCart");
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
