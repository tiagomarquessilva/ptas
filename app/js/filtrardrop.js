var pontos_source = new ol.source.Vector({
    format: new ol.format.GeoJSON(),
});

$(".tipodrop").on('click', function (e) {
    var tipo = $(this).text();
    $("#tipo_texto").val(tipo);
    $("#obra_texto").val("");

    var pontos_tipo = new ol.layer.Vector({
        source: pontos_urbanos_source,
        // projection: 'EPSG:4326',
        style: pubStyle // var 'pubStyle' definida no file 'ponteiro_estilo.js'
    });

    if (tipo == "Todos") {

        $.ajax({
            url: 'php/get_pontos.php',
            async: false,
            success: function (data) {

                var geojsonFormat = new ol.format.GeoJSON();

                pontos_urbanos_source.clear();
                pontos_urbanos_source.addFeatures(geojsonFormat.readFeatures(data));
                $.each(JSON.parse(data).features, function (i) {

                    $(".titulos").append('<button class="dropdown-item obradrop" type="button" value="' + this.properties.id + '">' + this.properties.titulo + '</button>');
                });
            },
            error: function (data) {
                return 'Error:' + data;
            }
        });

    } else {
        $.ajax({
            url: 'php/tipodearte.php',
            data: {
                tipo: tipo
            },
            async: false,
            success: function (data) {

                var geojsonFormat = new ol.format.GeoJSON();


                pontos_urbanos_source.clear();
                pontos_urbanos_source.addFeatures(geojsonFormat.readFeatures(data));

                $(".titulos").empty();
                $.each(JSON.parse(data).features, function (i) {
                    $(".titulos").append('<button class="dropdown-item obradrop" type="button" value="' + this.properties.id + '">' + this.properties.titulo + '</button>');
                });

            },
            error: function (data) {
                return 'Error:' + data;
            }
        });
    }

    map.addLayer(pontos_tipo);

    $(".obradrop").on('click', function (e) {
        var obra = $(this).text();
        var valor = $(this).attr("value");
        if (document.getElementById(valor) == null) {
            $("#obra_texto").val(obra);
            $(".pontos-adicionados").append('<div id="' + valor + '" class="add_to_route list-group-item" style = "margin-bottom: 10px; width: 100%;">' + obra + '<a href="#" ><i class="fas fa-times close" style="float: right;"></i></a></div>');
        }
        var pontos = new ol.layer.Vector({
            source: pontos_source,
            // projection: 'EPSG:4326',
            style: selecionadostyle // var 'pubStyle' definida no file 'ponteiro_estilo.js'
        });

        $.ajax({
            url: 'php/ponto_de_arte.php',
            data: {
                valor: valor
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

});

$("#percurso_completo").change(function () {
    if (this.checked) {
        $("#tipo").prop("disabled", true);
        $("#obra").prop("disabled", true);
        $("#tipo_texto").val("");
        $("#obra_texto").val("");
        $(".pontos-adicionados").html("");
    } else {
        $("#tipo").prop("disabled", false);
        $("#obra").prop("disabled", false);
    }
});