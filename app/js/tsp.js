$(document).ready(function () {
    var trajeto_source = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
    });

    var rota = new ol.layer.Vector({
        source: trajeto_source,
        style: lineStyle
    });

    var pontos_rota_source = new ol.source.Vector({});

    var pontos_rota = new ol.layer.Vector({
        source: pontos_rota_source,
        style: function (f) {
            return new ol.style.Style({
                image: new ol.style.Circle({
                    radius: 10,
                    fill: new ol.style.Fill({
                        color: 'rgba(255, 255, 255, 1)'
                    })
                }),
                text: new ol.style.Text({
                    text: f.get('n').toString(),
                    font: 'bold 12px sans-serif',
                }),
            })
        }
    });

    // Quando click no Calcular ir buscar os pontos à div e calcular rota
    document.getElementById("calcular").addEventListener("click", function () {
        try {
            // Quando click no Calcular ir buscar os pontos à div e calcular rota
            if (document.getElementById("percurso_completo").checked) {

                if (coordenadas_partida == null || coordenadas_chegada.length == 0) {
                    alert("Selecionar local de partida!");

                } else if (coordenadas_chegada == null || coordenadas_chegada.length == 0) {
                    alert("Selecionar local de chegada!");

                } else {
                    var pontos_json = {
                        "ponto_partida": coordenadas_partida,
                        "ponto_chegada": coordenadas_chegada
                    }

                    $.ajax({
                        url: 'php/tsp_all_points.php',
                        data: {
                            "parametros": JSON.stringify(pontos_json)
                        },
                        method: 'GET',
                        dataType: "json",
                        success: function (data) {
                            var geojsonFormat = new ol.format.GeoJSON();
                            $(".filtragem_sequencia").remove();
                            trajeto_source.clear();
                            trajeto_source.addFeatures(geojsonFormat.readFeatures(data.geojson));
                        
                            pontos_rota_source.clear();
                            for (feature of data.seq) {

                                if (feature.n == 1) {
                                    var texto = "";
                                } else {
                                    var texto = parseInt(feature.n) - 1;
                                }

                                if (feature.localizacao != null) {
                                    var coords = JSON.parse(feature.localizacao);
                                    var ponto = new ol.Feature({
                                        geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(coords.coordinates[0]), parseFloat(coords.coordinates[1])], 'EPSG:3857')),
                                        n: texto
                                    });
                                    pontos_rota_source.addFeature(ponto);
                                }
                            }
                            map.addLayer(rota);
                            map.addLayer(pontos_rota);
                            pontos_rota.setZIndex(10);
                            
                            document.getElementById("apagar_rota").addEventListener("click", function () {
                                map.removeLayer(rota);
                                map.removeLayer(pontos_rota);
                                $(".filtragem_sequencia").remove();

                            });
                        },
                        error: function (data) {
                            return 'Error:' + data;
                        }
                    });
                }
            } else {
                var pontos_dom = document.getElementsByClassName("add_to_route");
                var pontos = [];

                for (ponto of pontos_dom) {
                    pontos.push(ponto.id);
                }

                if (pontos.length == 0) {
                    alert("Selecionar pelo menos um ponto de arte urbana!");

                } else if (coordenadas_partida == null || coordenadas_partida.length == 0) {
                    alert("Selecionar local de partida!");

                } else if (coordenadas_chegada == null || coordenadas_chegada.length == 0) {
                    alert("Selecionar local de chegada!");

                } else {
                    var pontos_json = {
                        "ponto_partida": coordenadas_partida,
                        "pontos": pontos,
                        "ponto_chegada": coordenadas_chegada
                    }

                    $.ajax({
                        url: 'php/tsp.php',
                        data: {
                            "parametros": JSON.stringify(pontos_json)
                        },
                        method: 'GET',
                        dataType: "json",
                        success: function (data) {
                            var geojsonFormat = new ol.format.GeoJSON();

                            $(".filtragem_sequencia").remove();
                            trajeto_source.clear();
                            trajeto_source.addFeatures(geojsonFormat.readFeatures(data.geojson));

                            pontos_rota_source.clear();
                            for (feature of data.seq) {

                                if (feature.n == 1) {
                                    var texto = "";
                                } else if (pontos.length <= 1) {
                                    var texto = 1;
                                } else {
                                    var texto = parseInt(feature.n) - 1;
                                }

                                if (feature.localizacao != null) {
                                    var coords = JSON.parse(feature.localizacao);
                                    var ponto = new ol.Feature({
                                        geometry: new ol.geom.Point(ol.proj.fromLonLat([parseFloat(coords.coordinates[0]), parseFloat(coords.coordinates[1])], 'EPSG:3857')),
                                        n: texto
                                    });
                                    pontos_rota_source.addFeature(ponto);
                                    if($(".pontos-adicionados").find("#" + feature.id).html() != undefined){
                                        
                                        $(".pontos-adicionados").find("#" + feature.id).prepend('<span class="filtragem_sequencia">'+ texto +'</span>');
                                    }
                                }
                            }
                            map.addLayer(rota);
                            map.addLayer(pontos_rota);
                            pontos_rota.setZIndex(10);

                            document.getElementById("apagar_rota").addEventListener("click", function () {
                                map.removeLayer(rota);
                                map.removeLayer(pontos_rota);
                                $(".filtragem_sequencia").remove();

                            });
                        },
                        error: function (data) {
                            return 'Error:' + data;
                        }
                    });
                }
            }
        } catch (error) {

        }
    });
});