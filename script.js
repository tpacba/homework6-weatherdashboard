var weatherStorage = [];

function initialize() {
    $("#searchbutton").on("click", function(event) {
        event.preventDefault();

        var address = $("#searchcity").val();
        
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: address
        }, function(results, status) {
            if (status == "OK") {
                var city = results[0].formatted_address;
                var lat = results[0].geometry.location.lat();
                var lon = results[0].geometry.location.lng();

                var key = "4d91161064427407dc01f01bcf0ba86c";
                $.ajax({
                    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly&appid=${key}`,
                    method: "GET"
                }).then(function(response) {
                    response.location = city;
                    weatherStorage.push(response);
                    localStorage.setItem("cities", JSON.stringify(weatherStorage));
                    window.location.reload(false);
                })
            } else {
                alert("Geocode didn't work: " + status);
            }
        })
    })
}

    weatherStorage = JSON.parse(localStorage.getItem("cities"));
    if (weatherStorage != null) {

        $("#day0").text(moment().format('LL'));
        $("#day1").text(moment().add(1, 'days').format('ddd, MMMM D'));
        $("#day2").text(moment().add(2, 'days').format('ddd, MMMM D'));
        $("#day3").text(moment().add(3, 'days').format('ddd, MMMM D'));
        $("#day4").text(moment().add(4, 'days').format('ddd, MMMM D'));
        $("#day5").text(moment().add(5, 'days').format('ddd, MMMM D'));

        weatherStorage.forEach(function(item, index) {
            var element = `<li class="list-group-item" data-index="${index}">${item.location}</li>`;
            $("#side-city").append(element);
        })

        display(weatherStorage.length - 1);

        $(document).on("click", "li" , function() {
            var index = $(this).attr("data-index");
            display(index);
        })

        function display(i) {
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

            var fig1 = weatherStorage[i].daily[1].weather[0].icon;
            $("#fig1").attr("src", `http://openweathermap.org/img/w/${fig1}.png`)
            $("#temp1").text(weatherStorage[i].daily[1].temp.max);
            $("#humid1").text(weatherStorage[i].daily[1].humidity);

            var fig2 = weatherStorage[i].daily[2].weather[0].icon;
            $("#fig2").attr("src", `http://openweathermap.org/img/w/${fig2}.png`)
            $("#temp2").text(weatherStorage[i].daily[2].temp.max);
            $("#humid2").text(weatherStorage[i].daily[2].humidity);
            
            var fig3 = weatherStorage[i].daily[3].weather[0].icon;
            $("#fig3").attr("src", `http://openweathermap.org/img/w/${fig3}.png`)
            $("#temp3").text(weatherStorage[i].daily[3].temp.max);
            $("#humid3").text(weatherStorage[i].daily[3].humidity);

            var fig4 = weatherStorage[i].daily[4].weather[0].icon;
            $("#fig4").attr("src", `http://openweathermap.org/img/w/${fig4}.png`)
            $("#temp4").text(weatherStorage[i].daily[4].temp.max);
            $("#humid4").text(weatherStorage[i].daily[4].humidity);

            var fig5 = weatherStorage[i].daily[5].weather[0].icon;
            $("#fig5").attr("src", `http://openweathermap.org/img/w/${fig5}.png`)
            $("#temp5").text(weatherStorage[i].daily[5].temp.max);
            $("#humid5").text(weatherStorage[i].daily[5].humidity);
        }
    } else {
        weatherStorage = [];
    }