let selectedCoins = [];
let liveReportInterval;
const maxNumberOfCoins = undefined; // undefined = unlimited

const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        search();
    }
});

const showCurrencies = async () => {
    if (liveReportInterval) {
        clearInterval(liveReportInterval);
    }

    document.getElementById('liveReportsButton').disabled = (selectedCoins.length === 0);

    document.getElementById("content").innerHTML = `<img hidden id="spinner" src="assets/neko-spinner.gif">`;

    const spinner = document.getElementById("spinner");
    spinner.removeAttribute("hidden");
    try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/list');
        const coins = await res.json();
        let numberOfCoins = 0;
        for (const coin of coins) {
            numberOfCoins++;
            if (maxNumberOfCoins && numberOfCoins > maxNumberOfCoins) {
                break;
            }

            const isChecked = selectedCoins.some(checkedCoin => checkedCoin.coinSymbol === coin.symbol);
            const card = document.createElement("div");
            card.id = coin.id;
            card.setAttribute('data-symbol', coin.symbol);
            card.innerHTML = `
                            <div class='card-border'>
                                <div class="card coin-card" style="width: 18rem;">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <h5 class="card-title">${coin.symbol}</h5>
                                            <div class="form-check form-switch  ">
                                                <input class="form-check-input checkbox" ${isChecked ? 'checked' : ''} onclick="selectCoin('check_${coin.id}', '${coin.symbol}')" type="checkbox" id="check_${coin.id}">
                                            </div>
                                        </div>

                                        <p class="card-text">${coin.name}</p>

                                        <button type="button"
                                        class="btn btn-dark gradient-bg"
                                        onclick="coinInfo('${coin.id}')"
                                        data-bs-toggle="collapse" 
                                        data-bs-target="#collapse_${coin.id}"
                                        aria-expanded="false"
                                        aria-controls="${coin.id}">
                                                More Info
                                        </button>
                                        
                                        <div class="collapse" id="collapse_${coin.id}"></div>

                                        <img hidden id="spinner-small_${coin.id}" class="spinner-small" src="assets/neko-spinner.gif">
                                    </div>
                                    
                                </div>
                            </div>
                            `
            document.getElementById("content").append(card);
            spinner.setAttribute('hidden', '');
        }
    }

    catch (error) {
        console.log(error)
    }
}

showCurrencies();

const coinInfo = async (coinId) => {
    const collapse = document.getElementById(`collapse_${coinId}`);
    collapse.innerText = "";
    const spinner = document.getElementById(`spinner-small_${coinId}`);

    if (collapse.previousSibling.previousSibling.getAttribute('aria-expanded') === 'true') {
        spinner.removeAttribute("hidden");

        const twoMinutes = 1000 * 60 * 2;
        if ((Date.now() - localStorage.getItem(`${coinId}-timeStamp`)) > twoMinutes) {
            try {
                const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}`);
                const coinDetails = await res.json();
                localStorage.setItem(`${coinId}-timeStamp`, Date.now())
                localStorage.setItem(`${coinId}-image`, coinDetails.image.large)
                localStorage.setItem(`${coinId}-usd`, coinDetails.market_data.current_price.usd)
                localStorage.setItem(`${coinId}-ils`, coinDetails.market_data.current_price.ils)
                localStorage.setItem(`${coinId}-eur`, coinDetails.market_data.current_price.eur)
            }

            catch (error) {
                console.log(error)
            }

        }

        const moreInfo = document.createElement('div');
        moreInfo.classList.add("card", "card-body", "coin-info");
        moreInfo.innerHTML = `
            <img class='coin-img' src='${localStorage.getItem(`${coinId}-image`)}'>
            <div>
                <p>${localStorage.getItem(`${coinId}-usd`)}$</p>
                <p>${localStorage.getItem(`${coinId}-ils`)}₪</p>
                <p>${localStorage.getItem(`${coinId}-eur`)}€</p>
            </div>
        `;
        collapse.append(moreInfo);
        spinner.setAttribute('hidden', '');
    }
}

const about = () => {
    document.getElementById("content").innerHTML = `
<div class='about'>
    <div class='profile-img-border'>

    <img src="assets/selfie.jpg">
</div>

<div>
    <h1 >Made with 💜 by Tali Volf</h1>

    <a href="https://www.facebook.com/mytree.xx" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#4AF626"
            class="bi bi-facebook" viewBox="0 0 16 16">
            <path
                d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75
                7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157
                1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354
                2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
        </svg>
    </a>

    <a href="https://github.com/mytreexx" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#4AF626"
            class="bi bi-github" viewBox="0 0 16 16">
            <path
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38
                0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01
                1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95
                0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27
                2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82
                1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2
                0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
        </svg>
    </a>

    <a href="mailto:tali.vulf@gmail.com" target="_blank">
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="#4AF626"
            class="bi bi-envelope" viewBox="0 0 16 16">
            <path
                d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1
                0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383l-4.758 2.855L15 11.114v-5.73zm-.034
                6.878L9.271 8.82 8 9.583 6.728 8.82l-5.694 3.44A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.739zM1
                11.114l4.758-2.876L1 5.383v5.73z" />
        </svg>
    </a>

    <p>THE. BEST. PROJECT. EVER.</p>

    <pre>
         /\\_/\\
    ____/ o o \\
  /~____  =ø= /
 (______)__m_m)
    </pre>
</div>
`;
}

const search = () => {
    const searchInput = document.getElementById('searchInput').value;
    const coinList = document.getElementById('content').childNodes;

    let hasAnythingFound = false;
    coinList.forEach(coin => {
        const symbol = coin.getAttribute('data-symbol');

        if (symbol) {
            if (searchInput === "" || symbol.toLowerCase() === searchInput.toLowerCase()) {
                coin.hidden = false;
                hasAnythingFound = true;
            } else {
                coin.hidden = true;
            }
        }
    });

    if (!hasAnythingFound) {
        alert('No results');
    }
}

const selectCoin = (coinId, coinSymbol) => {
    const isChecked = document.getElementById(coinId).checked;

    if (isChecked) {
        if (selectedCoins.length < 5) {
            selectedCoins.push({
                coinSymbol,
                coinId
            })
        } else {
            showModal(coinSymbol, coinId);
            document.getElementById(coinId).checked = false;

        }
    } else {
        selectedCoins = selectedCoins.filter(coin => coin.coinSymbol !== coinSymbol);
    }

    document.getElementById('liveReportsButton').disabled = (selectedCoins.length === 0);
}

const showModal = (extraCoinSymbol, extraCoinId) => {
    $(".extra-coin").html(extraCoinSymbol);
    const coinList = document.getElementById('modalCoinList');
    coinList.innerHTML = '';

    selectedCoins.forEach(coin => {
        const coinOption = document.createElement("li");
        coinOption.classList.add("list-group-item", "gradient-bg", "bg-purple");
        coinOption.innerHTML = coin.coinSymbol;
        coinOption.setAttribute("onclick", `replaceCoin("${coin.coinSymbol}", "${coin.coinId}", "${extraCoinSymbol}", "${extraCoinId}")`);
        coinList.append(coinOption)
    });

    $('#coinModal').modal('show');
}

const replaceCoin = (removedCoinSymbol, removedCoinId, addedCoinSymbol, addedCoinId) => {
    selectedCoins = selectedCoins.filter(coin => coin.coinSymbol !== removedCoinSymbol);
    selectedCoins.push({
        coinSymbol: addedCoinSymbol,
        coinId: addedCoinId

    })

    $('#coinModal').modal('hide');

    document.getElementById(removedCoinId).checked = false;
    document.getElementById(addedCoinId).checked = true;
}


const fetchCoinPrice = async () => {
    const coinList = selectedCoins.map(coin => coin.coinSymbol).join(',');
    const currencyHistory = [];
    selectedCoins.forEach(coin =>
        currencyHistory.push({
            type: "spline",
            name: coin.coinSymbol,
            showInLegend: true,
            xValueType: "dateTime",
            dataPoints: []
        })
    );

    const div = document.createElement('div');
    div.id = 'chartContainer';
    div.style = 'height: 370px; width: 100%; max-width: 1800px;';
    document.getElementById("content").innerHTML = '';
    document.getElementById("content").append(div);

    const chart = new CanvasJS.Chart("chartContainer", {
        exportEnabled: false,
        animationEnabled: true,
        theme: "dark2",
        title: {
            text: `${coinList.toUpperCase()} to USD`
        },
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: currencyHistory
    });

    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    const updateChart = async function () {
        try {
            const res = await fetch(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinList}&tsyms=USD`)
            const data = await res.json();
            currencyHistory.forEach(coin => {
                const coinData = data[coin.name.toUpperCase()];
                if (coinData) {
                    coin.dataPoints.push({
                        x: Date.now(),
                        y: coinData.USD
                    });
                }
            });

            chart.render();
        }
        catch (error) {
            console.log(error)
        }
    }

    updateChart();

    liveReportInterval = setInterval(updateChart, 2000);
}