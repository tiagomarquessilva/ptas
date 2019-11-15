var coordenadas_partida = [];
var coordenadas_chegada = [];
var map, id;
var x = document.getElementById("recipient-name1");
var y = document.getElementById("recipient-name2");
var transform = ol.proj.getTransform('EPSG:3857', 'EPSG:4326');
var pontos_urbanos_source = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    if (id == 0) {
        x.value = "Latitude: " + parseFloat(position.coords.latitude).toFixed(4) +
            ", Longitude: " + parseFloat(position.coords.longitude).toFixed(4);
        coordenadas_partida = [(position.coords.longitude).toString(), (position.coords.latitude).toString()];
    } else {
        y.value = "Latitude: " + parseFloat(position.coords.latitude).toFixed(4) +
            ", Longitude: " + parseFloat(position.coords.longitude).toFixed(4);
        coordenadas_chegada = [(position.coords.longitude).toString(), (position.coords.latitude).toString()];
    }

}

function load_paus() {

    var pontos_urbanos = new ol.layer.Vector({
        source: pontos_urbanos_source,
        // projection: 'EPSG:4326',
        style: pubStyle // var 'pubStyle' definida no file 'ponteiro_estilo.js'
    });

    $.ajax({
        url: 'php/get_pontos.php',
        async: false,
        success: function (data) {

            var geojsonFormat = new ol.format.GeoJSON();

            pontos_urbanos_source.clear();
            pontos_urbanos_source.addFeatures(geojsonFormat.readFeatures(data));

            map.addLayer(pontos_urbanos);
        },
        error: function (data) {
            return 'Error:' + data;
        }
    });
}

$(document).ready(function () {

    // Carregar mapa e pontos
    map = new ol.Map({
        target: 'map',
        layers: [
            new ol.layer.Tile({
                source: new ol.source.OSM()
            }),

        ],
        view: new ol.View({
            center: ol.proj.fromLonLat([-8.5993, 40.7763]),
            zoom: 13
        }),
    });

    load_paus();

    // Event Listeners

    // Abrir Filtro 
    $("#abrirfiltro").click(function () {
        if ($("#filtragem").css('visibility') == 'hidden') {
            $("#filtragem").css('visibility', 'visible');
            $("#abrirfiltro").html("");
            $("#abrirfiltro").append("<i class='fas fa-angle-up'></i>");

        } else {
            $("#filtragem").css('visibility', 'hidden');
            $("#abrirfiltro").html("");
            $("#abrirfiltro").append("<i class='fas fa-angle-down'></i>");
        }
    });

    // Click no Mapa
    var layer_partida_mapa = null;
    var layer_partida_gps = null;
    var layer_chegada_mapa = null;
    var layer_chegada_gps = null;

    // GPS
    document.getElementById("botao_partida").addEventListener("click", function () {
        id = 0;
        getLocation();
        // Colocar ponto no mapa
        if (layer_partida_mapa != null) {
            layer_partida_mapa.getSource().getFeatures()[0].setStyle(invisivelStyle);
        }
        if (layer_partida_gps != null) {
            layer_partida_gps.getSource().getFeatures()[0].setStyle(invisivelStyle);
        }
        map.removeLayer(layer_partida_mapa);
        map.removeLayer(layer_partida_gps);
        var ponto = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(coordenadas_partida[0]), parseFloat(coordenadas_partida[1])], 'EPSG:3857')),
            name: "Ponto de Partida",
        });
        ponto.setStyle(partidaStyle);
        layer_partida_gps = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [ponto]
            })
        });

        var dragInteraction2 = new ol.interaction.Modify({
            features: new ol.Collection([ponto]),
            style: null,
            pixelTolerance: 20
        });
        
        // Add the event to the drag and drop feature
        dragInteraction2.on('modifyend',function(){
            var novas_coord = ponto.getGeometry().getCoordinates();
            ponto.getGeometry().setCoordinates(novas_coord);
            data_coordenadas = ol.proj.transform(novas_coord, 'EPSG:3857', 'EPSG:4326') + '';
            coordenadas_partida = data_coordenadas.split(",");
            x.value = "Latitude: " + parseFloat(coordenadas_partida[1]).toFixed(4) + " , Longitude: " + parseFloat(coordenadas_partida[0]).toFixed(4);
            x.blur();               
        },ponto);

        map.addLayer(layer_partida_gps);
        map.addInteraction(dragInteraction2);
    });

    document.getElementById("botao_chegada").addEventListener("click", function () {
        id = 1;
        getLocation();
        // Colocar ponto no mapa
        if (layer_chegada_mapa != null) {
            layer_chegada_mapa.getSource().getFeatures()[0].setStyle(invisivelStyle);
        }
        if (layer_chegada_gps != null) {
            layer_chegada_gps.getSource().getFeatures()[0].setStyle(invisivelStyle);
        }
        map.removeLayer(layer_chegada_mapa);
        map.removeLayer(layer_chegada_gps);
        var ponto = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(coordenadas_chegada[0]), parseFloat(coordenadas_chegada[1])], 'EPSG:3857')),
            name: "Ponto de Chegada",
        });
        ponto.setStyle(chegadaStyle);
        layer_chegada_gps = new ol.layer.Vector({
            source: new ol.source.Vector({
                features: [ponto]
            })
        });

        var dragInteraction3 = new ol.interaction.Modify({
            features: new ol.Collection([ponto]),
            style: null,
            pixelTolerance: 20
        });
        
        // Add the event to the drag and drop feature
        dragInteraction3.on('modifyend',function(){
            var novas_coord = ponto.getGeometry().getCoordinates();
            ponto.getGeometry().setCoordinates(novas_coord);
            data_coordenadas = ol.proj.transform(novas_coord, 'EPSG:3857', 'EPSG:4326') + '';
            coordenadas_chegada = data_coordenadas.split(",");
            y.value = "Latitude: " + parseFloat(coordenadas_chegada[1]).toFixed(4) + " , Longitude: " + parseFloat(coordenadas_chegada[0]).toFixed(4);
            y.blur();               
        },ponto);


        map.addLayer(layer_chegada_gps);
        map.addInteraction(dragInteraction3);       
    });

    map.on('click', function (evt) {
        if ($("#recipient-name1").is(':focus')) {
            // Obter coords
            var data = map.getCoordinateFromPixel(evt.pixel);
            var data_coordenadas = ol.proj.transform(data, 'EPSG:3857', 'EPSG:4326') + '';
            coordenadas_partida = data_coordenadas.split(",");

            // Preencher o input
            x.value = "Latitude: " + parseFloat(coordenadas_partida[1]).toFixed(4) + " , Longitude: " + parseFloat(coordenadas_partida[0]).toFixed(4);
            x.blur();

            // Colocar ponto no mapa
            if (layer_partida_mapa != null) {
                layer_partida_mapa.getSource().getFeatures()[0].setStyle(invisivelStyle);
            }
            if (layer_partida_gps != null) {
                layer_partida_gps.getSource().getFeatures()[0].setStyle(invisivelStyle);
            }
            map.removeLayer(layer_partida_mapa);
            map.removeLayer(layer_partida_gps);
            var ponto = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(coordenadas_partida[0]), parseFloat(coordenadas_partida[1])], 'EPSG:3857')),
                name: "Ponto de Partida",
            });
            ponto.setStyle(partidaStyle);
            layer_partida_mapa = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [ponto]
                })
            });

            var dragInteraction = new ol.interaction.Modify({
                features: new ol.Collection([ponto]),
                style: null,
                pixelTolerance: 20
            });

            // Add the event to the drag and drop feature
            dragInteraction.on('modifyend',function(){
                var novas_coord = ponto.getGeometry().getCoordinates();
                ponto.getGeometry().setCoordinates(novas_coord);
                data_coordenadas = ol.proj.transform(novas_coord, 'EPSG:3857', 'EPSG:4326') + '';
                coordenadas_partida = data_coordenadas.split(",");
                x.value = "Latitude: " + parseFloat(coordenadas_partida[1]).toFixed(4) + " , Longitude: " + parseFloat(coordenadas_partida[0]).toFixed(4);
                x.blur();
            },ponto);



            map.addLayer(layer_partida_mapa);
            map.addInteraction(dragInteraction);


        } else if ($("#recipient-name2").is(':focus')) {
            var data = map.getCoordinateFromPixel(evt.pixel);
            var data_coordenadas = ol.proj.transform(data, 'EPSG:3857', 'EPSG:4326') + '';
            coordenadas_chegada = data_coordenadas.split(",");
            y.value = "Latitude: " + parseFloat(coordenadas_chegada[1]).toFixed(4) + " , Longitude: " + parseFloat(coordenadas_chegada[0]).toFixed(4);
            y.blur();

            // Colocar ponto no mapa
            if (layer_chegada_mapa != null) {
                layer_chegada_mapa.getSource().getFeatures()[0].setStyle(invisivelStyle);
            }
            if (layer_chegada_gps != null) {
                layer_chegada_gps.getSource().getFeatures()[0].setStyle(invisivelStyle);
            }
            map.removeLayer(layer_chegada_mapa);
            map.removeLayer(layer_chegada_gps);
            var ponto = new ol.Feature({
                geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(coordenadas_chegada[0]), parseFloat(coordenadas_chegada[1])], 'EPSG:3857')),
                name: "Ponto de Chegada",
            });
            ponto.setStyle(chegadaStyle);
            layer_chegada_mapa = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [ponto]
                })
            });

            var dragInteraction1 = new ol.interaction.Modify({
                features: new ol.Collection([ponto]),
                style: null,
                pixelTolerance: 20
            });
     
            // Add the event to the drag and drop feature
            dragInteraction1.on('modifyend',function(){
                var novas_coord = ponto.getGeometry().getCoordinates();
                ponto.getGeometry().setCoordinates(novas_coord);
                data_coordenadas = ol.proj.transform(novas_coord, 'EPSG:3857', 'EPSG:4326') + '';
                coordenadas_chegada = data_coordenadas.split(",");
                y.value = "Latitude: " + parseFloat(coordenadas_chegada[1]).toFixed(4) + " , Longitude: " + parseFloat(coordenadas_chegada[0]).toFixed(4);
                y.blur();               
            },ponto);


            map.addLayer(layer_chegada_mapa);
            map.addInteraction(dragInteraction1);

        }
    });
});