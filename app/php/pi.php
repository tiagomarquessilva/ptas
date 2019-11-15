<?php
header('Content-Type: application/json; charset=utf-8');

// Dados conexao bd
include "db_connection.php";

try {

    $params = json_decode($_GET['params']);

    // Obter o node OSM do PAU
    $pau_rvv = pg_fetch_all(pg_query_params($db_connection, "SELECT source AS node FROM rede_viaria
        ORDER BY ST_Distance(
            ST_StartPoint(geom),
            (SELECT localizacao FROM pontos_arte_urbana WHERE id = $1),
            true
       ) ASC
       LIMIT 1", array($params->pau)))[0]["node"];

    // Obter o node OSM dos PI
    $pi_rvv = pg_fetch_all(pg_query($db_connection, "SELECT id, (SELECT source
    FROM rede_viaria
    ORDER BY ST_Distance(ST_StartPoint(geom), pontos_interesse.localizacao, true) ASC LIMIT 1) AS node
    FROM pontos_interesse"));

    $num_pi = count($pi_rvv);

    $pi_a_mostrar = array();

    // Iterar sobre todos os PI
    for ($i = 0; $i < $num_pi; $i++) {

        if ($pau_rvv == $pi_rvv[$i]["node"]) {
            $cost = 0;
        } else {
            $cost =  (float)pg_fetch_all(pg_query_params($db_connection, "SELECT (agg_cost * 60 ) AS agg_cost 
        FROM pgr_dijkstra('SELECT id, source, target, cost, reverse_cost FROM rede_viaria', $1::int, $2::int, directed:=true) as pt
        LEFT JOIN rede_viaria rd ON pt.edge = rd.id
       ORDER BY agg_cost DESC LIMIT 1;", array($pau_rvv, $pi_rvv[$i]["node"])))[0]["agg_cost"];
            //echo var_dump($cost);
        }

        // Se agg_cost > $params->tempo, entao nao mostrar ponto, senao mostrar
        if ($cost <= $params->tempo) {
            array_push($pi_a_mostrar, (int) $pi_rvv[$i]["id"]);
            // echo "Custo: ";
            // echo var_dump($cost);
            // echo " Tempo: ";
            // echo var_dump($params->tempo);^

        }
    }
    //echo var_dump($pi_a_mostrar);

    // Criar geojson com os pontos selecionados
    if (count($pi_a_mostrar) == 0) {
        $geojson = '{"type": "FeatureCollection", "features": [type: "Feature", geometry: null ]}';
    } else {
        $geojson = pg_fetch_all(pg_query($db_connection, "SELECT jsonb_build_object(
            'type',     'FeatureCollection',
            'features', jsonb_agg(features.feature)
        )
        FROM (
          SELECT jsonb_build_object(
            'type',       'Feature',
            'geometry',   ST_AsGeoJSON(localizacao)::jsonb,
            'properties', to_jsonb(inputs)- 'localizacao'
          ) AS feature
          FROM (SELECT pontos_interesse.id AS id, pontos_interesse.nome AS nome, pontos_interesse.horario AS horario, pi_fotos.foto AS imagem, ST_TRANSFORM(pontos_interesse.localizacao,3857) AS localizacao 
        FROM pontos_interesse
        LEFT JOIN pi_fotos ON pi_fotos.pontos_interesse_id = pontos_interesse.id
        WHERE id IN (" . implode(", ", $pi_a_mostrar) . ")) inputs) features"))[0]["jsonb_build_object"];
    }

    echo $geojson;
} catch (Exception $e) {
    echo 'Erro a ler da base de dados: ' . $e->getMessage();
}
