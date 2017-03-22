'use strict';

(function(){
	var token = 'pk.eyJ1IjoibW9oc2VlbiIsImEiOiJjaXpheXczZnMwZmp3MzNwOWlxdjJudWh5In0.LZVo06uZ2_1Jk-Q3m0wfjQ';

	var map = L.map('map').setView([37.8, -96], 4);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + token, {
    	id: 'mapbox.dark'
	}).addTo(map);

	//decreasing order
	var equalColors = ['#91003f', '#ce1256', '#e7298a', '#df65b0', '#c994c7', '#d4b9da', '#f1eef6'],
		quantileColors = ['#084594', '#2171b5', '#4292c6', '#6baed6', '#9ecae1', '#c6dbef', '#eff3ff'];

	var brew = new classyBrew(),
		// currentDataset = [1.0, 4.9, 3.9, 3.9, 5.1, 5.3, 2.1, 3.5, 2.6, 1.5, 4.1, 2.9, 2.8, 4.3, 3.6];
		// currentDataset = [1.0, 4.5, 2.9, 3.0, 3.6, 4.7, 1.8, 4.2, 3.3, 2.3, 4.2, 2.9, 2.3, 4.3, 3.6];
		// currentDataset = [0.8, 4.4, 3.1, 3.2, 5.0, 5.0, 1.5, 4.9, 3.0, 2.3, 4.0, 2.2, 1.7, 4.9, 3.9];
		// currentDataset = [1.1, 3.2, 2.8, 2.5, 4.1, 4.1, 0.6, 4.5, 2.0, 1.9, 3.8, 1.6, 2.0, 3.7, 4.7];
		// currentDataset = [1.0, 2.9, 2.6, 3.0, 3.5, 4.9, 0.8, 4.6, 1.9, 2.3, 3.7, 2.3, 2.0, 3.2, 3.6];
		currentDataset = [0.9, 3.6, 2.6, 2.2, 4.2, 4.5, 1.6, 4.0, 2.8, 2.0, 3.4, 2.2, 2.9, 3.4, 3.9];
	
	/**
	 * setting up classyBrew
	 */
	brew.setSeries(currentDataset);
	brew.setNumClasses(6);
	brew.setColorCode('GnBu');

	//classifying
	brew.classify('jenks');

	var breaks = brew.getBreaks(),
		colors = brew.getColors();
	
	function getEqualColor(data){
		return data > 3.98 ? equalColors[0] :
				data > 3.472 ? equalColors[1] :
				data > 2.958 ? equalColors[2] :
				data > 2.444 ? equalColors[3] :
				data > 1.930 ? equalColors[4] :
				data > 1.416 ? equalColors[5] :
				equalColors[6];
	}

	function getQuantileColor(data){
		return data > 3.95 ? quantileColors[0] :
				data > 3.5 ? quantileColors[1] :
				data > 3.3 ? quantileColors[2] :
				data > 2.7 ? quantileColors[3] :
				data > 2.19 ? quantileColors[4] :
				data > 1.9 ? quantileColors[5] :
				equalColors[6]; 
	}

	

	function addLegend(map){
		var legend = L.control({position: 'bottomright'});
		legend.onAdd = function(map){
			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0.9, 1.416, 1.93, 2.44, 2.958, 3.472, 3.98];

			div.innerHTML += '<div id="wrapper"><h4 id="legend-title">Marriage Dissolution Rate (%)</h4><br />';

			var additiveVariable = 0.2;
			for(var i = 0; i < grades.length; i++){
				div.innerHTML += '<i style="background:' + brew.getColorInRange(grades[i] + additiveVariable) + '"></i>' +
					grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+' );
			}

			div.innerHTML += '</div>'
			return div;
		}

		legend.addTo(map);
	}

	function addQuantileLegend(map){
		var legend = L.control({position: 'bottomright'});
		legend.onAdd = function(map){
			var div = L.DomUtil.create('div', 'info legend'),
				grades = [0.9, 1.9, 2.2, 2.7, 3.3, 3.5, 3.95];

			div.innerHTML += '<div id="wrapper"><h4 id="legend-title">Marriage Dissolution Rate (%)</h4><br />';

			for(var i = 0; i < grades.length; i++){
				div.innerHTML += '<i style="background:' + getQuantileColor(grades[i] + 0.05) + '"></i>' +
					grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+' );
			}

			div.innerHTML += '</div>'
			return div;
		}

		legend.addTo(map);
	}

	function addCurrentLegend(map){

		//resetting the colors
		// colors.pop();

		var problematicGrey = '#efeff0';
		colors.unshift(problematicGrey);

		var legend = L.control({position: 'bottomright'});
		legend.onAdd = function(map){
			var div = L.DomUtil.create('div', 'info legend'),
				grades = brew.getBreaks();

			console.log(colors);
			div.innerHTML += '<div id="wrapper"><h4 id="legend-title">Marriage Dissolution Rate (%)</h4><br />';

			for(var i = 0; i < grades.length; i++){
				div.innerHTML += '<i style="background:' + colors[i] + '"></i>' +
					grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+' );
			}

			div.innerHTML += '</div>'
			return div;
		}

		legend.addTo(map);
	};

	function style(feature){
		return{
			// fillColor: getQuantileColor(feature.properties.dmr),
			fillColor: brew.getColorInRange(feature.properties.dmr),
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7
		}
	}

	$.getJSON('features.geojson', function(json){
		// console.log(json);
		L.geoJson(json, {
			style: style,
			onEachFeature: function(feature, layer){
				// console.log(layer.getBounds());
				var label = L.marker(layer.getBounds().getCenter(), {
					icon: L.divIcon({
						className: 'label',
						html: feature.properties.name,
						iconSize: [80, 40]
					})
				}).addTo(map);
			}
		}).addTo(map);
	});
	//handle the least value case plus the legend
	addCurrentLegend(map);
})();