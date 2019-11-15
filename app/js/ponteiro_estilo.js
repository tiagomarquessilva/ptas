var pubStyle;
var partidastyle;
var chegadaStyle;
var selecionadostyle;
$(document).ready(function () {
    pubStyle = [
        new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'img/ponto.png',
                scale: 0.5
            }))
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(52, 58, 64, 1)'
                })
            })
        })
    ];

    piStyle = [
        new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'img/ponto_interesse.png',
                scale: 0.5
            }))
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(52, 58, 64, 1)'
                })
            })
        })
    ];

    selecionadostyle = [
        new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'img/ponto_selecionado.png',
                scale: 0.5
            }))
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(52, 58, 64, 1)'
                })
            })
        })
    ];

    invisivelStyle = [
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 0,
                fill: new ol.style.Fill({
                    color: 'rgba(0,0,0,0)'
                })
            })
        })
    ];

    partidaStyle = [
        new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'img/partida.png',
                scale: 0.5
            }))
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(52, 58, 64, 1)'
                })
            })
        })
    ];

    chegadaStyle = [
        new ol.style.Style({
            image: new ol.style.Icon(({
                anchor: [0.5, 1],
                anchorXUnits: 'fraction',
                anchorYUnits: 'fraction',
                src: 'img/chegada.png',
                scale: 0.5
            }))
        }),
        new ol.style.Style({
            image: new ol.style.Circle({
                radius: 5,
                fill: new ol.style.Fill({
                    color: 'rgba(52, 58, 64, 1)'
                })
            })
        })
    ];

    lineStyle = function (feature) {
        var geometry = feature.getGeometry();
        var styles = [
            // linestring
            new ol.style.Style({
                stroke: new ol.style.Stroke({
                    color: '#000000',
                    width: 6
                })
            })
        ];

        geometry.forEachSegment(function (start, end) {
            var dx = end[0] - start[0];
            var dy = end[1] - start[1];
            var rotation = Math.atan2(dy, dx);
            // arrows
            styles.push(new ol.style.Style({
                geometry: new ol.geom.Point(end),
                image: new ol.style.Icon({
                    src: 'img/arrow.png',
                    scale: 0.5,
                    anchor: [0.75, 0.5],
                    rotateWithView: true,
                    rotation: -rotation
                })
            }));
        });
        return styles;
    };
});