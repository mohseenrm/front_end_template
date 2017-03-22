'use strict';

(function () {
    var filterDict = {
        'region': ['Central', 'East', 'South', 'West'],
        'category': ['Coffee', 'Tea', 'Espresso', 'Herbal Tea']
    };

    var button = document.getElementById('update').addEventListener('click', updateClicked, false);

    var height = 200;
    var width = 300;

    //Called when the update button is clicked
    function updateClicked() {
        d3.csv('./data/CoffeeData.csv', update);
    }

    function getFields(){
        return([getXSelectedOption(), getYSelectedOption()]);
    }
    //Callback for when data is loaded
    function update(rawdata) {

        var fields = getFields();
        var result = {};

        _.forOwn(filterDict[fields[0]], function(value, key){
            result[value] = 0;
        });

        console.log(result);

        var filteredData = rawdata.filter(function(record){
            result[record[fields[0]]] += parseFloat(record[fields[1]]);
        });

        console.log(result);
        render(result);

    }

    // Returns the selected option in the X-axis dropdown. Use
    // d[getXSelectedOption()] to retrieve value instead of d.getXSelectedOption()
    function getXSelectedOption() {
        var node = d3
            .select('#xdropdown')
            .node();
        var i = node.selectedIndex;
        return node[i].value;
    }

    // Returns the selected option in the Y-axis dropdown.
    function getYSelectedOption() {
        var node = d3
            .select('#ydropdown')
            .node();
        var i = node.selectedIndex;
        return node[i].value;
    }
    /**
    * @function render
    * @param  {JSON} data {results to render}
    * @return {undefined} {will render results on webpage}
    */
    function render(data){

        var fields = getFields();

        var yData = Object.values(data),
            xData = Object.keys(data);


        console.log(xData);
        console.log(yData);

        var height = 200;
        var width = 300;

        
        var svg = d3.select('#vis'),
            margin = {top: 20, right: 20, bottom: 30, left: 40};

        svg.selectAll('g').remove();
        svg.selectAll('text').remove();

        svg.attr('width', width)
            .attr('height', height);
        
        var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
            y = d3.scaleLinear().rangeRound([height, 0]);
        
        var g = svg.append('g');
        
        x.domain(xData);
        y.domain([0, d3.max(yData)]);

        console.log(y(yData[0]));
        console.log(x.bandwidth());
        g.selectAll('.bar')
            .data(yData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', function(d){ return x( xData[ yData.indexOf( d ) ] ); })
            .attr('y', function(d){ return y(d); })
            .attr('width', x.bandwidth())
            .attr('height', function(d){ return height - y(d) });

        g.append('g')
            .attr('class', 'axis axis--x')
            .attr('transform', 'translate(0,' + height + ')')
            // .text(fields[0])
            .call(d3.axisBottom(x));

        g.append('g')
            .attr('class', 'axis axis--y')
            .attr('transform', 'translate( 300, 0 )')
            .call(d3.axisRight(y).ticks(5));

        // text label for the x axis
        svg.append('text')             
            .attr('transform', 'translate(' + (width/2) + ' ,' + (height + 35) + ')')
            .style('text-anchor', 'middle')
            .text(fields[0]);

        // text label for the y axis
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', (width + 55))
            .attr('x', 0 - (height / 2))
            .attr('dy', '1em')
            .style('text-anchor', 'middle')
            .text(fields[1] + ' in $'); 

        //at the end change the height and width of the svg (400, 300)
        var final = document.getElementById('vis');
        final.setAttribute('style', 'width:400px;height:300px');
    };
})();