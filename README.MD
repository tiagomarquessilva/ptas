# Projeto Temático em Aplicações SIG

Este é o repositório relativo ao [PTAS](https://www.ua.pt/estga/uc/13449), inserido no Módulo Temático em Aplicações SIG da licenciatura em [Tecnologias da Informação](https://www.ua.pt/estga/course/63/?p=2) lecionada na [Universidade de Aveiro - Escola Superior de Tecnologia e Gestão de Águeda (ESTGA - UA)](https://www.ua.pt/estga/Default.aspx)

## Objetivos

Resumidamente, o objetivo deste projeto é construir uma aplicação que utilize tecnologias WebSIG e routing. Para isso foi construida uma [aplicação de roteiros de arte urbana para a cidade de Estarreja](https://www.gis4cloud.com/ptas_grupo3_2019/) onde:
    - É possivel visualizar as obras de arte no mapa;
    - É possivel escolher que obras de arte quer visitar e é calculado a rota mais rápida;
    - É possevel definir os locais de partida e chegada do trajeto.
    - É possivel ver os pontos de interesse a X minutos da obra de arte;
    - Heatmap para visualizar em que zonas existem mais obras de arte.

Uma descrição mais detalhada dos requisitos pode ser encontrada na Documentação deste documento. 

## Tecnologias, Protocolos, Software, Etc. Usados

- [PHP](https://www.php.net/);
- [PostgreSQL](https://www.postgresql.org/);
- [PostGIS](https://postgis.net/);
- [PgRouting](https://pgrouting.org/);
- [OpenLayers](https://openlayers.org/);
- [jQuery](https://jquery.com/);
- [Bootstrap](https://getbootstrap.com/);
- JavaScript;
- CSS;
- HTML;
- UML.

## Instalação

1. Importar a [base de dados](database.sql) para o PostgreSQL;
1. Importar a [aplicação](app) para um webserver;
1. Inserir as credenciais de acesso à BD no [ficheiro de conexão](app/php/db_connection.php).

## Documentação

- [Relatório](Relatorio.pdf).

## Autores

Os autores foram os seguintes alunos da Universidade de Aveiro:
- Hugo Neves (Nº Mec. 88167);
- João Santos (Nº Mec. 88007);            
- Luís Batista (Nº Mec. 78387);               
- Tiago Silva (Nº Mec. 87913).     