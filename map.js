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

const zoningLayer = new GeoJSONLayer({
    url: "./Zoning.geojson",
    title: "City of Laramie Zoning Districts",
    opacity: 0.6,  
    renderer: {
            type: "unique-value",
            field: "zoneclass",
            defaultSymbol: {
                type: "simple-fill",
                color: [150, 150, 150, 0.6],
                outline: { color: [0, 0, 0, 1.0], width: 1 }
            },
            uniqueValueInfos: [
                {
                    value: "AE",  
                    symbol: {
                        type: "simple-fill",
                        color: [100, 200, 255, 0.6], 
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "AV",  
                    symbol: {
                        type: "simple-fill",
                        color: [150, 220, 255, 0.6], 
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "AG",  
                    symbol: {
                        type: "simple-fill",
                        color: [139, 69, 19, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "B1",  
                    symbol: {
                        type: "simple-fill",
                        color: [255, 217, 102, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "B2",  
                    symbol: {
                        type: "simple-fill",
                        color: [255, 150, 0, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "NB",  
                    symbol: {
                        type: "simple-fill",
                        color: [255, 200, 100, 0.6], 
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "C2", 
                    symbol: {
                        type: "simple-fill",
                        color: [255, 0, 0, 0.6], 
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "DC",  
                    symbol: {
                        type: "simple-fill",
                        color: [255, 50, 50, 0.6], 
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "I1", 
                    symbol: {
                        type: "simple-fill",
                        color: [200, 100, 200, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "I2", 
                    symbol: {
                        type: "simple-fill",
                        color: [150, 50, 150, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "IP", 
                    symbol: {
                        type: "simple-fill",
                        color: [180, 80, 180, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "LM",  
                    symbol: {
                        type: "simple-fill",
                        color: [170, 70, 170, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "LR",  
                    symbol: {
                        type: "simple-fill",
                        color: [190, 232, 255, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "R1", 
                    symbol: {
                        type: "simple-fill",
                        color: [190, 232, 255, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "R2",  
                    symbol: {
                        type: "simple-fill",
                        color: [166, 255, 193, 0.6], 
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "R2M", 
                    symbol: {
                        type: "simple-fill",
                        color: [144, 238, 144, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "R3",  
                    symbol: {
                        type: "simple-fill",
                        color: [255, 242, 204, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "R3-PUD",  
                    symbol: {
                        type: "simple-fill",
                        color: [255, 255, 150, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "RR",  
                    symbol: {
                        type: "simple-fill",
                        color: [210, 180, 140, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "O",  
                    symbol: {
                        type: "simple-fill",
                        color: [200, 200, 200, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "TO", 
                    symbol: {
                        type: "simple-fill",
                        color: [180, 220, 240, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                },
                {
                    value: "Other",  
                    symbol: {
                        type: "simple-fill",
                        color: [150, 150, 150, 0.6],  
                        outline: { color: [0, 0, 0, 1.0], width: 1 }
                    }
                }
            ]
        },
    popupTemplate: {
        title: "Zoning District",
        content: "{ZONING_DISTRICT}"  
    }
});
    zoningLayer.when(() => {
        console.log("Zoning GeoJSON loaded successfully!");
        }).catch(error => {
        console.error("Error loading zoning GeoJSON:", error);
         });

    map.add(zoningLayer);
};

initMap();

view.when(() => {
    const toggleBtn = document.createElement("button");
    toggleBtn.textContent = "Hide Zoning Districts";
    toggleBtn.style.cssText = `
        padding: 10px 15px;
        background-color: #0079c1;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        margin: 10px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    `;
    
    view.ui.add(toggleBtn, "top-right");
    
    const zoningLayer = map.layers.getItemAt(1);
    
    let zoningVisible = true;
    
    toggleBtn.addEventListener("click", function() {
        if (zoningVisible) {
            zoningLayer.visible = false;
            toggleBtn.textContent = "Show Zoning Districts";
            zoningVisible = false;
        } else {
            zoningLayer.visible = true;
            toggleBtn.textContent = "Hide Zoning Districts";
            zoningVisible = true;
        }
    });
});


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
