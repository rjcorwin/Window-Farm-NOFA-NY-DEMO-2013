

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

		$('form.lightsForm').submit(function(e) {
		  // Prevent submit because we will use ajaxSubmit() to actually send the
          // attachment to CouchDB.
          e.preventDefault();

          // Get the user supplied details
          $.couch.db("highland").openDoc("lights", {
            // If found, then set the revision in the form and save
            success: function(couchDoc) {
              // Defining a revision on saving over a Couch Doc that exists is required.
              // This puts the last revision of the Couch Doc into the input#rev field
              // so that it will be submitted using ajaxSubmit.
              couchDoc.on_for = $('.lightsForm input#on_for').val()
			  $.couch.db("highland").saveDoc(couchDoc,   {
				    success: function(data) {
				        alert("Timer set");
				    },
				    error: function(status) {
				        console.log(status);
				    }
				})          
            }, // End success, we have a Doc
          })
            

		})
	}) // end of pageinit for #highland

	
})(jQuery);
