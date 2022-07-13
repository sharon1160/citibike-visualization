// Create the Google Map…
var map = new google.maps.Map(d3.select("#map-container").node(), {
  zoom: 13,
  clickableIcons: false,
  center: new google.maps.LatLng(40.71576713378537, -73.9948450947766),
});

// Load the station data. When the data comes back, create an overlay.
d3.json("/get-stations", function (error, data) {
  if (error) throw error;
  var overlay = new google.maps.OverlayView();

  // Add the container when the overlay is added to the map.
  overlay.onAdd = function () {
    let layer = d3
      .select(this.getPanes().overlayMouseTarget)
      .append("div")
      .attr("class", "stations");

    // Draw each marker as a separate SVG element.
    // We could use a single SVG, but what size would it have?
    overlay.draw = function () {
      let projection = this.getProjection(),
        padding = 11;

      let tooltip = d3
        .tip()
        .attr("class", "tooltip")
        .offset([-10, 0])
        .html(function (d) {
          result =
            "<strong>Información</strong> <br><br>" +
            "<strong>Nombre:</strong> " +
            d.value["Nombre"];
          if (d.value.hasOwnProperty("Nro. salidas") == true) {
            result +=
              "<br><strong>Nro. salidas:</strong> " +
              d.value["Nro. salidas"] +
              " viajes";
          }
          if (d.value.hasOwnProperty("Nro. llegadas") == true) {
            result +=
              "<br><strong>Nro. llegadas:</strong> " +
              d.value["Nro. llegadas"] +
              " viajes";
          }
          if (
            d.value.hasOwnProperty("Nro. llegadas") == true &&
            d.value.hasOwnProperty("Nro. salidas") == true
          ) {
            result +=
              "<br><strong>Porcentaje de salidas:</strong> " +
              d.value["Porcentaje de salidas"] +
              "<br><strong>Porcentaje de llegadas:</strong> " +
              d.value["Porcentaje de llegadas"];
          }
          return result;
        });

      let marker = layer
        .selectAll("svg")
        .data(d3.entries(data))
        .each(transform) // update existing markers
        .enter()
        .append("svg")
        .each(transform)
        .attr("class", "marker")
        .on("mouseover", tooltip.show)
        .on("mouseout", tooltip.hide);

      d3.select("svg").call(tooltip);

      let peso = 0;
      color = "red";
      console.log(peso);
      if (peso >= 117 && peso < 1788) {
        color = "blue";
      } else if (peso >= 1788 && peso < 3459) {
        color = "green";
      } else if (peso >= 3459) {
        color = "red";
      }

      // Add a circle.
      marker
        .append("circle")
        .attr("r", 9.5)
        .attr("cx", padding)
        .attr("cy", padding)
        .style("fill", function (d, i) {
          let peso = 0;
          if (
            d.value.hasOwnProperty("Nro. llegadas") == true &&
            d.value.hasOwnProperty("Nro. salidas") == true
          ) {
            peso = (d.value["Nro. salidas"] + d.value["Nro. llegadas"]) / 2;
          }
          if (d.value.hasOwnProperty("Nro. salidas") == true) {
            peso = d.value["Nro. salidas"];
          }
          if (d.value.hasOwnProperty("Nro. llegadas") == true) {
            peso = d.value["Nro. llegadas"];
          }

          console.log(peso);
          //min: 1228
          //max: 32284
          if (peso >= 0 && peso < 1228) {
            color = "#FFD724";
          } else if (peso >= 1228 && peso < 7930) {
            color = "#FFB124";
          } else if (peso >= 7930 && peso < 14632) {
            color = "#FF8D24";
          } else if (peso >= 14632 && peso < 21334) {
            color = "#FF6B30";
          } else if (peso >= 21334 && peso < 28036) {
            color = "#FF3624";
          } else if (peso >= 28036) {
            color = "#FF2700";
          }

          return color;
        });

      // Add label id
      marker
        .append("text")
        .text(function (d) {
          return d.key;
        })
        .attr("class", "id-station")
        .attr("x", "48%")
        .attr("y", "50%")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("font-size", 8.2);

      function transform(d) {
        d = new google.maps.LatLng(d.value["Latitude"], d.value["Longitude"]);
        d = projection.fromLatLngToDivPixel(d);
        return d3
          .select(this)
          .style("left", d.x - padding + "px")
          .style("top", d.y - padding + "px");
      }
    };
  };

  // Bind our overlay to the map…
  overlay.setMap(map);
});
