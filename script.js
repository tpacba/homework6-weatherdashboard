$(document.body).ready(function() {

    var weatherStorage = [];

    $("#day0").text(moment().format('LL'));
    $("#day1").text(moment().add(1, 'days').format('ddd, MMMM D'));
    $("#day2").text(moment().add(2, 'days').format('ddd, MMMM D'));
    $("#day3").text(moment().add(3, 'days').format('ddd, MMMM D'));
    $("#day4").text(moment().add(4, 'days').format('ddd, MMMM D'));
    $("#day5").text(moment().add(5, 'days').format('ddd, MMMM D'));


    // var city = "Huntington Beach";
    // var lat = 33.72001;
    // var lon = -118.063674;

    // var key = "4d91161064427407dc01f01bcf0ba86c";

    // $.ajax({
    //     url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly&appid=${key}`,
    //     method: "GET"
    // }).then(function(response) {
    //     response.location = city;
    //     weatherStorage.push(response);
    //     localStorage.setItem("cities", JSON.stringify(weatherStorage));
    // })

    weatherStorage = JSON.parse(localStorage.getItem("cities"));
    if (weatherStorage != null) {
        weatherStorage.forEach(function(item, index) {
            var element = `<li class="list-group-item" data-index="${index}">${item.location}</li>`;
            $("#side-city").append(element);
        })

        // $("#main-city").text(weatherStorage[0].location);


        $(document).on("click", "li" , function() {
            console.log("It'll work!");
            var i = $(this).attr("data-index");
            $("#main-city").text(weatherStorage[i].location);

            var fig0 = weatherStorage[i].daily[0].weather[0].icon;
            $("#fig0").attr("src", `http://openweathermap.org/img/w/${fig0}.png`)

            $("#temp").text(weatherStorage[i].daily[0].temp.max);
            $("#humid").text(weatherStorage[i].daily[0].humidity);
            $("#wind").text(weatherStorage[i].daily[0].wind_speed);

            var uvi = weatherStorage[i].daily[0].uvi
            $("#uv").text(uvi);
            if (uvi >= 0 && uvi < 3) {
                $("#uv").attr("class", "badge badge-success");
            } else if (uvi >=3 && uvi < 6) {
                $("#uv").attr("class", "badge badge-warning");
            } else {
                $("#uv").attr("class", "badge badge-danger");
            }
        })
    }

})