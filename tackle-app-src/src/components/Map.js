import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as LEsri from 'esri-leaflet';
import { useAuth } from "../components/AuthProvider";

export const fishTypes = {
    "ChanCatfish": "Channel Catfish",
    "Crappie": "Crappie",
    "StripBass": "Striped Bass",
    "LrgmthBass": "Largemouth Bass",
    "Musky": "Musky",
    "WhtBass": "White Bass",
    "Walleye": "Walleye",
    "Trout": "Trout"
} 

const Map = () => {
    const { borderStyle, setLastLocation } = useAuth();

    useEffect(() => {
        const map = L.map('map').setView([38.8976, -80.4549], 7);

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        var fishingLayer = LEsri.dynamicMapLayer({
            url: 'https://services.wvgis.wvu.edu/arcgis/rest/services/Applications/dnrRec_fishing/MapServer',
            opacity: 0.7
        }).addTo(map);

        const nonLakeUrls = [
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Applications/dnrRec_fishing/MapServer/4',
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Applications/dnrRec_fishing/MapServer/5',
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Applications/dnrRec_fishing/MapServer/13',
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Applications/dnrRec_fishing/MapServer/14'
        ];

        const lakeUrls = [
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Applications/dnrRec_fishing/MapServer/7',
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Applications/dnrRec_fishing/MapServer/8',
            'https://services.wvgis.wvu.edu/arcgis/rest/services/Applications/dnrRec_fishing/MapServer/9'
        ];

        const combinedLayer = L.featureGroup();

        lakeUrls.forEach(url => {
        LEsri.featureLayer({
            url: url,
            onEachFeature: (feature, layer) => {
                layer.on("click", function() {
                    setFish(feature.properties, "Lake");
                    setLastLocation(feature.properties.LakeName); // So fishlist can automatically fill in location for new fish
                });
            },
            opacity: 0.0
        }).addTo(combinedLayer);
        });

        nonLakeUrls.forEach(url => {
        LEsri.featureLayer({
            url: url,
            onEachFeature: (feature, layer) => {
                layer.on("click", function() {
                    setFish(feature.properties, "NotLake");
                    setLastLocation(feature.properties.Name); // So fishlist can automatically fill in location for new fish
                });
            },
            opacity: 0.0
        }).addTo(combinedLayer);
        });

        combinedLayer.addTo(map);

        return () => {
            // Clean up map layers when component unmounts
            map.remove();
          };
    }, []);

    return(
        <div id="mapBody">
            <div id="weather" style={borderStyle}></div>
            <div id="map" style={borderStyle}></div>
            <div id="fishBox" style={borderStyle}>
                <h3 id="boxHeader">Body of Water: N/A</h3>
                <ul id="listFish"></ul>
                <p id="stockBox"></p>
                <p id="regulationBox"></p>
            </div>
        </div>
    );
}

function setRegulation(regulation, regulationBox) {
    if(regulation) {
        regulationBox.innerText = "Regulation: " + regulation;
    } else {
        regulationBox.innerText = "Regulation: No Regulation Data";
    }
}

//placeholder for indicating whether body of water is stocked or not
function setStock() {
    
}

function setFish(properties, urlType) {
    let boxHeader = document.getElementById("boxHeader");
    let listFish = document.getElementById("listFish");
    let regulationBox = document.getElementById("regulationBox");

    boxHeader.innerText = "Body of Water: N/A";
    listFish.innerHTML = "";

    if(urlType == "Lake") {
        boxHeader.innerText = "Body of Water: " + properties.LakeName;
        setRegulation(properties.RegType, regulationBox);
    } else {
        boxHeader.innerText = "Body of Water: " + properties.Name;
        let newFish = document.createElement("li");
        newFish.innerText = "Not Enough Data (See Attached Lakes)";
        listFish.appendChild(newFish);
        setRegulation(properties.RegType, regulationBox);
        return;
    }

    Object.keys(fishTypes).forEach(fish => {
        if(properties[fish] == 1) {
            let newFish = document.createElement("li");
            newFish.innerText = fishTypes[fish];
    
            listFish.appendChild(newFish);
        }
    });
}

export default Map;