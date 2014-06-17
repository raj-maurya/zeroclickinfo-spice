(function (env){
	"use strict";
	env.ddg_spice_njt = function(api_result){
		if (api_result.failed){
			return Spice.failed('njt');
		}

		function padZeros(n, len){
			var s = n.toString();
			while (s.length < len){
	  			s = '0' + s;
			}
			return s;
		}

		function format_time(t){
			var hour = parseInt(t.split(':')[0]);
			var minute = parseInt(t.split(':')[1]);
			var ampm = (hour >= 24) ? 'AM' : (hour >= 12) ? 'PM' : 'AM';
			if (hour > 24){
				hour -= 24;
			} else if (hour > 12) {
				hour -= 12;
			}
			return hour + ':' + padZeros(minute, 2) + ' ' + ampm;
		}

		function timeToInt(t){
			var hour = parseInt(t.split(':')[0]);
			var minute = parseInt(t.split(':')[1]);
			return hour*60 + minute;
		}

		var sorted = api_result.routes.sort(function(a, b){
			return timeToInt(a.departure_time) - timeToInt(b.departure_time);
		});

		Spice.add({
			id: 'njt',
			name: 'NJ Transit',
			data: sorted,
			meta: {
				heading: "Commuter Trains from " + api_result.origin + " to " + api_result.destination,
				sourceUrl: api_result.url,
				sourceName: "NJ Transit"
			},
			templates: {
				group: 'text',
				detail: false,
				item_detail: false,
				options: {
					footer: Spice.njt.footer
				}
			},
			normalize: function(item){
				var status_class = "";
				if (!item.status) {item.status = "On Time";}
				if (item.status === "Cancelled") {status_class = "njt__cancelled";}
				else if (item.status == "All Aboard") {status_class = "njt__allaboard";}
				else if (item.status == "Boarding" || item.status == "Stand By") {status_class = "njt__boarding";}
				return {
					url: api_result.url,
					title: format_time(item.departure_time) + " (" + item.train + ")",
					subtitle: item.line,
					description: "Arrives " + format_time(item.arrival_time),
					status_class: status_class
				};
			}
		});
	};
}(this));