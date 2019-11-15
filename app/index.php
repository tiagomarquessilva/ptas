<!doctype html>
<html lang="pt">

<head>
    <meta property="og:image" content="https://gis4cloud.com/ptas_grupo3_2019/tsp1.jpg"/>
    <meta property="og:url" content="https://gis4cloud.com/ptas_grupo3_2019/"/>
    <meta property="og:type"content="article" /> 
    <meta property="og:title" content="Arte Urbana Estarreja" /> 
    <link rel="image_src" href="https://gis4cloud.com/ptas_grupo3_2019/tsp1.jpg" />

  <!-- Required meta tags -->
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <!-- Bootstrap CSS -->
  <link rel="stylesheet" href="css/libraries/bootstrap-4.3.1/bootstrap.min.css">
  <link rel="stylesheet" href="fontawesome-5.8.2/css/all.css">
  <link rel="stylesheet" href="css/libraries/ol-5.3.0/ol.css">
  <link rel="stylesheet" href="css/libraries/ol-ext/ol-ext.min.css" />
  <link rel="stylesheet" href="css/style.css">
  <title>EstaArte</title>
</head>

<body>
  <?php require("navbar.php"); ?>

  <div id="filtragem" class="img col-xs-12 col-sm-12 col-md-3 col-lg-3" style="visibility: hidden;">

    <!-- Primeiro Campo -->
    <div class="row">
      <div class="input-group mb-3 col-12">
        <div class="input-group-prepend">
          <span class="input-group-text"><i class="far fa-flag"></i></span>
        </div>
        <input type="text" class="form-control" id="recipient-name1" placeholder="Local de Partida" aria-label="Recipient's username" aria-describedby="basic-addon2">
        <div class="input-group-append">
          <button id="botao_partida" class="btn btn-outline-secondary" type="button"><i class='fas fa-crosshairs'></i></button>
        </div>
      </div>
    </div>

    <!-- Segundo Campo -->
    <div class="row">
      <div class="input-group mb-3 col-12">
        <div class="input-group-prepend">
          <span class="input-group-text"><i class="fas fa-flag-checkered"></i></span>
        </div>
        <input type="text" class="form-control" id="recipient-name2" placeholder="Local de Chegada" aria-label="Recipient's username" aria-describedby="basic-addon2">
        <div class="input-group-append">
          <button id="botao_chegada" class="btn btn-outline-secondary" type="button"><i class='fas fa-crosshairs'></i></button>
        </div>
      </div>
    </div>

    <!-- Primeira Dropdown -->
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button id="tipo" class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Tipo:</button>
        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">
          <button class="dropdown-item tipodrop" type="button">Mural</button>
          <button class="dropdown-item tipodrop" type="button">Instalação</button>
          <button class="dropdown-item tipodrop" type="button">Poster</button>
          <button class="dropdown-item tipodrop" type="button">Exposição</button>
          <button class="dropdown-item tipodrop" type="button">Todos</button>
        </div>
      </div>
      <input id="tipo_texto" type="text" class="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" readonly>
    </div>

    <!-- Segunda Dropdown -->
    <div class="input-group mb-3">
      <div class="input-group-prepend">
        <button id="obra" class="btn btn-outline-secondary dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Obra:</button>
        <div class="dropdown-menu titulos" aria-labelledby="dropdownMenu2"></div>
      </div>
      <input id="obra_texto" type="text" class="form-control" placeholder="" aria-label="Username" aria-describedby="basic-addon1" readonly>
    </div>

    <!-- Adicionar Pontos -->
    <div class="pontos-adicionados"></div>

    <!-- Percurso completo e apagar rota-->
    <div class="row">
      <div class="toggle-switch col justify-content-start">
        <input class="toggle-input" type="checkbox" id="percurso_completo">

        <label class="toggle-slider" for="percurso_completo"></label>

        <label class="toggle-label" for="percurso_completo">Percurso Completo</label>
      </div>
      <div class="col justify-content-end align-self-center">
        <button id="apagar_rota" type="button" class="btn-dark btn btn-block"><i class='fas fa-trash'></i> Apagar Rota</button>
      </div>
    </div>

    <!-- Botao calcular -->
    <button id="calcular" type="button" class="btn-dark btn btn-block" style="margin-top: 10px;"><i class='fas fa-satellite-dish'></i> Calcular</button>

  </div>

  <div id="map" class="map" style="width: 100%; height: 100%; position:fixed"></div>

  <!-- Bibliotecas -->
  <script src="js/libraries/jquery-3.4.1.min.js"></script>
  <script src="js/libraries/bootstrap-4.3.1/bootstrap.bundle.min.js"></script>
  <script src="js/libraries/ol-5.3.0/ol.js"></script>
  <script src="js/libraries/ol-ext/ol-ext.min.js"></script>

  <!-- Scripts -->
  <script src="js/ponteiro_estilo.js"></script>
  <script src="js/filtrardrop.js"></script>
  <script src="js/mapa.js"></script>
  <script src="js/popup.js"></script>
  <script src="js/tsp.js"></script>
  <script src="js/heatmap.js"></script>
</body>

</html>