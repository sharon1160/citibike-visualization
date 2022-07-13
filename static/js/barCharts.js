/* bar chars*/
function renderBarChartFromJson(
    svgId,
    jsonPath = "{{ url_for('static', filename='/data/NumberOfTripsByMonth.json') }}",
    config = { columnWidth: 20, columnHeight: 235, columnGap: 5, padding: 100},
    labels = { xLabelTitle: "Horas del dia", yLabelTitle: "Cantidad de viajes", title: "Numero de viajes por hora"},
    tooltipData = {timeInfo: "<strong> Hora: " , numberInfo: "</strong><br> <strong> Numero de viajes: "}
    ) {
    d3.json(jsonPath, function(error, json) {
        if (error) {
            return console.warn(error);
        }
        renderBarPlot(json, svgId, config, labels, tooltipData);
    });
}

function renderBarPlot(
    datos,
    svgId,
    config,
    labels,
    tooltipData
    ){
    var NUM_COLUMNAS = datos.length;
            config.width = NUM_COLUMNAS * (config.columnWidth + config.columnGap) + (2 * config.padding);
            config.height = config.columnHeight + 2 * config.padding;

    var TRIPS_AMOUNT = d3.max(datos, function(d) { return d.number_of_trips; });

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, config.width - 2 * config.padding])
        .domain(datos.map(function(d) { return d.time; }));

    var y = d3.scale.linear()
        .range([0, config.columnHeight])
        .domain([0, TRIPS_AMOUNT]);

    var rangeY = d3.scale.linear()
        .range([config.columnHeight, 0])
        .domain([0, TRIPS_AMOUNT]);

    var ejeX = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var ejeY = d3.svg.axis()
        .scale(rangeY)
        .orient("left");

    var tooltip = d3.tip()
        .attr('class', 'tooltip')
        .offset([-10, 0])
        .html(function(d) {
            return tooltipData.timeInfo + d.time + tooltipData.numberInfo + d.number_of_trips + "</strong>";
        });

    var svg = d3.select(svgId)
        .attr("width", config.width)
        .attr("height", config.height);

    svg.call(tooltip);

    svg.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(" + config.padding + "," + (10 + config.padding + config.columnHeight) + ")")
        .call(ejeX)
    .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", "10")
        .attr("y", "-3")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(" + (config.padding - 10) + "," + config.padding + ")")
        .call(ejeY);

    svg.append("text")
    .attr("class", "axis")
    .attr("text-anchor", "middle")
    .attr("x", config.width/2)
    .attr("y", 32)
    .text(labels.title);

    svg.append("text")
        .attr("class", "axis")
        .attr("text-anchor", "middle")
        .attr("x", config.width/2)
        .attr("y", config.height - 10)
        .text(labels.xLabelTitle);

    svg.append("text")
        .attr("class", "axis")
        .attr("text-anchor", "middle")
        .attr("x", -config.height/2)
        .attr("y", 24)
        .attr("transform", "rotate(-90)")
        .text(labels.yLabelTitle);

    svg.selectAll("rect")
        .data(datos)
        .enter().append("rect")
        .attr("width", config.columnWidth)
        .attr("x", function(d,i) { return config.padding + x(d.time) })
        .attr("y", function(d,i) { return config.padding + config.columnHeight - y(d.number_of_trips) })
        .attr("height", function(d,i) { return y(d.number_of_trips) })
        .attr("data-time", function(d,i) { return d.time })
        .attr("data-number_of_trips", function(d,i) { return  (+d.number_of_trips) })
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide)
}

function renderBarChartFromJsonByDuration(
    svgId,
    jsonPath = "{{ url_for('static', filename='/data/NumberOfTripsByDuration.json') }}",
    config = { columnWidth: 8, columnHeight: 235, columnGap: 1, padding: 100},
    labels = { xLabelTitle: "Duracion del viaje en segundos", yLabelTitle: "Cantidad de viajes", title: "Numero de viajes por duracion"},
    tooltipData = {timeInfo: "<strong> Duracion: " , numberInfo: "</strong><br> <strong> Numero de viajes: "}
    ) {
    d3.json(jsonPath, function(error, json) {
        if (error) {
            return console.warn(error);
        }
        renderBarPlotByDuration(json, svgId, config, labels, tooltipData);
    });
}

function renderBarPlotByDuration(
    datos,
    svgId,
    config,
    labels,
    tooltipData
    ){
    var NUM_COLUMNAS = datos.length;
            config.width = NUM_COLUMNAS * (config.columnWidth + config.columnGap) + (2 * config.padding);
            config.height = config.columnHeight + 2 * config.padding;

    var TRIPS_AMOUNT = d3.max(datos, function(d) { return d.number_of_trips; });

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, config.width - 2 * config.padding])
        .domain(datos.map(function(d) { return d.duration; }));

    var y = d3.scale.linear()
        .range([0, config.columnHeight])
        .domain([0, TRIPS_AMOUNT]);

    var rangeY = d3.scale.linear()
        .range([config.columnHeight, 0])
        .domain([0, TRIPS_AMOUNT]);

    var ejeX = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var ejeY = d3.svg.axis()
        .scale(rangeY)
        .orient("left");

    var tooltip = d3.tip()
        .attr('class', 'tooltip')
        .offset([-10, 0])
        .html(function(d) {
            return tooltipData.timeInfo + d.duration + tooltipData.numberInfo + d.number_of_trips + "</strong>";
        });

    var svg = d3.select(svgId)
        .attr("width", config.width)
        .attr("height", config.height);

    svg.call(tooltip);

    svg.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(" + config.padding + "," + (10 + config.padding + config.columnHeight) + ")")
        .call(ejeX)

    .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", "10")
        .attr("y", "-3")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(" + (config.padding - 10) + "," + config.padding + ")")
        .call(ejeY);

    svg.append("text")
    .attr("class", "axis")
    .attr("text-anchor", "middle")
    .attr("x", config.width/2)
    .attr("y", 32)
    .text(labels.title);

    svg.append("text")
        .attr("class", "axis")
        .attr("text-anchor", "middle")
        .attr("x", config.width/2)
        .attr("y", config.height - 10)
        .text(labels.xLabelTitle);

    svg.append("text")
        .attr("class", "axis")
        .attr("text-anchor", "middle")
        .attr("x", -config.height/2)
        .attr("y", 24)
        .attr("transform", "rotate(-90)")
        .text(labels.yLabelTitle);

    svg.selectAll("rect")
        .data(datos)
        .enter().append("rect")
        .attr("width", config.columnWidth)
        .attr("x", function(d,i) { return config.padding + x(d.duration) })
        .attr("y", function(d,i) { return config.padding + config.columnHeight - y(d.number_of_trips) })
        .attr("height", function(d,i) { return y(d.number_of_trips) })
        .attr("data-time", function(d,i) { return d.duration })
        .attr("data-number_of_trips", function(d,i) { return  (+d.number_of_trips) })
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide)
}

function renderBarChartFromJsonByStation(
    svgId,
    jsonPath = "{{ url_for('static', filename='/data/NumberOfTripsByStation.json') }}",
    config = { columnWidth: 8, columnHeight: 235, columnGap: 1, padding: 100},
    labels = { xLabelTitle: "ID de estacion", yLabelTitle: "Cantidad de viajes", title: "Numero de viajes por estación"}
    ) {
    d3.json(jsonPath, function(error, json) {
        if (error) {
            return console.warn(error);
        }
        renderBarPlotByStation(json, svgId, config, labels);
    });
}

function renderBarPlotByStation(
    datos,
    svgId,
    config,
    labels
    ){
    var NUM_COLUMNAS = datos.length;
            config.width = NUM_COLUMNAS * (config.columnWidth + config.columnGap) + (2 * config.padding);
            config.height = config.columnHeight + 2 * config.padding;

    var TRIPS_AMOUNT = d3.max(datos, function(d) { return d.number_of_arrival_trips + d.number_of_departure_trips; });

    var x = d3.scale.ordinal()
        .rangeRoundBands([0, config.width - 2 * config.padding])
        .domain(datos.map(function(d) { return d.station_id; }));

    var y = d3.scale.linear()
        .range([0, config.columnHeight])
        .domain([0, TRIPS_AMOUNT]);

    var rangeY = d3.scale.linear()
        .range([config.columnHeight, 0])
        .domain([0, TRIPS_AMOUNT]);

    var ejeX = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var ejeY = d3.svg.axis()
        .scale(rangeY)
        .orient("left");

    var tooltip = d3.tip()
        .attr('class', 'tooltip')
        .offset([-10, 0])
        .html(function(d) {
            return "<strong> ID: " + d.station_id + "</strong> <br>" +
            "<strong> Nombre: " + d.station_name + "</strong> <br>" +
            "<strong> numero de viajes de salida: " + d.number_of_departure_trips + "</strong> <br>" +
            "<strong> numero de viajes de llegada: " + d.number_of_arrival_trips + "</strong>";
        });

    var svg = d3.select(svgId)
        .attr("width", config.width)
        .attr("height", config.height);

    svg.call(tooltip);

    svg.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(" + config.padding + "," + (10 + config.padding + config.columnHeight) + ")")
        .call(ejeX)

    .selectAll("text")
        .attr("transform", "rotate(90)")
        .attr("x", "10")
        .attr("y", "-3")
        .style("text-anchor", "start");

    svg.append("g")
        .attr("class", "eje")
        .attr("transform", "translate(" + (config.padding - 10) + "," + config.padding + ")")
        .call(ejeY);

    svg.append("text")
    .attr("class", "axis")
    .attr("text-anchor", "middle")
    .attr("x", config.width/2)
    .attr("y", 32)
    .text(labels.title);

    svg.append("text")
        .attr("class", "axis")
        .attr("text-anchor", "middle")
        .attr("x", config.width/2)
        .attr("y", config.height - 10)
        .text(labels.xLabelTitle);

    svg.append("text")
        .attr("class", "axis")
        .attr("text-anchor", "middle")
        .attr("x", -config.height/2)
        .attr("y", 24)
        .attr("transform", "rotate(-90)")
        .text(labels.yLabelTitle);

    svg.selectAll("rect")
        .data(datos)
        .enter().append("rect")
        .attr("width", config.columnWidth)
        .attr("x", function(d,i) { return config.padding + x(d.station_id) })
        .attr("y", function(d,i) { return config.padding + config.columnHeight - y(d.number_of_arrival_trips + d.number_of_departure_trips) })
        .attr("height", function(d,i) { return y(d.number_of_arrival_trips + d.number_of_departure_trips) })
        .attr("data-time", function(d,i) { return d.station_id })
        .attr("data-number_of_trips", function(d,i) { return  (d.number_of_arrival_trips + d.number_of_departure_trips) })
        .on('mouseover', tooltip.show)
        .on('mouseout', tooltip.hide)
}