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

      // Agregando parte de Victor

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
            " viajes"
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

// Sankey

var units = "viajes";

var margin = { top: 10, right: 10, bottom: 10, left: 10 },
  width = 570 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

var formatNumber = d3.format(",.0f"), // zero decimal places
  format = function (d) {
    return formatNumber(d) + " " + units;
  },
  color = d3.scale.category20();

// append the svg canvas to the page
var svg = d3
  .select("#sankey-container")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set the sankey diagram properties
var sankey = d3.sankey().nodeWidth(25).nodePadding(3).size([width, height]);

var path = sankey.link();

// load the data
d3.json("/get-trips", function (error, graph) {
  sankey.nodes(graph.nodes).links(graph.links).layout(32);

  // add in the links
  var link = svg
    .append("g")
    .selectAll(".link")
    .data(graph.links)
    .enter()
    .append("path")
    .attr("class", "link")
    .attr("d", path)
    .style("stroke-width", function (d) {
      return Math.max(1, d.dy);
    })
    .sort(function (a, b) {
      return b.dy - a.dy;
    });

  // add the link titles
  link.append("title").text(function (d) {
    return (
      d.source.name.slice(0, -1) +
      " → " +
      d.target.name.slice(0, -1) +
      "\n" +
      format(d.value)
    );
  });

  // add in the nodes
  var node = svg
    .append("g")
    .selectAll(".node")
    .data(graph.nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ")";
    })
    .call(
      d3.behavior
        .drag()
        .origin(function (d) {
          return d;
        })
        .on("dragstart", function () {
          this.parentNode.appendChild(this);
        })
        .on("drag", dragmove)
    );

  // add the rectangles for the nodes
  node
    .append("rect")
    .attr("height", function (d) {
      return d.dy;
    })
    .attr("width", sankey.nodeWidth())
    .style("fill", function (d) {
      return (d.color = color(d.name.slice(0, -1).replace(/ .*/, "")));
    })
    .style("stroke", function (d) {
      return d3.rgb(d.color).darker(2);
    })
    .append("title")
    .text(function (d) {
      return d.name.slice(0, -1) + "\n" + format(d.value);
    });

  // add in the title for the nodes
  node
    .append("text")
    .attr("x", -6)
    .attr("y", function (d) {
      return d.dy / 2;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .text(function (d) {
      return d.name.slice(0, -1);
    })
    .filter(function (d) {
      return d.x < width / 2;
    })
    .attr("x", 6 + sankey.nodeWidth())
    .attr("text-anchor", "start");

  // the function for moving the nodes
  function dragmove(d) {
    d3.select(this).attr(
      "transform",
      "translate(" +
        d.x +
        "," +
        (d.y = Math.max(0, Math.min(height - d.dy, d3.event.y))) +
        ")"
    );
    sankey.relayout();
    link.attr("d", path);
  }
});
