var Main;

// Assuming you're using a bundler or ES module-compatible environment

import Map from "https://js.arcgis.com/4.33/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/4.33/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/GraphicsLayer.js";
import MapView from "https://js.arcgis.com/4.33/@arcgis/core/views/MapView.js";
import GeoJSONLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/GeoJSONLayer.js";
import FeatureLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/FeatureLayer.js";



Main = (function() {
    const map = new Map({
        basemap: "topo-vector"  
        
    });
    
   const view = new MapView({  
        container: "map",
        map: map,
        center: [-105.5910, 41.3114], 
        zoom: 13,  
        popup: {
            dockEnabled: true,
            dockOptions: {
                breakpoint: false
            }
        }
    });
             
const initMap = function() {
    const infillLayer = new GeoJSONLayer({
        url: "./Laramie_Infill.geojson",
        title: "Laramie Infill Parcels",
        opacity: 0.7,
        renderer: {
            type: "unique-value",
            field: "Zoning",
            defaultSymbol: {
                type: "simple-fill",
                color: [200, 200, 200, 0.7], 
                outline: {
                    color: [100, 100, 100],
                    width: 1
                }
            },
            uniqueValueInfos: [
        {
            value: "R1",
            symbol: {
                type: "simple-fill",
                color: [255, 255, 0, 0.7],  
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
        {
            value: "R2",
            symbol: {
                type: "simple-fill",
                color: [128, 0, 128, 0.7], 
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
        {
            value: "R3",
            symbol: {
                type: "simple-fill",
                color: [255, 0, 0, 0.7], 
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
        {
            value: "R2M",
            symbol: {
                type: "simple-fill",
                color: [210, 105, 30, 0.7],  
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
        {
            value: "LR",
            symbol: {
                type: "simple-fill",
                color: [0, 100, 0, 0.7],  
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
         {
            value: "RR",
            symbol: {
                type: "simple-fill",
                color: [255, 182, 193, 0.7],  
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
         {
            value: "I2",
            symbol: {
                type: "simple-fill",
                color: [72, 61, 139, 0.7],  
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
         {
            value: "B1",
            symbol: {
                type: "simple-fill",
                color: [154, 205, 50, 0.7],  
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
        {
            value: "C2",
            symbol: {
                type: "simple-fill",
                color: [255, 165, 0, 0.7],  
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
        {
            value: "B2",
            symbol: {
                type: "simple-fill",
                color: [0, 112, 255, 0.7], 
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
        {
            value: "AG",
            symbol: {
                type: "simple-fill",
                color: [144, 238, 144, 0.7],  
                outline: { color: [100, 100, 100], width: 1 }
            }
        },
        {
            value: "O",
            symbol: {
                type: "simple-fill",
                color: [0, 128, 128, 0.7],  
                outline: { color: [100, 100, 100], width: 1 }
            }
        }
    ]     
        },

        popupTemplate: {
            title: "Infill Parcel",
            content: "Click to see parcel details"
        }
    });

        infillLayer.when(() => {
        console.log("GeoJSON layer loaded successfully!");
        console.log("Number of features:", infillLayer.source.length);
          }).catch(error => {
        console.error("Error loading GeoJSON:", error);
            });

    map.add(infillLayer);
};

map.add(infillLayer);


const zoningLayer = new GeoJSONLayer({
    url: "./Zoning.geojson",
    title: "City of Laramie Zoning Districts",
    opacity: 0.3,  
    renderer: {
        type: "simple",
        symbol: {
            type: "simple-fill",
            color: [0, 0, 0, 0], 
            outline: {
                color: [0, 0, 0],  
                width: 2  
            }
        }
    },
    popupTemplate: {
        title: "Zoning District",
        content: "{ZONING_DISTRICT}"  // Adjust field name as needed
    }
});

map.add(zoningLayer);
                                                  

                
    initMap()



/* 
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

    */        
})();
