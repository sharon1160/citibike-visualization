// Create the Google Map…
var map = new google.maps.Map(d3.select("#map-container").node(), {
  zoom: 13,
  center: new google.maps.LatLng(40.71576713378537, -73.9948450947766),
  mapTypeId: google.maps.MapTypeId.TERRAIN,
});

// Load the station data. When the data comes back, create an overlay.
d3.json("/get-data", function (error, data) {
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
        padding = 10;

      let marker = layer
        .selectAll("svg")
        .data(d3.entries(data))
        .each(transform) // update existing markers
        .enter()
        .append("svg")
        .each(transform)
        .attr("class", "marker")
        .on("mouseout", ocultar)
        .on("mouseover", mostrar);

      // Add a circle.
      marker
        .append("circle")
        .attr("r", 8)
        .attr("cx", padding)
        .attr("cy", padding);

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

// TOOLTIPS MAP

function mostrar(d) {
  let divTolltip = d3.select("#marker-tooltip");

  console.log(d);

  // Name
  divTolltip
    .append("p")
    .attr("class", "informacion")
    .attr("id", "name")
    .text("Nombre: " + d.value[2]);

  // Latitud
  divTolltip
    .append("p")
    .attr("class", "informacion")
    .attr("id", "latitud")
    .text("Latitud: " + d.value[1]);

  // Longitud
  divTolltip
    .append("p")
    .attr("class", "informacion")
    .attr("id", "longitud")
    .text("Longitud: " + d.value[0]);

  // Salidas
  divTolltip
    .append("p")
    .attr("class", "informacion")
    .attr("id", "salidas")
    .text("# Partidas: " + d.value[3]);

  // Llegadas
  divTolltip
    .append("p")
    .attr("class", "informacion")
    .attr("id", "llegadas")
    .text("# Llegadas: " + d.value[4]);

  // style
  divTolltip.selectAll(".informacion").style("margin", "0.2rem");

  // visible
  divTolltip.transition().duration(100).style("visibility", "visible");

  // cambiando color
  d3.select(this)
    .select("circle")
    .transition()
    .duration(100)
    .attr("r", 11)
    .style("fill", "yellow");
}

function ocultar() {
  let divTolltip = d3.select("#marker-tooltip");

  divTolltip.selectAll(".informacion").remove();

  // hidden
  divTolltip.transition().duration(100).style("visibility", "hidden");

  d3.select(this)
    .select("circle")
    .transition()
    .duration(100)
    .attr("r", 8)
    .style("fill", "rgb(231, 59, 43)");
}
