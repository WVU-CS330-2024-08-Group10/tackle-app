import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
 import * as LEsri from 'esri-leaflet';

const Map = () => {
    useEffect(() => {
        const map = L.map('map').setView([38.8976, -80.4549], 7);
        var fishBox = document.getElementById("fishBox");

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
            <div id="weather"></div>
            <div id="map"></div>
            <div id="fishBox">
                <h3 id="boxHeader">Body of Water: N/A</h3>
                <ul id="listFish"></ul>
            </div>
        </div>
    );
}

function setFish(properties, urlType) {
    let fishTypes = ["ChanCatfish", "Crappie", "StripBass", "LrgmthBass", "Musky", "WhtBass", "Walleye", "Trout"];
    let boxHeader = document.getElementById("boxHeader");
    let listFish = document.getElementById("listFish");

    boxHeader.innerText = "Body of Water: N/A";
    listFish.innerHTML = "";

    if(urlType == "Lake") {
        boxHeader.innerText = "Body of Water: " + properties.LakeName;
    } else {
        boxHeader.innerText = "Body of Water: " + properties.Name;;
    }

    fishTypes.forEach(fish => {
        if(properties[fish] == 1) {
            let newFish = document.createElement("li");
            newFish.innerText = fish;
            listFish.appendChild(newFish);
        }
    });
}

export default Map;