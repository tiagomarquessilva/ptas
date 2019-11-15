<?php
//  NOTAS IMPORTANTES:
//  Tem que ter sempre no minimo 3 params para este script resultar, se menos usar o pgr_dijkstra
//  Assume-se que o primeiro param é o ponto de partida
//  No JS passar params como JSON.stringify(array_de_parametros)
header('Content-Type: application/json; charset=utf-8');

// Dados conexao bd
include "db_connection.php";

try {

    // Recebe ids dos ponto
    $params = json_decode($_GET['parametros']);
    //echo var_dump($params);

    $ponto_partida = "(SELECT source FROM rede_viaria
    ORDER BY ST_Distance(
        ST_StartPoint(geom), ST_SetSRID(ST_MakePoint(" . $params->ponto_partida[0] . ", " . $params->ponto_partida[1] . "),4326),
        true
   ) ASC
   LIMIT 1)";

    $ponto_chegada = "(SELECT source FROM rede_viaria
   ORDER BY ST_Distance(
       ST_StartPoint(geom), ST_SetSRID(ST_MakePoint(" . $params->ponto_chegada[0] . ", " . $params->ponto_chegada[1] . "),4326),
       true
  ) ASC
  LIMIT 1)";

    // Obter a sequencia de visita (pgr_tsp)
    $query_seq = "SELECT tsp.seq AS n, pau.id AS id, tsp.node AS node, ST_AsGeoJSON(pau.localizacao) AS localizacao
    FROM (SELECT seq, node FROM pgr_TSP(
            $$
            SELECT * FROM pgr_dijkstraCostMatrix(
                'SELECT id, source, target, cost, reverse_cost FROM rede_viaria',
                (SELECT array_agg(id) FROM rede_viaria_vertex WHERE id IN(" . $ponto_partida . ", " . $ponto_chegada . ") OR id IN (SELECT (SELECT source
        FROM rede_viaria
        ORDER BY ST_Distance(ST_StartPoint(geom), pontos_arte_urbana.localizacao, true) ASC LIMIT 1)
    FROM pontos_arte_urbana
    WHERE is_active = true)),
                directed := false
            )
            $$,
            start_id :=" . $ponto_partida . ",
           end_id :=" . $ponto_chegada . ",
            randomize := false
        )) AS tsp
        LEFT JOIN (SELECT id, localizacao, (SELECT source
        FROM rede_viaria
        ORDER BY ST_Distance(ST_StartPoint(geom), pontos_arte_urbana.localizacao, true) ASC LIMIT 1) AS node
    FROM pontos_arte_urbana
    WHERE is_active = true) AS pau ON tsp.node = pau.node
    ORDER BY tsp.seq ASC";

    $seq = pg_fetch_all(pg_query($db_connection, $query_seq));
    array_pop($seq);
    //echo var_dump($seq);

    // Obter o caminho a ser realizado entre os nodes (pgr_dijkstra)
    $num_results = count($seq);
    $all_paths = '';
    for ($i2 = 0; $i2 <= ($num_results - 2); $i2++) {
        $path_node_to_node = pg_fetch_all(pg_query_params($db_connection, "SELECT jsonb_build_object(
            'type',       'Feature',
            'geometry',   ST_AsGeoJSON(ST_TRANSFORM(geom,3857))::jsonb
         ) FROM (
             SELECT seq, node, edge, pt.cost, agg_cost, geom
             FROM pgr_dijkstra('SELECT id, source, target, cost, reverse_cost FROM rede_viaria', $1::int, $2::int, directed:=true) as pt
             LEFT JOIN rede_viaria rd ON pt.edge = rd.id
             ) row;", array($seq[$i2]["node"], $seq[$i2 + 1]["node"])));

        //echo var_dump($path_node_to_node);
        if (!$path_node_to_node) {
            $all_paths .= '{"type": "Feature", "geometry": null}';
        } else {
            $num_lines = count($path_node_to_node);
            for ($i3 = 0; $i3 < $num_lines; $i3++) {
                $all_paths .= $path_node_to_node[$i3]["jsonb_build_object"];

                // Se for a ultima linha nao adicionar uma virgula
                if ($i3 != ($num_lines - 1)) {
                    $all_paths .= ", ";
                }
            }
        }

        // Se for o ultimo pgr_dijkstra nao adicionar uma virgula
        if ($i2 != ($num_results - 2)) {
            $all_paths .= ", ";
        }
    }

    $geojson = '{"type": "FeatureCollection", "features": [' . $all_paths . ']}';

    $json = '{"seq":' . json_encode($seq) . ', "geojson":' . $geojson . '}';

    echo $json;
} catch (Exception $e) {
    echo 'Erro a ler da base de dados: ' . $e->getMessage();
}
