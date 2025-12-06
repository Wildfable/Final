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
    const zoningToggleBtn = document.createElement("button");
    zoningToggleBtn.textContent = "Hide Zoning Districts";
    zoningToggleBtn.style.cssText = `
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
    
    view.ui.add(zoningToggleBtn, "top-right");
    
    const zoningLayer = map.layers.getItemAt(2);
    
    let zoningVisible = true;
    
    zoningToggleBtn.addEventListener("click", function() {
        if (zoningVisible) {
            zoningLayer.visible = false;
            zoningToggleBtn.textContent = "Show Zoning Districts";
            zoningVisible = false;
        } else {
            zoningLayer.visible = true;
            zoningToggleBtn.textContent = "Hide Zoning Districts";
            zoningVisible = true;
        }
    });
    
    const suitabilityToggleBtn = document.createElement("button");
    suitabilityToggleBtn.textContent = "Hide Suitability Analysis";
  suitabilityToggleBtn.style.cssText = `
    padding: 10px 15px;
    background-color: #F28C28;  
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin: 10px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
`;

view.ui.add(suitabilityToggleBtn, "top-right");
    
    const suitabilityLayer = map.layers.getItemAt(0);
    
    let suitabilityVisible = true;
    
    suitabilityToggleBtn.addEventListener("click", function() {
        if (suitabilityVisible) {
            suitabilityLayer.visible = false;
            suitabilityToggleBtn.textContent = "Show Suitability Analysis";
            suitabilityVisible = false;
        } else {
            suitabilityLayer.visible = true;
            suitabilityToggleBtn.textContent = "Hide Suitability Analysis";
            suitabilityVisible = true;
        }
    });
    
    const legendContainer = document.createElement("div");
    legendContainer.style.cssText = `
        background-color: white;
        padding: 15px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        font-family: Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
        max-width: 220px;
        max-height: 400px;
        overflow-y: auto;
    `;
    
    legendContainer.innerHTML = `
        <h3 style="margin: 0 0 12px 0; font-size: 16px; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px;">Map Legend</h3>
        
        <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #28a745;">Infill Suitability</h4>
            <div style="margin-bottom: 6px; display: flex; align-items: center;">
                <div style="flex-shrink: 0; width: 20px; height: 20px; background-color: rgba(0, 255, 0, 0.7); margin-right: 8px; border: 1px solid #00c800;"></div>
                <span>High Potential (Score ≥ 8)</span>
            </div>
            <div style="margin-bottom: 6px; display: flex; align-items: center;">
                <div style="flex-shrink: 0; width: 20px; height: 20px; background-color: rgba(255, 255, 0, 0.7); margin-right: 8px; border: 1px solid #c8c800;"></div>
                <span>Medium Potential (Score 5-7)</span>
            </div>
            <div style="margin-bottom: 6px; display: flex; align-items: center;">
                <div style="flex-shrink: 0; width: 20px; height: 20px; background-color: rgba(255, 0, 0, 0.7); margin-right: 8px; border: 1px solid #c80000;"></div>
                <span>Low Potential (Score < 5)</span>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: #666; font-style: italic;">
                Toggle with green button above
            </div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #0079c1;">Zoning Districts</h4>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px; font-size: 11px;">
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(100, 200, 255); margin-right: 4px; border: 1px solid black;"></div>
                    <span>AE</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(150, 220, 255); margin-right: 4px; border: 1px solid black;"></div>
                    <span>AV</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(139, 69, 19); margin-right: 4px; border: 1px solid black;"></div>
                    <span>AG</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(255, 217, 102); margin-right: 4px; border: 1px solid black;"></div>
                    <span>B1</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(255, 150, 0); margin-right: 4px; border: 1px solid black;"></div>
                    <span>B2</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(255, 200, 100); margin-right: 4px; border: 1px solid black;"></div>
                    <span>NB</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(255, 0, 0); margin-right: 4px; border: 1px solid black;"></div>
                    <span>C2</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(255, 50, 50); margin-right: 4px; border: 1px solid black;"></div>
                    <span>DC</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(200, 100, 200); margin-right: 4px; border: 1px solid black;"></div>
                    <span>I1</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(150, 50, 150); margin-right: 4px; border: 1px solid black;"></div>
                    <span>I2</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(180, 80, 180); margin-right: 4px; border: 1px solid black;"></div>
                    <span>IP</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(170, 70, 170); margin-right: 4px; border: 1px solid black;"></div>
                    <span>LM</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(190, 232, 255); margin-right: 4px; border: 1px solid black;"></div>
                    <span>LR</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(190, 232, 255); margin-right: 4px; border: 1px solid black;"></div>
                    <span>R1</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(166, 255, 193); margin-right: 4px; border: 1px solid black;"></div>
                    <span>R2</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(144, 238, 144); margin-right: 4px; border: 1px solid black;"></div>
                    <span>R2M</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(255, 242, 204); margin-right: 4px; border: 1px solid black;"></div>
                    <span>R3</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(255, 255, 150); margin-right: 4px; border: 1px solid black;"></div>
                    <span>R3-PUD</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(210, 180, 140); margin-right: 4px; border: 1px solid black;"></div>
                    <span>RR</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(200, 200, 200); margin-right: 4px; border: 1px solid black;"></div>
                    <span>O</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(180, 220, 240); margin-right: 4px; border: 1px solid black;"></div>
                    <span>TO</span>
                </div>
                <div style="display: flex; align-items: center;">
                    <div style="width: 12px; height: 12px; background-color: rgb(150, 150, 150); margin-right: 4px; border: 1px solid black;"></div>
                    <span>Other</span>
                </div>
            </div>
            <div style="margin-top: 8px; font-size: 11px; color: #666; font-style: italic;">
                Toggle with blue button above
            </div>
        </div>
        
        <div style="padding-top: 10px; border-top: 1px solid #ddd; font-size: 11px; color: #666;">
            <div><strong>Scoring Criteria:</strong></div>
            <div>• Max Lots (higher = better)</div>
            <div>• Public Improvement costs (lower = better)</div>
            <div>• Lot Size (larger = better)</div>
            <div>• No existing structure (+1)</div>
            <div>• Commercial/4+ Units (+2)</div>
            <div>• Railroad/University owned (-3/-5)</div>
        </div>
    `;

    const legendWrapper = document.createElement("div");
    legendWrapper.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 20px;
        z-index: 100;
    `;
    legendWrapper.appendChild(legendContainer);
    
    document.getElementById("map").appendChild(legendWrapper);
});

const title = document.createElement("div");
title.innerHTML = "<h2 style='margin: 0; font-size: 18px;'>Laramie Infill Development Suitability Analysis</h2>";
title.style.cssText = `
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(255, 255, 255, 0.95);
    padding: 12px 25px;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    font-family: Arial, sans-serif;
    z-index: 100;
    text-align: center;
    color: #0056b3;
    border: 1px solid #0056b3;
`;
document.getElementById("map").appendChild(title);

})();


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

