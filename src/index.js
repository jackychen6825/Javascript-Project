import Stock from "./scripts/stock"

document.addEventListener("DOMContentLoaded", () => {
 
    const stockForm = document.querySelector(".stock-form");
    
    const renderStock = (e) => {
        e.preventDefault(); 
        let input = document.querySelector("input[name='search-stock']");
        let ticker = input.value; 
        
        new Stock(ticker);
    }
    
    stockForm.addEventListener('submit', renderStock); 
})

