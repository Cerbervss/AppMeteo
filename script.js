const content = document.querySelector(".content");
const pulsante = document.querySelector(".btn1");
const pos = document.querySelector(".pos");
const cerca = document.querySelector(".cerca");
const body = document.querySelector(".body");
const c1 = document.querySelector(".c1");
const c2 = document.querySelector(".c2");
const qq = document.querySelector(".qq");
const x = document.querySelector(".x");
const home = document.querySelector(".casa");
const ricerca = document.querySelector(".qq");
const srcbox = document.querySelector(".srcbox");
const container = document.querySelector(".container");

pulsante.addEventListener("click", () => {
    if(body.getAttribute("id") !== null){
        body.removeAttribute("id");
        qq.removeAttribute("id", "qq1");
        c1.setAttribute("stroke", "#7e7e7e");
        c2.setAttribute("stroke", "#7e7e7e");
        home.setAttribute("stroke", "#242424");
    } else {
        body.setAttribute("id", "body2");
        qq.setAttribute("id", "qq1");
        c1.setAttribute("stroke", "black");
        c2.setAttribute("stroke", "black");
        home.setAttribute("stroke", "#7e7e7e");
    }
});

qq.addEventListener("keypress", (e) =>{
    if(e.key == "Enter"){
        e.preventDefault();
        fattoApposta();
        content.setAttribute("id", "contentMin");
        container.setAttribute("id", "containerUp")
    }
})
cerca.addEventListener("click", () => {
    fattoApposta();
    content.setAttribute("id", "contentMin");
    container.setAttribute("id", "containerUp");
});

function fattoApposta() {
    const APIKey = "Inserire la tua chiave API";
    const city = ricerca.value;
    if (city === "") return;
    fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${APIKey}`)
    .then(response => response.json())
    .then(json =>{
        if(json[0] == null){
            while(container.firstChild) container.removeChild(container.firstChild);
            let e404 = document.createElement("div");
            e404.setAttribute("id", "container404");
            container.appendChild(e404);
        } else {
            while(container.firstChild) container.removeChild(container.firstChild);
            let finestra = document.createElement("div");
            for(let i = 0; i < json.length; i++){
                let temp1 = document.createElement("button");
                temp1.setAttribute("id", "scelta");
                temp1.setAttribute("class", `id${i}`);
                container.appendChild(temp1);
                temp1.innerHTML = json[i].state == undefined ? `${json[i].name} (${json[i].country})`:`${json[i].name}, ${json[i].state} (${json[i].country})`;
            }
            container.addEventListener("click", a => {
                if(a.target.getAttribute("id") != "scelta") return;
                let id = a.target.getAttribute("class");
                id = id[2].toString();
                let citta = json[id].name;
                while(container.firstChild) container.removeChild(container.firstChild);
                finestra.setAttribute("class", "finestra");
                container.appendChild(finestra);
                fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${json[id].lat}&lon=${json[id].lon}&appid=${APIKey}&units=metric`)
                .then(response => response.json())
                .then(json =>{
                    ricerca.value = `${citta} (${json.sys.country})`
                    ricerca.setAttribute("lat", json.coord.lat);
                    ricerca.setAttribute("lon", json.coord.lon);

                    let finestra2 = document.createElement("div");
                    finestra2.setAttribute("class", "finestra2");
                    let finestra3 = document.createElement("div");
                    finestra3.setAttribute("class", "finestra3");
                    let data = new Date(json.dt * 1000);
                    let ora = data.getHours();
                    switch (json.weather[0].main) {
                        case "Clear":
                            finestra2.style.backgroundImage = 6 <= ora <= 18 ? `url(immagini/sun.svg)` : "url(immagini/luna.svg)";
                            break;
                        case "Clouds":
                            finestra2.style.backgroundImage = "url(immagini/cloud.svg)";
                            break;
                        case "Rain":
                            finestra2.style.backgroundImage = `url(immagini/rain.svg)`;
                            break;
                        case "Drizzle":
                            finestra2.style.backgroundImage = 6 <= ora <= 18 ? "url(immagini/rainy-sun.svg)" : `url(immagini/rainy)`;
                            break;
                        case "Thunderstorm":
                            finestra2.style.backgroundImage = `url(immagini/storm.svg)`;
                            break;
                        case "Snow":
                            finestra2.style.backgroundImage = "url(immagini/snow.svg)";
                            break;
                        case "Atmosphere":
                            finestra2.style.backgroundImage = `url(immagini/fog.svg)`;
                            break;
                    }
                    finestra2.innerHTML = json.weather[0].description;
                    finestra3.innerHTML = citta;
                    const temperatura = document.createElement("div");
                    temperatura.setAttribute("class", "temp");
                    finestra3.appendChild(temperatura);
                    if(json.main.temp < 10){
                        temperatura.style.color = "#03fcf0"
                    } else if(10 < json.main.temp < 20){
                        temperatura.style.color = "#03fc0b"
                    } else if(20 < json.main.temp < 30){
                        temperatura.style.color = "#fce303"
                    } else {
                        temperatura.style.color = "#fc4a03"
                    }

                    temperatura.innerHTML = json.main.temp + "°C";
                    const maxmin = document.createElement("div");
                    maxmin.setAttribute("class", "maxmin");
                    finestra3.appendChild(maxmin);
                    maxmin.innerHTML = `Max ${json.main.temp_max}°C - Min ${json.main.temp_min}°C`;

                    const cont2 = document.createElement("div");
                    cont2.setAttribute("class", "cont2");
                    const umidita = document.createElement("div");
                    umidita.setAttribute("class", "umidita");
                    cont2.appendChild(umidita);
                    const vento = document.createElement("div");
                    vento.setAttribute("class", "vento");
                    cont2.appendChild(vento);
                    umidita.innerHTML = ""+json.main.humidity+"%";
                    umidita.style.backgroundImage = "url(immagini/umidita.svg)";
                    vento.innerHTML = "" + json.wind.speed+"Km/h";
                    vento.style.backgroundImage = "url(immagini/vento.svg)";

                    finestra3.appendChild(cont2);
                    finestra.appendChild(finestra2);
                    finestra.appendChild(finestra3);

                    const showmore = document.createElement("div");
                    showmore.setAttribute("class", "showmore");
                    finestra3.appendChild(showmore);
                    showmore.innerHTML = "mostra di più";
                    showmore.addEventListener("click", ()=>{
                        if(finestra.getAttribute("id") !== null) return;
                        showmore.style.visibility = "hidden";
                        finestra.setAttribute("id", "finestraUp");
                        const showless = document.createElement("div");
                        const more = document.createElement("div");
                        showless.setAttribute("class", "showless");
                        more.setAttribute("class","more");
                        more.innerHTML = 
                            `<p>Stato: ${json.sys.country}</p>
                            <p>Orario attuale: ${ora}:${data.getMinutes()}</p>
                            <p>Temperatura percepita: ${json.main.feels_like}°C</p>
                            <p>Visibilità: ${json.visibility/1000}Km</p>
                            <p>Latitudine: ${json.coord.lat}</p>
                            <p>Longitudine: ${json.coord.lon}</p>`
                        showless.innerHTML = "mostra meno";
                        finestra.appendChild(more);
                        finestra.appendChild(showless);
                        showless.addEventListener("click", () =>{
                            showmore.style.visibility = "visible"
                            finestra.removeAttribute("id");
                            finestra.removeChild(showless);
                            finestra.removeChild(more);
                        })
                    })
                }).catch((e) => console.log("Tipo di errore", e))
            })
        }
    }).catch((e) => console.log("Errore", e));
}

home.addEventListener("click", () => {
    content.removeAttribute("id");
    container.removeAttribute("id");
    while(container.firstChild) container.removeChild(container.firstChild);
    ricerca.value = "";
});

x.addEventListener("click", () => ricerca.value = "");

// pos.addEventListener("click", () => {
//     pos.setAttribute("type", "submit");
//     srcbox.setAttribute("action", "https://www.google.it/search?q");
// })


pos.addEventListener("click", () => {
    if(ricerca.getAttribute("lan") === "" || ricerca.getAttribute("lat") === ""){
        alert("Scegli prima una località");
    } else {
        const lon = Number(ricerca.getAttribute("lon"));
        const lat = Number(ricerca.getAttribute("lat"));
        window.location.href = `https://www.google.com/maps/@?api=1&map_action=map&center=${lat}%2C${lon}`;
    }
})