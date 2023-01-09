const form = document.querySelector('form')
const main = document.getElementById('main')
const secondary = document.getElementById('secondary')
const loading = document.getElementById('loading')
const timeEl = document.getElementById('time-el')

const directGeocoding = async (city) =>{
    const response = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=63f0db96107852b345b0a343bfa06e2c`)
    const latLon = await response.json()
    return latLon
}

form.addEventListener('submit', e =>{
    e.preventDefault()
    const initTime = new Date()
    timeEl.style.display = 'none'
    loading.style.display = 'block'
    main.innerHTML = ''
    secondary.innerHTML = ''
    let location = document.getElementById('location').value
    location = location[0].toUpperCase() + location.slice(1).toLowerCase()
    directGeocoding(location).then(data =>{
        fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&appid=63f0db96107852b345b0a343bfa06e2c`)
        .then(res => res.json())
        .then(weatherData => {
            const updateTime = new Date()
            timeEl.style.display = 'block'
            timeEl.innerText = 'Load duration:' + " " + (updateTime - initTime) /1000 + 'sec'
            loading.style.display = 'none'
            renderMainHtml(weatherData)
            renderSecondaryHtml(weatherData)
            //console.log(weatherData)
        })
    })
})

const renderMainHtml = (data) =>{
    main.innerHTML = `
        <div class='bg-primary p-3 rounded'>
            <h3> ${new Date().toDateString()}</h3>
            <h1>${data.weather[0].main}</h1>
            <p>${data.weather[0].description}</p>
            <hr>
            <p>Wind</p>
            <h3>${data.wind.speed} km/h</h3>
            <p>Hum</p>
            <h3>${data.main.humidity} %</h3>
            <p>Pressure</p>
            <h3>${data.main.pressure} hPa</h3>
        </div>
        <div>
        <div class='bg-success mb-5 p-3 rounded'>
            <p>Temp.</p>
            <h3>${(data.main.temp - 273.15).toFixed(2)} C</h3>
        </div>
        <div class='bg-info p-3 rounded'>
            <p>Max. Temp.</p>
            <h3>${(data.main.temp_max - 273.15).toFixed(2)} C</h3>
            <hr>
            <p>Min. Temp.</p>
            <h3>${(data.main.temp_min - 273.15).toFixed(2)} C</h3>
        </div>
        </div>`

}

const renderSecondaryHtml = (data) =>{
    secondary.innerHTML = `
    <div class='bg-primary rounded p-3'>
    <h1>Geo-Information</h1>
    <div class='d-flex justify-content-between'>
        <div>
            <h2>Country</h2>
            <p>${data.sys.country}</p>
        </div>
        <div>
            <h2>Longitude</h2>
            <p>${data.coord.lon}</p>
        </div>
        <div>
            <h2>Latitude</h2>
            <p>${data.coord.lat}</p>
        </div>
        <div>
            <h2>City</h2>
            <p>${data.name}</p>
        </div>
    </div>
    <h1 class='text-warning'>Bernard M.</h1>
    </div>`
}
