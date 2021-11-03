class Stock {
   constructor(ticker) {
       this.ticker = ticker;
       this.createPriceChart();
       this.createEarningsChart();
       this.createBalanceSheet();
   } 
   
   async fetchStock() {
       const SYM = this.ticker; 
       const API_KEY = '6YCHHVKCZXK7NOCZ';
       const API_CALL =  `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${SYM}&outputsize=compact&apikey=${API_KEY}`;

       const OPEN = []; 
       const HIGH = []; 
       const LOW = []; 
       const CLOSE = []; 
       const VOLUME = []; 
       const DATE = []; 

       let response = await fetch(API_CALL); 
       let data = await response.json();

        for (var key in data['Time Series (Daily)']) {
            DATE.push(key);
            OPEN.push(data['Time Series (Daily)'][key]['1. open']);
            HIGH.push(data['Time Series (Daily)'][key]['2. high']);
            LOW.push(data['Time Series (Daily)'][key]['3. low']);
            CLOSE.push(data['Time Series (Daily)'][key]['4. close']);
            VOLUME.push(
                parseFloat(data['Time Series (Daily)'][key]['6. volume']) / 100000
                );
        }     

        return { DATE, OPEN, HIGH, LOW, CLOSE, VOLUME }; 
    }

    async createPriceChart() {
        const canvas = document.querySelector(".price-chart");
        canvas.remove();
        const canvasContainer = document.querySelector("#price-chart-container");
        const newCanvas = document.createElement("canvas");
        newCanvas.className = "price-chart";
        canvasContainer.appendChild(newCanvas);

        const stockInfo = await this.fetchStock();

        new Chart(document.querySelector(".price-chart"), {
            data: {
                datasets: [{
                    type: 'bar',
                    label: 'Volume (M\'s)',
                    data: stockInfo.VOLUME.reverse(),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)'
                }, {
                    type: 'line',
                    label: 'Price History',
                    data: stockInfo.OPEN.reverse(),
                    borderColor: 'rgb(54, 162, 235)'
                }],
                labels: stockInfo.DATE.reverse()
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async createEarningsChart() {
        const SYM = this.ticker;
        const API_KEY = '6YCHHVKCZXK7NOCZ';
        const API_CALL = `https://www.alphavantage.co/query?function=EARNINGS&symbol=${SYM}&apikey=${API_KEY}`;

        const DATE = [];
        const REPORTED = [];
        const ESTIMATED = [];

        let res = await fetch(API_CALL);
        let data = await res.json();

        for (const hash of data['quarterlyEarnings']) {
            DATE.push(hash['fiscalDateEnding']); 
            REPORTED.push(hash['reportedEPS']);
            ESTIMATED.push(hash['estimatedEPS']);
        }

        const canvas = document.querySelector(".earnings-chart");
        canvas.remove();
        const canvasContainer = document.querySelector("#earnings-chart-container");
        const newCanvas = document.createElement("canvas");
        newCanvas.className = "earnings-chart";
        canvasContainer.appendChild(newCanvas);

        new Chart(document.querySelector(".earnings-chart"), {
            data: {
                datasets: [{
                    type: 'bar',
                    label: 'Reported EPS',
                    data: REPORTED.reverse(),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)'
                }, {
                    type: 'bar',
                    label: 'Estimated EPS',
                    data: ESTIMATED.reverse(),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgb(54, 162, 235)'
                }],
                labels: DATE.reverse()
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    async createBalanceSheet() {
        const SYM = this.ticker;
        const API_KEY = '6YCHHVKCZXK7NOCZ';
        const API_CALL = `https://www.alphavantage.co/query?function=BALANCE_SHEET&symbol=${SYM}&apikey=${API_KEY}`;

        const DATE = [];
        const ASSETS = [];
        const LIABILITIES = [];
        const EQUITY = [];

        let response = await fetch(API_CALL);
        let data = await response.json();

        for (const report of data['quarterlyReports']) {
            DATE.push(report['fiscalDateEnding']);
            ASSETS.push(
                parseFloat(report['totalAssets']) / 1000000
                );
            LIABILITIES.push(
                parseFloat(report['totalLiabilities']) / 1000000
                );
            EQUITY.push(
                parseFloat(report['totalShareholderEquity']) / 1000000
                );
        }

        const canvas = document.querySelector(".bs-chart");
        canvas.remove();
        const canvasContainer = document.querySelector("#bs-chart-container");
        const newCanvas = document.createElement("canvas");
        newCanvas.className = "bs-chart";
        canvasContainer.appendChild(newCanvas);

        new Chart(document.querySelector(".bs-chart"), {
            data: {
                datasets: [{
                    type: 'bar',
                    label: 'Assets',
                    data: ASSETS.reverse(),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)'
                }, {
                    type: 'bar',
                    label: 'Liabilities',
                    data: LIABILITIES.reverse(),
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgb(54, 162, 235)'
                }, {
                    type: 'bar',
                    label: 'Shareholder Equity',
                    data: EQUITY.reverse(),
                    borderColor: 'rgb(175,238,238)',
                    backgroundColor: 'rgb(175,238,238)'
                }],
                labels: DATE.reverse()
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}

export default Stock;

//finished...