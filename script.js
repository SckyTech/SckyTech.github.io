onload = function () {
    const [lat, lon] = document.querySelectorAll("input");

    const horaires = document.getElementById("horaires");

    function updateFront() {
        SunCalc.addTime(Math.atan(1.0 / (1.0 + 1.0 / Math.tan(
            SunCalc.getPosition(SunCalc.getTimes(new Date(), Number(lat.value), Number(lon.value)).solarNoon, Number(lat.value), Number(lon.value)).altitude
        ))) * (180.0 / Math.PI), "pepsi", "peps");

        SunCalc.addTime(-16.5, "couscous", "lapin");

        const times = SunCalc.getTimes(new Date(), lat.value, lon.value);

        const sunset = new Date(times["sunset"]);
        sunset.setMinutes(sunset.getMinutes() + 90);
    
        horaires.innerText = [
            {time: times["couscous"], pray: "Fajr"},
            {time: times["sunrise"], pray: "Shurq"},
            {time: times["solarNoon"], pray: "Zohr"},
            {time: times["peps"], pray: "Ashr"},
            {time: times["sunset"], pray: "Magrb"},
            {time: sunset, pray: "Isha"}
        ].map(v => `${v.pray} : ${v.time.toLocaleTimeString()}`)
        .join("\n");
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
            lat.value = pos.coords.latitude;
            lon.value = pos.coords.longitude;

            updateFront();
            return;
        });
    } else {
        alert("Geolocation is not supported by this browser.");
    }

    updateFront();
};
