// Declare empty weatherStorage array to be pushed to local storage later
var weatherStorage = [];

function initialize() {
    $("#searchbutton").on("click", function (event) {
        event.preventDefault();

        // Show spinner while ajax functions are loading
        $("#spinner").attr("style", "display: block; margin-top: 50px")

        // Run the Google geocode API with the user input
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            address: $("#searchcity").val()
        }, function (results, status) {
            if (status == "OK") {

                // Filter through types of searches, only include cities and zip codes
                if (results[0].types[0] == "locality" || results[0].types[0] == "postal_code") {

                    // Grab data for formatted address, latitude and longitude
                    var city = results[0].formatted_address;
                    var lat = results[0].geometry.location.lat();
                    var lon = results[0].geometry.location.lng();

                    // Run the openweather API
                    var key = "4d91161064427407dc01f01bcf0ba86c";
                    $.ajax({
                        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude=current,minutely,hourly&appid=${key}`,
                        method: "GET"
                    }).then(function (response) {

                        // Create an item in the response object and input the formatted address/city name
                        response.location = city;

                        // Run the pixabay API but using only the city name
                        var object = city.split(",")
                        var keysearch = encodeURIComponent(object[0]);
                        var picurl;
                        $.ajax({
                            url: `https://pixabay.com/api/?key=17887351-08320e40c932717794f89c4c9&q=${keysearch}&image_type=photo`,
                            method: "GET"
                        }).then(function (res) {
                            if (res.total > 0) {
                                picurl = res.hits[1].largeImageURL;

                                // Create an item in the response object and input the url for the image
                                response.picture = picurl;
                            } else {

                                // Input a stock photo if there are no pixabay image results
                                picurl = "https://cdn.pixabay.com/photo/2019/02/18/19/47/belgium-4005254_960_720.jpg";
                                response.picture = picurl;
                            }

                            // Push the response object to the weatherStorage array, then push to local storage
                            weatherStorage.push(response);
                            localStorage.setItem("cities", JSON.stringify(weatherStorage));
                            window.location.reload(false);
                        })
                    })
                } else {

                    // Alert if Google geocode API is giving results other than a city or zipcode
                    alert("Please enter a city.");
                    window.location.reload(false);
                }
            } else {

                // Alert if geocode API is givign invalid results
                alert("Geocode didn't work: " + status);
                window.location.reload(false);
            }
        })
    })
}

// Pull from local storage
weatherStorage = JSON.parse(localStorage.getItem("cities"));

// Only continue display if weather storage has data
if (weatherStorage != null) {
    if (weatherStorage.length != 0) {

        // Call up the display
        $("#display").attr("style", "margin-top: 20px; display: block;")

        // Display the dates
        $("#day0").text(moment().format('ddd, MMMM D, YYYY'));
        $("#day1").text(moment().add(1, 'days').format('ddd, MMMM D'));
        $("#day2").text(moment().add(2, 'days').format('ddd, MMMM D'));
        $("#day3").text(moment().add(3, 'days').format('ddd, MMMM D'));
        $("#day4").text(moment().add(4, 'days').format('ddd, MMMM D'));
        $("#day5").text(moment().add(5, 'days').format('ddd, MMMM D'));

        // Append the name for the results to the sidebar
        weatherStorage.forEach(function (item, index) {
            var element = `<li class="list-group-item" data-index="${index}">${item.location}<a class="badge float-right exit" data-index="${index}">x</a></li>`;
            $("#side-city").append(element);
        })

        // Run the display function with the last data from the last item in the weatherStorege array
        display(weatherStorage.length - 1);

        // Run the display function with the data referenced to what the user clicks on
        $(document).on("click", "li", function () {
            var index = $(this).attr("data-index");
            display(index);
        })

        // Add delete click option for the items in the sidebar referenced to the weather storage array
        $(document).on("click", ".exit", function () {
            var index = $(this).attr("data-index");
            weatherStorage.splice(index, 1);
            localStorage.setItem("cities", JSON.stringify(weatherStorage));
            window.location.reload(false);
        })
    }
} else {

    // Requires an empty instead of null
    weatherStorage = [];
}

function display(i) {

    // Display the picture using the url saved in the objects in weatherStorage
    $("#main-card").attr("style", `height: 100%; width: 100%; background-image: url(${weatherStorage[i].picture});`)

    // Display the name
    $("#main-city").text(weatherStorage[i].location);

    // Dsiplay the icon using the openweather url
    var fig0 = weatherStorage[i].daily[0].weather[0].icon;
    $("#fig0").attr("src", `http://openweathermap.org/img/w/${fig0}.png`)

    // Display the temperature, humidity, and wind speed
    $("#temp").text(weatherStorage[i].daily[0].temp.max);
    $("#humid").text(weatherStorage[i].daily[0].humidity);
    $("#wind").text(weatherStorage[i].daily[0].wind_speed);

    // Display the UVI depending on the color
    var uvi = weatherStorage[i].daily[0].uvi
    $("#uv").text(uvi);
    if (uvi >= 0 && uvi < 3) {
        $("#uv").attr("class", "badge badge-success");
    } else if (uvi >= 3 && uvi < 6) {
        $("#uv").attr("class", "badge badge-warning");
    } else {
        $("#uv").attr("class", "badge badge-danger");
    }


    // Display the next five days for icon, temperature, humidity
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