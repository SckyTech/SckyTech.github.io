function calculateTimes(copy_times, lat_num, lon_num, today) {
    SunCalc.times = Array.from(copy_times, v => Array.from(v, w => w));

    SunCalc.addTime(Math.atan(1.0 / (1.0 + 1.0 / Math.tan(
        SunCalc.getPosition(SunCalc.getTimes(today, lat_num, lon_num).solarNoon, lat_num, lon_num).altitude
    ))) * (180.0 / Math.PI), "pepsi", "peps");

    SunCalc.addTime(-16.5, "couscous", "lapin");

    return SunCalc.getTimes(today, lat_num, lon_num);
}

function daysInMonth(iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
}

function updateFront(copy_times, lat_num, lon_num) {    
    const times = calculateTimes(copy_times, lat_num, lon_num, new Date());
    
    horaires.innerText = [
        {time: times.couscous, pray: "Fajr"},
        {time: times.sunrise, pray: "Shurq"},
        {time: times.solarNoon, pray: "Zohr"},
        {time: times.peps, pray: "Ashr"},
        {time: times.sunset, pray: "Magrb"},
        {time: times.lapin, pray: "Isha"}
    ].map(v => `${v.pray} : ${v.time.toLocaleTimeString()}`)
    .join("\n");

    for (const item of document.querySelectorAll(".day")) {
        const [day, month, year] = item.getAttribute("data-value").split(" ").map(v => Number(v));

        const day_times = calculateTimes(copy_times, lat_num, lon_num, new Date(year, month, day, 12, 0, 0));

        item.innerHTML = "<td>" + day + "</td>" + [
                day_times.couscous,
                day_times.sunrise,
                day_times.solarNoon,
                day_times.peps,
                day_times.sunset,
                day_times.lapin
        ].map(v => `<td>${v.toLocaleTimeString()}</td>`).join('');
    }
}

onload = function () {
    const [lat, lon] = document.querySelectorAll("input");

    const [auto_mode] = document.querySelectorAll("button");
    
    const copy_times = Array.from(SunCalc.times, v => Array.from(v, w => w));

    let lastMonth = new Date();
    lastMonth.setDate(lastMonth.getDate() + 1);

    function cb(pos) {        
        if (auto_mode.style.display == "block")
            return;

        lat.value = pos.coords.latitude;
        lon.value = pos.coords.longitude;

        updateFront(copy_times, Number(pos.coords.latitude), Number(pos.coords.longitude));
        return;
    };

    auto_mode.addEventListener("click", function() {
        auto_mode.style.display = "none";

        if (navigator.geolocation) {    
            navigator.geolocation.getCurrentPosition(cb);
        }

        updateFront(copy_times, Number(lat.value), Number(lon.value));
    });

    lat.onchange = function() {
        auto_mode.style.display = "block";
        updateFront(copy_times, Number(lat.value), Number(lon.value));
    };

    lon.onchange = lat.onchange;

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(cb);
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    const months = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"]

    window.onscroll = function(ev) {
        if ((window.innerHeight + Math.round(window.scrollY)) < document.body.offsetHeight)
            return;
        
        horairesmois.innerHTML += 
        `<br>${months[lastMonth.getMonth()]} ${lastMonth.getFullYear()}<br><table>
                <tr>
                    <th>heures</th>
                    <th>Fajr</th>
                    <th>Shurq</th>
                    <th>Zohr</th>
                    <th>Ashr</th>
                    <th>Magrb</th>
                    <th>Isha</th>
                </tr>
                ${Array.from(new Array(daysInMonth(lastMonth.getMonth(), lastMonth.getFullYear()) - lastMonth.getDate() + 1), (_, i) => `
                    <tr class="day" data-value="${lastMonth.getDate() + i} ${lastMonth.getMonth()} ${lastMonth.getFullYear()}"></tr>`).join("")}
            </table>`;
        
        updateFront(copy_times, Number(lat.value), Number(lon.value));
        
        lastMonth.setDate(1);
        
        lastMonth.setMonth(lastMonth.getMonth() + 1);
    };

    window.onscroll();
};