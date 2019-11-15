<?php
$data = $_GET['valor'];

try{

include "db_connection.php";

$result = pg_query($db_connection, "SELECT jsonb_build_object(
    'type',     'FeatureCollection',
    'features', jsonb_agg(features.feature)
)
FROM (
  SELECT jsonb_build_object(
    'type',       'Feature',
    'geometry',   ST_AsGeoJSON(localizacao)::jsonb,
    'properties', to_jsonb(inputs)- 'localizacao'
  ) AS feature
  FROM (SELECT pontos_arte_urbana.id AS id, pontos_arte_urbana.titulo AS titulo, artistas.nome AS artista, tipos.nome AS tipo, pontos_arte_urbana.evento_realizado AS evento_realizado, pontos_arte_urbana.ano_realizado AS ano_realizado, pontos_arte_urbana.descricao AS descricao, pau_fotos.foto AS imagem, ST_TRANSFORM(pontos_arte_urbana.localizacao,3857) AS localizacao 
FROM pontos_arte_urbana
INNER JOIN artistas ON pontos_arte_urbana.artista = artistas.id
INNER JOIN tipos ON pontos_arte_urbana.tipo = tipos.id
INNER JOIN pau_fotos ON pau_fotos.pontos_arte_urbana_id = pontos_arte_urbana.id
WHERE pontos_arte_urbana.id = ".$data.") inputs) features") or die('Query failed: ' . pg_last_error());




echo pg_fetch_assoc($result)["jsonb_build_object"];
pg_close($db_connection);
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

?>