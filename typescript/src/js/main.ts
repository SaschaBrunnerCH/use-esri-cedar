import FeatureLayer = require("esri/layers/FeatureLayer");
import Map = require("esri/Map");
import MapView = require("esri/views/MapView");
import cedar = require("@esri/cedar")

const map = new Map({
    basemap: "topo"
});

const view = new MapView({
    container: "viewDiv",
    map: map,
    zoom: 4,
    center: [-99, 38.9]
});

const defaultSymbol = {
    type: "simple-marker",
    outline: {
        color: [198, 12, 70, 1]
    },
    size: 9,
    color: [248, 187, 37, 0.9]
};
const rend: any = {
    type: "simple",
    symbol: defaultSymbol
};
const featureLayer = new FeatureLayer({
    url:
        "https://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/It's_a_Tornado_Map/FeatureServer/0",
    renderer: rend
    // outFields: ["*"]
});
map.add(featureLayer);

const definition: any = {
    type: "bar",
    datasets: [
        {
            url:
                "https://services.arcgis.com/bkrWlSKcjUDFDtgw/arcgis/rest/services/It's_a_Tornado_Map/FeatureServer/0",
            query: {
                groupByFieldsForStatistics: "state",
                outStatistics: [
                    {
                        statisticType: "sum",
                        onStatisticField: "injuries",
                        outStatisticFieldName: "injuries_SUM"
                    }
                ],
                orderByFields: "injuries_SUM DESC"
            }
        }
    ],
    series: [
        {
            category: {
                field: "state",
                label: "State"
            },
            value: {
                field: "injuries_SUM",
                label: "Injuries"
            }
        }
    ]
};

const cedarChart = new cedar.Chart("chart", definition);
cedarChart.show();

view.watch("extent", function (newValue) {
    var newExtent = JSON.stringify(newValue);
    cedarChart.datasets()[0].query = newExtent;
    cedarChart.show();
});
