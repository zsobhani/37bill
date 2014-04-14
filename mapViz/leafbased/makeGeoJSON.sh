

ogr2ogr -f "GeoJSON" -s_srs "EPSG:2805" -t_srs "EPSG:4326" \
    -where "municipal IN ('CAMBRIDGE', 'SOMERVILLE', 'BOSTON', 'MEDFORD', 'ARLINGTON', 'NEWTON','WATERTOWN', 'BELMONT', 'EVERETT', 'CHELSEA', 'MALDEN','WINTHROP', 'BROOKLINE')" \
    data/grid_attr_filtBOS2.geojson ../../proc/grid_250m_shell_smaller_data.shp
