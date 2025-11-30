var Main;

// Assuming you're using a bundler or ES module-compatible environment

import Map from "https://js.arcgis.com/4.33/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/4.33/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/GraphicsLayer.js";
import ElevationLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/ElevationLayer.js";
import SceneView from "https://js.arcgis.com/4.33/@arcgis/core/views/SceneView.js";
import FeatureLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/FeatureLayer.js";

Main = (function() {
    const layer = new ElevationLayer({
        url: "http://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer"
    });
    const map = new Map({
        basemap: "hybrid",
        ground: {
            layers: [layer]
         },
    });
    
    const view = new SceneView({
        container: "map",
        viewingMode: "global",
        map: map,
        camera: {
            position: {
                x: -175.700680,
                y: 44.270,
                z: 17500000,
                spatialReference: {
                    wkid: 4326
    
                }
            },
            heading: 0,
            tilt: 0
        },
        popup: {
            dockEnabled: true,
            dockOptions: {
                breakpoint: false
            }
        },
       

        environment: {
             background: {
             type: "sky" 
                },
            starsEnabled: true,
             lighting: {
            directShadowsEnabled: false
            }
                }
});
             
const initMap = function() {
   
    const graphicsLayer = new GraphicsLayer();
    map.add(graphicsLayer);

   
    for (const [key, value] of Object.entries(myStuff)) {
        const point = {                        
            type: "point",                             
            x: value.coord[0],                        
            y: value.coord[1],                            
            z: 10000                          
        };
        const markerSymbol = {                            
            type: "simple-marker",     
            style: "diamond",                        
            color: [222, 49, 99],                            
            outline: {
                color: [119, 7, 55],                             
                width: 1
            }
        };
        const pointGraphic = new Graphic({                            
            geometry: point,                            
            symbol: markerSymbol,                            
            popupTemplate: {                                
                title: key,
                content: 'Location: ' + value.city + ", " + value.state
            }
        });
        graphicsLayer.add(pointGraphic);
    }

  
    const cityGraphics = [];
    let objectId = 1; 

    for (const [key, value] of Object.entries(cities)) {
        cityGraphics.push(new Graphic({
            geometry: {
                type: "point",
                x: value.coord[0],
                y: value.coord[1],
               
            },
            attributes: {
                objectId: objectId++,  
                title: key,
                city: value.city,
                state: value.state
            }
        }));
    }

   
const cityFeatureLayer = new FeatureLayer({
    source: cityGraphics,
    objectIdField: "objectId",
    fields: [
        { name: "objectId", type: "oid" },
        { name: "title", type: "string" },
        { name: "city", type: "string" },
        { name: "state", type: "string" }
    ],
    geometryType: "point", 
    spatialReference: { wkid: 4326 }, 

       elevationInfo: {
        mode: "on-the-ground"  // This makes the layer render flat in 3D scene
    },
    
    featureReduction: {
        type: "cluster",
        clusterRadius: 500, 
        clusterMinSize: 24,
        clusterMaxSize: 60,
       
        clusterSymbol: {
            type: "simple-marker",
            style: "circle",
            color: [255, 0, 0, 0.7],
            size: 30,
            outline: {
                color: [255, 255, 255],
                width: 2
            }
        },
       
    },
    
    
    renderer: {
        type: "simple",
        symbol: {
            type: "simple-marker",
            style: "circle",
            color: [152, 251, 152],
            size: 8,
            outline: {
                color: [71, 135, 120],
                width: 1
            }
        }
    },
    
    popupTemplate: {
        title: "{title}",
        content: "City: {city}, State: {state}"
    }
});

    map.add(cityFeatureLayer);

    
};


                    
    
                                    

                
    initMap()

    view.on("click", function(event) {
  
  view.hitTest(event).then(function(response) {
    let result = response.results[0];

    if (result?.type === "graphic") {
      let lon = result.mapPoint.longitude;
      let lat = result.mapPoint.latitude;

      console.log("Hit graphic at (" + lon + ", " + lat + ")", result.graphic);
      view.goTo({target:result.graphic.geometry,
                zoom:7
    });
    } else {
      console.log("Did not hit any graphic");
    }
  });
});

view.when(() => {
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");

  searchBtn.addEventListener("click", () => {
    const searchTerm = searchInput.value.trim();


    const matchedKey = Object.keys(cities).find(city => city.toLowerCase() === searchTerm.toLowerCase());

    if (matchedKey) {
      const city = cities[matchedKey];
      view.goTo({
        center: [city.coord[0], city.coord[1]],
        zoom: 10
      }).catch(err => {
        console.error("GoTo failed: ", err);
      });
    } else {
      alert("City not found in dataset.");
    }
  });
});
                
    return {};

            
})();



    
