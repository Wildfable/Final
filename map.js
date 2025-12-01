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
            type: "simple",
            symbol: {
                type: "simple-fill",
                color: [0, 100, 255, 0.3], 
                outline: {
                    color: [0, 70, 200],
                    width: 1
                }
            }
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
