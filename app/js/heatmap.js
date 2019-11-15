$(document).ready(function () {
    var heatmap = new ol.layer.Heatmap({
        source: pontos_urbanos_source,
        radius: 20,
        blur: 20
    });
    document.getElementById("heatmaponoff").addEventListener('change', function () {
        if (this.checked) {
            map.addLayer(heatmap);

        } else {
            map.removeLayer(heatmap);
        }

    });
});