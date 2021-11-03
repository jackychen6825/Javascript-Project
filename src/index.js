import Stock from "./scripts/stock"

document.addEventListener("DOMContentLoaded", () => {
    // const stock = document.getElementById("stock")
    // new Stock(stock) 
    const stockForm = document.querySelector(".stock-form");
    
    //create an event handler that renders graph 
    const renderPriceChart = (e) => {
        e.preventDefault(); //stops the page from refreshing after clicking "get information"
        let input = document.querySelector("input[name='search-stock']");
        let ticker = input.value; //grabs the ticker from the input 
        //make a new instance of stock: thereby also rendering the price chart 
        new Stock(ticker);
    }
    
    //add eventlistener to stock form 
    stockForm.addEventListener('submit', renderPriceChart); 
   
    
})

