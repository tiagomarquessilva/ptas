$(document).ready(function () {
    var pi_source = new ol.source.Vector({
        format: new ol.format.GeoJSON(),
    });

    var pi = new ol.layer.Vector({
        source: pi_source,
        // projection: 'EPSG:4326',
        style: piStyle // var 'pubStyle' definida no file 'ponteiro_estilo.js'
    });

    var popup = new ol.Overlay.Popup({
        popupClass: "default", //"tooltips", "warning" "black" "default", "tips", "shadow",
        closeBox: true,
        onshow: function () {
            $("#adiciona").click(function () {
                var id = $(this).parent().parent().parent().attr('id');
                if ($(".pontos-adicionados").find("#" + id).html() == undefined) {
                    var nome = $(this).closest('div').find('h5').text();
                    $(".pontos-adicionados").append('<div id="' + id + '" class="add_to_route list-group-item" style = "margin-bottom: 10px; width: 100%;">' + nome + '<a href="#" ><i class="fas fa-times close" style="float: right;"></i></a></div>');
                }
                var pontos = new ol.layer.Vector({
                    source: pontos_source,
                    // projection: 'EPSG:4326',
                    style: selecionadostyle // var 'pubStyle' definida no file 'ponteiro_estilo.js'
                });

                $.ajax({
                    url: 'php/ponto_de_arte.php',
                    data: {
                        valor: id
                    },
                    async: false,
                    success: function (data) {
                        var geojsonFormat = new ol.format.GeoJSON();
                        pontos_source.addFeatures(geojsonFormat.readFeatures(data));

                    },
                    error: function (data) {
                        return 'Error:' + data;
                    }
                });
                pontos.setZIndex(1);

                map.addLayer(pontos);
                $(".close").click(function () {
                    var idremove = $(this).closest("div").attr('id');
                    $(this).closest("div").remove();
                    var numFeatures = pontos_source.getFeatures().length;
                    var features = pontos_source.getFeatures();
                    for (i = 0; i < numFeatures; i++) {
                        var properties = features[i].getProperties();
                        var ids = properties['id'];
                        if (ids == idremove) {
                            pontos_source.removeFeature(features[i]);
                        }

                    }
                });
            });
            $("#interesse").click(function (e) {
                var id = $(this).parent().parent().parent().attr('id');
                var dados = {
                    "pau": id,
                    "tempo": 1
                }

                $.ajax({
                    url: 'php/pi.php',
                    data: {
                        "params": JSON.stringify(dados)
                    },
                    success: function (data) {
                        try {
                            var geojsonFormat = new ol.format.GeoJSON();
                            pi_source.clear();
                            pi_source.addFeatures(geojsonFormat.readFeatures(data));
                            map.addLayer(pi);
                        } catch (error) {
                            console.log("PI para este PAU já adicionados");
                        }
                    },
                    error: function (xhr, status, error) {
                        console.log('Error: ' + xhr + "\n" + status + "\n" + error);
                    }
                });
            });
        },
        onclose: function () {
            map.removeLayer(pi);
        },
        positioning: 'auto',
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    map.addOverlay(popup); // var 'map' definida no file 'mapa.js'

    // Control Select 
    var select = new ol.interaction.Select({});
    map.addInteraction(select);

    // On selected => show/hide popup
    select.getFeatures().on(['add'], function (e) {
        var feature = e.element;
        if (feature.get('artista') != null) {
            var content = "";
            content += "<div id=" + feature.get('id') + " class='container'>\
                              <div class='row'>\
                                    <div class='col-6'>\
                                           <img class='size' src='" + feature.get('imagem') + "'>\
                                    </div>\
                                    <div class='col-6 textbox'>\
                                        <h5>" + feature.get('titulo') + "</h5>\
                                        <p>por: " + feature.get('artista') + "</p>\
                                        <p>Tipo: " + feature.get('tipo') + "</p>\
                                        <p>Evento: " + feature.get('evento_realizado') + "</p>\
                                        <p>Ano: " + feature.get('ano_realizado') + "</p>\
                                        <p>Localização: " + feature.get('descricao') + "</p>\
                                        <button id='adiciona' type='button' class='btn btn-info btn-sm float-right'><i class='fas fa-plus'></i> Adicionar ao Percurso</button>\
                                        <button id='interesse' type='button' class='btn btn-info btn-sm float-right'><i class='fas fa-star'></i> Pontos de Interesse</button>\
                                        </div>\
                              </div>\
                        </div";

            popup.show(feature.getGeometry().getFirstCoordinate(), content);
        } else if (feature.get('horario') != null) {
            var content = "";
            content += "<div class='container'>\
                              <div class='row'>\
                                    <div class='col-6'>\
                                           <img class='size' src='" + feature.get('imagem') + "'>\
                                    </div>\
                                    <div class='col-6 textbox'>\
                                        <h5>" + feature.get('nome') + "</h5>\
                                        <p>Horário: " + feature.get('horario') + "</p>\
                                        </div>\
                              </div>\
                        </div";

            popup.show(feature.getGeometry().getFirstCoordinate(), content);
        }
    });
    select.getFeatures().on(['remove'], function (e) {
        popup.hide();
    });
});