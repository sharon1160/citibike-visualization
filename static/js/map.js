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
          return (
            "<strong>Información</strong> <br><br>" +
            "<strong>Nombre:</strong> " +
            d.value[2] +
            "<br><strong>Nro. salidas:</strong> " +
            d.value[3] +
            " viajes" +
            "<br><strong>Nro. llegadas:</strong> " +
            d.value[4] +
            " viajes" +
            "<br><strong>Porcentaje de salidas:</strong> " +
            d.value[5] +
            "<br><strong>Porcentaje de llegadas:</strong> " +
            d.value[6]
          );
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
        .attr("cy", padding);

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
        d = new google.maps.LatLng(d.value[1], d.value[0]);
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
