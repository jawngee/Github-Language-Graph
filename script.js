var languages = {};
var chart;

$(function(){
	
	var self=this;
	
	this.showresults=function(username)
	{
		$("#result").show();
	    $("#start").hide();

	    _gaq.push(['_trackPageView', '/github-language-graph/'+username]);

	    var repos = [];
	    var completed = 0;

	    $("#result-username").text(username);
	    $("#username").val("");

	    $.getJSON("https://api.github.com/users/"+username+"/repos?callback=?", function(data){
	      $(data.data).each(function(i,d){
	        repos.push(d.url+"/languages");
	      });
	      $("#result-repo-count").text(repos.length + " Repositories");
	      $(repos).each(function(i,r) {
	        $.getJSON(r+"?callback=?", function(data){
	          for(lang in data.data) {
	            var lines = data.data[lang];
	            if(!languages[lang]){
	              languages[lang] = lines;
	            } else {
	              languages[lang] += lines;
	            }
	          }
	          completed++;
	          updateLanguageGraph();
	        });
	      });
	    });
	}
	
	$("#btn-go").click(function(){
		var username = $("#username").val();
		
		window.location.hash='#'+username;
		
		self.showresults(username);

		return false;
	});
  
   chart = new Highcharts.Chart({
      chart: {
         renderTo: 'chart-container',
         backgroundColor: 'whiteSmoke',
         plotBackgroundColor: 'whiteSmoke',
         plotBorderWidth: null,
         plotShadow: false
      },
      title: {
         text: ''
      },
      tooltip: {
         formatter: function() {
            return '<b>'+ this.point.name +'</b>: '+ Math.round(this.y/1000,1) +'kb';
         }
      },
      plotOptions: {
         pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
               enabled: true,
               color: '#000000',
               connectorColor: '#000000',
               formatter: function() {
                  return '<b>'+ this.point.name +'</b>: '+ Math.round(this.percentage,1) +' %';
               }
            }
         }
      },
      series: [{
         type: 'pie',
         name: 'Language Usage',
         data: []
      }]
   });
  
	if (window.location.hash)
		self.showresults(window.location.hash.substr(1));
});

function updateLanguageGraph() {
  var data = [];
  $("#language-table tbody").html('');
  for(lang in languages) {
    data.push({name: lang, y: languages[lang]});
    $("#language-table tbody").append('<tr><td>'+lang+'</td><td>'+languages[lang]+'</td></tr>');
  }
  chart.series[0].setData(data);  
}
