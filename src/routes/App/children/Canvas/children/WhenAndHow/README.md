# [WORKING WITH D3.JS AND CANVAS: WHEN AND HOW](https://bocoup.com/blog/d3js-and-canvas)


We can create charts quickly when working with D3.js and standard DOM elements, but that comes with a key limitation: the number of nodes we can return  is fairly small. Have you ever tried to return  a scatterplot with 1000+ circles in SVG? If you have, then you’ve probably seen your browser crumble under the weight of its own DOM.

Thankfully, using D3.js with canvas (or really any other return er) isn’t that hard. While it requires working a bit outside of D3.js’s usual lifecycle metaphor, it can still provide you with a lot of power.

Ways to use D3.js with canvas
There are three common ways D3 users return  to canvas.

You could use D3.js entirely for its functional purpose – to transform data that you can then position onto your canvas as you see fit.

You could also use D3.js with some dummy HTML nodes to capture lifecycle selections and then repainting the canvas when the data changes.

You could use D3.js with some dummy HTML nodes to capture lifecycle selections AND their animations, repainting the canvas on a draw loop.

In this post, I’ll step through how you might accomplish each.

Approach 1: no data binding
When using the first approach, you are ignoring D3.js’s data binding functionality. This probably means you’re only drawing your chart once: you’re not expecting new data that would require a chart redraw or update. This also might mean you aren’t planning on updating the chart as a result of any user interactions.

Let’s look at an example:

01.approach-1.js

var base = d3.select("#vis");
var chart = base.append("canvas")
  .attr("width", 400)
  .attr("height", 300);

var context = chart.node().getContext("2d");
var data = [1,2,13,20,23];

var scale = d3.scale.linear()
  .range([10, 390])
  .domain([1,23]);

data.forEach(function(d, i) {
  context.beginPath();
  context.rect(scale(d), 150, 10, 10);
  context.fillStyle="red";
  context.fill();
  context.closePath();
});
This will produce the following return ing:

boxes

See this example live here

In this example, we’ve created a blank canvas, created a scale from our data array and used it to then position rectangles in a canvas. The actual drawing section of this basic chart doesn’t really use D3.js in any way. We are just iterating over an array of numbers and painting some rect objects.

This is the most painless way to integrate D3.js, but we’re clearly missing out on a lot of functionality here and creating a fairly limited chart.

Approach 2: data binding, no transitions
If we are expecting our chart to update at all, then we really should be taking advantage of D3.js’s data binding mechanisms. Being able to update our UI to new, updating or exiting data points is an important part of communicating about changing data.

Since a canvas element itself does not contain any nodes within it, we have to do some hacking around here to emulate this behavior. Specifically, we are going to make some dummy HTML nodes that will be ignored by the browser, update them appropriately to contain the styling, positioning and content we want, and then return  them onto the canvas itself. A lot of this technique comes from this block by Mike Bostock, D3.js’s creator.

Let’s look at an example of how we might do this. First, establish our containers. Note that we’re creating a new container, dataContainer that is of typecustom and will live in memory. Now, custom is definitely not a standard DOM element type, so it will not be return ed in any way. We are going to be using it as a container for our other dummy nodes.

02.approach-2-setup.js

var base = d3.select("#vis");

var chart = base.append("canvas")
  .attr("width", 400)
  .attr("height", 300);

var context = chart.node().getContext("2d");

// Create an in memory only element of type 'custom'
var detachedContainer = document.createElement("custom");

// Create a d3 selection for the detached container. We won't
// actually be attaching it to the DOM.
var dataContainer = d3.select(detachedContainer);
The next step is to define a routine for creating & updating our dummy nodes according to the data changes that we see. The following code should look really familiar because it does exactly what you would normally do with D3.js: create a data binding and define what should happen to entering, exiting and updating elements. This specific piece of code however, is working with our strange customelement, using the class property to define the type of canvas shape we’re drawing (a rect) and its associated attributes.

While this may seem strange, this is actually a common pattern to working with canvas. Even outside of D3.js, it’s very likely you would need a “model” of some kind for the “objects” that is separate from their actual return ing. The only difference in this case is that the “model objects” just happen to be DOM nodes so that we can take advantage of D3.js’s data binding mechanism.

03.approach-2-draw-custom.js

function drawCustom(data) {
  var scale = d3.scale.linear()
    .range([10, 390])
    .domain(d3.extent(data));

  var dataBinding = dataContainer.selectAll("custom.rect")
    .data(data, function(d) { return d; });

  // update existing element to have size 15 and fill green
  dataBinding
    .attr("size", 15)
    .attr("fillStyle", "green");

  // for new elements, create a 'custom' dom node, of class rect
  // with the appropriate rect attributes
  dataBinding.enter()
      .append("custom")
      .classed("rect", true)
      .attr("x", scale)
      .attr("y", 100)
      .attr("size", 8)
      .attr("fillStyle", "red");

  // for exiting elements, change the size to 5 and make them grey.
  dataBinding.exit()
    .attr("size", 5)
    .attr("fillStyle", "lightgrey");

  drawCanvas();
}
What’s this drawCanvas() function call at the end? Well, last but not least, we need to write a function to actually convert these elements to the canvas drawing we expect. Here, we find all the custom.rect elements we created earlier, then we iterate over them and draw the rects that we defined, using the x, y, size, and fillStyle attributes we defined on those nodes.

04.approach-2-draw-canvas.js

function drawCanvas() {

  // clear canvas
  context.fillStyle = "#fff";
  context.rect(0,0,chart.attr("width"),chart.attr("height"));
  context.fill();

  var elements = dataContainer.selectAll("custom.rect");
  elements.each(function(d) {
    var node = d3.select(this);

    context.beginPath();
    context.fillStyle = node.attr("fillStyle");
    context.rect(node.attr("x"), node.attr("y"), node.attr("size"), node.attr("size"));
    context.fill();
    context.closePath();

  });
}
Putting everything together, we can now return  this chart by calling

05.approach-2-run.js

drawCustom([1,2,13,20,23]);

// try calling it with a new set of data, and watch the canvas update:
// drawCustom([1,2,12,16,20]);
Uncommenting the second call to drawCustom will produce the following return ing:

boxes

See this code live here

Approach 3: data binding and transitions
This is all fine and good, but we lost D3.js’s amazing transition animations. A huge part of D3.js’s success is the ease with which one can define animations within their charts, and we want to be able to replicate this in our canvas based charts.

Luckily, “Approach #2” really wasn’t that far off the mark:

We are still going to be updating our nodes to reflect the correct position/size/color as we are animating. That’s good news because we can read those values and paint them.

Instead of painting once after all the nodes have been calculated, we now need to ‘monitor’ them, to pull out the values as they update and re-return  our canvas appropriately.

Let’s take a look at how we might change our “Approach #2” code. First, let’s update our drawCustom function to define transitions, rather than just change the attributes immediately:

06.approach-3-draw-custom.js

function drawCustom(data) {
  var scale = d3.scale.linear()
    .range([10, 390])
    .domain(d3.extent(data));

  var dataBinding = dataContainer.selectAll("custom.rect")
    .data(data, function(d) { return d; });

  dataBinding
    .attr("size", 8)
    .transition()
    .duration(1000)
    .attr("size", 15)
    .attr("fillStyle", "green");

  // enter is same...

  dataBinding.exit()
    .attr("size", 8)
    .transition()
    .duration(1000)
    .attr("size", 5)
    .attr("fillStyle", "lightgrey");
}
Note that we are no longer calling drawCanvas at the end of this function. This is intentional. The second biggest change we are going to make is actually calling the drawCanvas method on a loop, instead of when the data is done, like so:

07.approach-3-run.js

d3.timer(drawCanvas);
drawCustom([1,2,13,20,23]);

// uncomment this, to see the transition~
// drawCustom([1,2,12,16,20]);
Uncommenting the second call to drawCustom will result in the following animation

boxes

See live example here.

This is remarkably similar to our second approach, except we’re separating the return ing from our custom node making.

Caveats
If you’ve been paying attention, you’re probably asking yourself now “what about mouse events?!” Good call. Sadly, this approach does not allow us to use the wonderful on event listener that we can normally attach to selections and react to. The most we can do is attach a mouse listener to the canvas element itself, get the x and y coordinates of the pointer and proceed to resolve that somehow ourselves. This requires that we maintain some data structure in memory that corresponds to the location of our return ed elements and their original data association (since mousing over our invisible custom elements isn’t really an option.) This remains an exercise for another blog post, but I hope this approach for return ing charts in canvas with D3.js will be a great start to return ing more of your data.
