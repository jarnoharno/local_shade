// Get google maps bounding box in a format accepted by Raymond Hill's Voronoi
// diagram library.
//
// map: A fully initialized Google maps object.
// return: Bounding box of the Google maps window.

function mapBbox(map) {
  var bounds = map.getBounds();
  var ne = bounds.getNorthEast();
  var sw = bounds.getSouthWest();
  return {
    xl: sw.lng(),
    xr: ne.lng(),
    yt: sw.lat(),
    yb: ne.lat()
  };
}

function mean(x) {
  var y = x[0].slice();
  for (var i = 1; i < x.length; ++i) {
    for (var j = 0; j < y.length; ++j) {
      y[j] += x[i][j];
    }
  }
  for (var j = 0; j < y.length; ++j) {
    y[j] = y[j]/x.length;
  }
  return y;
}

function vertexToLatLng(vertex) {
  return new google.maps.LatLng(vertex.y, vertex.x);
}

function arrayToLatLng(array) {
  return new google.maps.LatLng(array[0], array[1]);
}

function toVertex(x) {
  return { x: x[1], y: x[0] };
}

function toVertices(x) {
  return x.map(toVertex);
}

// parse jsonp data files to global variables

function dist(a, b) {
  c = a[0]-b[0];
  d = a[1]-b[1];
  return c*c+d*d;
}

function anyClose(sites, site) {
  sites.forEach(function(s) {
    if (dist(s,site) < 0.0001) {
    }
  });
}

function parseData(labels, sites) {
  window.labels = labels;
  // remove overlapping
  window.sites = [];
  var set = {};
  sites.forEach(function(site) {
    var id = site.slice(0,2)+'';
    if (set[id] === undefined) {
      set[id] = site[2];
      window.sites.push(site);
    }
  });
}

// Compute voronoi diagram and convert to Google Maps polygons.

function voronoiPolygons(labels, sites, bbox, voronoi) {
  console.log(bbox);
  var vertices = toVertices(sites);
  var diagram = voronoi.compute(vertices, bbox);
  return diagram.cells.map(function(cell) {
    var label = sites[cell.site.voronoiId][2];
    var path = cell.halfedges.map(function(edge) {
      return vertexToLatLng(edge.getStartpoint());
    });
    return new google.maps.Polygon({
      path: path,
      strokeOpacity: 0.0,
      strokeWeight: 0,
      fillColor: labels[label][1],
      fillOpacity: 0.3
    });
  });
}

function initVoronoi() {
  var voronoi = new Voronoi();
  return {
    compute: function(labels, sites, bbox) {
      return voronoiPolygons(labels, sites, bbox, voronoi);
    }
  };
}
