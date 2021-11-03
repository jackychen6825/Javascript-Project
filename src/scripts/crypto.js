class Crypto {
    constructor(ticker) {
        this.ticker = ticker;
        this.createChart();
        this.createTable();
    }

    async fetchCoin() {
        const SYM = this.ticker;
        const API_KEY = '6YCHHVKCZXK7NOCZ';
        const API_CALL = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${SYM}&outputsize=compact&apikey=${API_KEY}`;

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

    async fetchOverview() {
        const SYM = this.ticker;
        const API_KEY = '6YCHHVKCZXK7NOCZ';
        const API_CALL = `https://www.alphavantage.co/query?function=OVERVIEW&symbol=${SYM}&apikey=${API_KEY}`;

        let response = await fetch(API_CALL);
        let data = await response.json();

        const name = data.Name;
        const description = data.Description;
        const marketCap = data.MarketCapitalization;
        const ebitda = data.EBITDA;
        const pe = data.PERatio;

        return { name, description, marketCap, ebitda, pe };

    }

    async createChart() {
        const canvas = document.querySelector("canvas");
        canvas.remove();
        const canvasContainer = document.querySelector("#chart-container");
        const newCanvas = document.createElement("canvas");
        canvasContainer.appendChild(newCanvas);

        const stockInfo = await this.fetchStock();

        new Chart(document.querySelector("canvas"), {
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

    async createTable() {
        const tableHead = document.querySelector("thead");
        const tableBody = document.querySelector("tbody");
        const response = await this.fetchStock();
        const headers = ['Date', 'Open', 'High', 'Low', 'Close', 'Volume']
        const rows = [];



        for (let i = 0; i < 100; i++) {
            const row = [];
            row.push(response.DATE[i]);
            row.push(response.OPEN[i]);
            row.push(response.HIGH[i]);
            row.push(response.LOW[i]);
            row.push(response.CLOSE[i]);
            row.push(response.VOLUME[i]);
            rows.push(row);
        }

        console.log(response.DATE.reverse());

        //Clear the table 
        tableHead.innerHTML = "<tr></tr>";
        tableBody.innerHTML = "";

        //Popuate the headers 
        for (const headerText of headers) {
            const headerElement = document.createElement("th");

            headerElement.textContent = headerText;
            tableHead.querySelector("tr").appendChild(headerElement);
        }

        //Populate the rows
        for (const row of rows) {
            const rowElement = document.createElement("tr");

            for (const cellText of row) {
                const cellElement = document.createElement("td");

                cellElement.textContent = cellText;
                rowElement.appendChild(cellElement);
            }

            tableBody.appendChild(rowElement);
        }

    }

}

export default Stock;

