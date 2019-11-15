<?php

try{
include "db_connection.php";

$id = json_decode($_GET['id']);

$no_mais_proximo .= "(SELECT id FROM rede_viaria
ORDER BY ST_Distance(
    ST_StartPoint(geom),
    (SELECT localizacao FROM pontos_arte_urbana WHERE id = " . $id . "),
    true
) ASC
LIMIT 1)";
    

$poligno_1 .= "SELECT ST_ConcaveHull(st_union(geom), 0.95) 
FROM ( SELECT rede_viaria_vertex.geom  
FROM pgr_drivingDistance( '  SELECT id, source, target, st_astext(geom), km as cost  
FROM rede_viaria', 23002, 1, false, false) 
INNER JOIN rede_viaria on (rede_viaria.id = $no_mais_proximo) 
INNER JOIN rede_viaria_vertex on  (rede_viaria_vertex.id = rede_viaria.source)) as t";


pg_close($db_connection);
} catch (Exception $e) {
    echo 'Caught exception: ',  $e->getMessage(), "\n";
}

    
?>