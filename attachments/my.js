

(function($) {
  	$( "#highland" ).live( "pageinit", function(event){
  		var db = document.URL.split("/")[3] 
  		var now = Math.round((new Date()).getTime() / 1000)
  		var aWeekAgo =  now - 604800
	  	$.getJSON("/" + db + '/_all_docs?startkey="highland-' + aWeekAgo + '000"&endkey="highland-' + now + '000"&include_docs=true', function(data) {
	  		console.log(data)
	  		var chartDataCost = []
	  		var chartDataHours = []
	  		$.sensorData = {}
	  		
	  		// Break out the reading objects into {sensor1:[[time,reading],...], sensor2:...}
	  		$.each(data.rows, function(i, row) {
	  			var time = row.id 
	  			$.each(row.doc, function(sensor, reading) {
	  				if (reading > 0) {
	  					if ($.sensorData[sensor] instanceof Array) {
	  						// do nothing
						} else {
							$.sensorData[sensor] = []
						}
	  					$.sensorData[sensor].push([1000*parseInt(time.substr(9, 400)), reading])
	  				}	  				
	  			})	
	  		})
	  		highChartSeries = []

	  		$.each($.sensorData, function(sensor, sensorData) {
	  			highChartSeries.push({
	              name : sensor,
	              data : sensorData,
	              tooltip: {
	            	valueDecimals: 2
	              }
	  			})
	  		})

	  		window.chartWeekly = new Highcharts.StockChart({
				chart : {
					renderTo : 'chartWeekly'
				},

				rangeSelector : {
					selected : 1
				},

				title : {
					text : ''
				},

				xAxis: {
					alternateGridColor: '#FDFFD5'
				},

				yAxis: [{
	                title: {
	                    text: ''
	                },
	                //height: 200,
	                lineWidth: 2
	            }, {
	                title: {
	                    text: ''
	                },
	                //top: 300,
	                opposite: true,
	                //height: 100,
	                //offset: 0,
	                lineWidth: 2
	            }],

		        plotOptions: {
		            series: {
		                marker: {
		                    enabled: true    
		                }
		            }
		        },

				series : highChartSeries
			}) // end of highcharts object
	  				
	  	}) // end of getJSON
	}) // end of pageinit for #highland

	
})(jQuery);
