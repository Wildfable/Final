var Main;

// Assuming you're using a bundler or ES module-compatible environment

import Map from "https://js.arcgis.com/4.33/@arcgis/core/Map.js";
import Graphic from "https://js.arcgis.com/4.33/@arcgis/core/Graphic.js";
import GraphicsLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/GraphicsLayer.js";
import MapView from "https://js.arcgis.com/4.33/@arcgis/core/views/MapView.js";
import GeoJSONLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/GeoJSONLayer.js";
import FeatureLayer from "https://js.arcgis.com/4.33/@arcgis/core/layers/FeatureLayer.js";
import Legend from "https://js.arcgis.com/4.33/@arcgis/core/widgets/Legend.js";



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
    
        const infillGraphicsLayer = new GraphicsLayer({
        title: "Laramie Infill Parcels - Suitability",
        opacity: 0.7
    });
    
    map.add(infillGraphicsLayer);
    
    const infillLayer = new GeoJSONLayer({
        url: "./Laramie_Infill.geojson",
        title: "Laramie Infill Parcels",
        opacity: 0
    });
    
    infillLayer.when(() => {
        console.log("Infill layer loaded, running suitability analysis...");
        
        const query = infillLayer.createQuery();
        query.outFields = ["*"];
        query.returnGeometry = true;
        
        infillLayer.queryFeatures(query).then(function(results) {
            const features = results.features;
            console.log(`Total parcels: ${features.length}`);
            
            let highCount = 0, mediumCount = 0, lowCount = 0;
            
            for (let i = 0; i < features.length; i++) {
                const feature = features[i];
                const attrs = feature.attributes;
                const geometry = feature.geometry;
                
                let score = 0;
                
                if (attrs.MaxLots > 50) score += 3;
                else if (attrs.MaxLots > 20) score += 2;
                else if (attrs.MaxLots > 5) score += 1;
                
                const totalPI = (attrs.PI_Sidewal || 0) + (attrs.PI_Roadway || 0);
                if (totalPI === 0) score += 3;
                else if (totalPI < 1000) score += 2;
                else if (totalPI < 5000) score += 1;
                
                if (attrs.grosssf > 100000) score += 2;
                else if (attrs.grosssf > 50000) score += 1;
                
                if (attrs.ExistingSt === "N") score += 1;
                if (attrs.OnetoThree === "Y") score += 1;
                if (attrs.Commercial === "Y") score += 2
                else if (attrs.Fourplus_U === "Y") score += 2;
                
                if (attrs.UP_Owned === "Y") score -= 3;
                if (attrs.UW_Owned === "Y") score -= 5;
                
                
                let color, suitability;
                
                if (score >= 8) {
                    color = [0, 255, 0, 0.7];
                    suitability = "High";
                    highCount++;
                } else if (score >= 5) {
                    color = [255, 255, 0, 0.7];
                    suitability = "Medium";
                    mediumCount++;
                } else {
                    color = [255, 0, 0, 0.7];
                    suitability = "Low";
                    lowCount++;
                }
                
                const graphic = new Graphic({
                    geometry: geometry,
                    symbol: {
                        type: "simple-fill",
                        color: color,
                        outline: {
                            color: [100, 100, 100],
                            width: 1
                        }
                    },
                    attributes: {
                        pidn: attrs.pidn,
                        name1: attrs.name1,
                        MaxUnits: attrs.MaxUnits,
                        grosssf: attrs.grosssf,
                        SuitabilityScore: score,
                        Suitability: suitability
                    },
                    popupTemplate: {
                        title: `Parcel ${attrs.pidn} - ${suitability} Potential`,
                        content: `
                            <b>Suitability:</b> ${suitability}<br>
                            <b>Score:</b> ${score}<br>
                            <b>Max Units:</b> ${attrs.MaxUnits}<br>
                            <b>Lot Size:</b> ${attrs.grosssf.toLocaleString()} sq ft<br>
                            <b>Owner:</b> ${attrs.name1}
                        `
                    }
                });
                
                infillGraphicsLayer.add(graphic);
            }
            
            console.log(`Analysis complete: ${highCount} High, ${mediumCount} Medium, ${lowCount} Low`);
            
        }).catch(error => {
            console.error("Error querying features:", error);
        });
        
    }).catch(error => {
        console.error("Error loading infill layer:", error);
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
            title: "Laramie's Zoning",
            content: `
            <b>Zoning Code:</b> {zoneclass}<br>
            <b>Description:</b> {zonedesc}<br>
            `
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
    
    const zoningLayer = map.layers.getItemAt(2);
    
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
