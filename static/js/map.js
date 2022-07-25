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

    // MIN y MAX
    colors_circles = ["#FFD324", "#E89C23", "#FF7600", "#FF422F", "#FF0000"];
    let label_legend = "";
    let min_value, max_value;
    if (
      data[72].hasOwnProperty("Nro. salidas") == true &&
      data[72].hasOwnProperty("Nro. llegadas") == true
    ) {
      // CASO 1
      let lista = d3.values(data).map(function (d) {
        return (Object.values(d)[3] + Object.values(d)[4]) / 2;
      });
      label_legend = "Todos los viajes";
      min_value = d3.min(lista);
      max_value = d3.max(lista);
    } else if (
      data[72].hasOwnProperty("Nro. salidas") == true &&
      data[72].hasOwnProperty("Nro. llegadas") == false
    ) {
      // CASO 2
      let lista = d3.values(data).map(function (d) {
        return Object.values(d)[3];
      });
      label_legend = "Sólo viajes de salida";
      min_value = d3.min(lista);
      max_value = d3.max(lista);
    } else if (
      data[72].hasOwnProperty("Nro. salidas") == false &&
      data[72].hasOwnProperty("Nro. llegadas") == true
    ) {
      // CASO 3
      let lista = d3.values(data).map(function (d) {
        return Object.values(d)[3];
      });
      label_legend = "Sólo viajes de llegada";
      min_value = d3.min(lista);
      max_value = d3.max(lista);
    }

    // LEYENDA
    let sumador = (max_value - min_value) / 5;
    let minimo, maximo;
    let leyenda = d3.select("#legend");
    leyenda
      .append("p")
      .text(label_legend)
      .style("margin-left", 0)
      .style("margin-top", 0)
      .style("margin-bottom", "4px")
      .style("font-weight", "bold")
      .style("font-size", "12px");
    for (let i = 0; i < colors_circles.length; i++) {
      let containerLegend = leyenda.append("div").style("display", "flex");
      containerLegend
        .append("svg")
        .attr("width", 31)
        .attr("height", 14)
        .append("rect")
        .attr("width", 30)
        .attr("height", 10)
        .style("fill", colors_circles[i]);
      if (i + 1 <= 4) {
        minimo = Math.round(min_value + sumador * i);
        maximo = Math.round(min_value + sumador * (i + 1));
        containerLegend
          .append("p")
          .text(minimo + " a " + maximo)
          .style("margin-top", 0)
          .style("margin-left", "2px")
          .style("margin-bottom", 0)
          .style("font-size", "12px");
      } else {
        minimo = Math.round(min_value + sumador * i);
        containerLegend
          .append("p")
          .text("> " + minimo)
          .style("margin-top", 0)
          .style("margin-left", "2px")
          .style("margin-bottom", 0)
          .style("font-size", "12px");
      }
    }

    // TOOLTIP
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

          if (peso >= min_value && peso < min_value + sumador) {
            color = colors_circles[0];
          } else if (
            peso >= min_value + sumador &&
            peso < min_value + sumador * 2
          ) {
            color = colors_circles[1];
          } else if (
            peso >= min_value + sumador * 2 &&
            peso < min_value + sumador * 3
          ) {
            color = colors_circles[2];
          } else if (
            peso >= min_value + sumador * 3 &&
            peso < min_value + sumador * 4
          ) {
            color = colors_circles[3];
          } else if (peso >= min_value + sumador * 4) {
            color = colors_circles[4];
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
