

ogr2ogr -f "GeoJSON" -s_srs "EPSG:2805" -t_srs "EPSG:4326" \
    -where "municipal IN ('CAMBRIDGE', 'SOMERVILLE', 'BOSTON', 'MEDFORD', 'ARLINGTON', 'NEWTON','WATERTOWN', 'BELMONT', 'EVERETT', 'CHELSEA', 'MALDEN','WINTHROP', 'BROOKLINE')" \
    data/grid_attr_filtBOS2.geojson ../../proc/grid_250m_shell_smaller_data.shp


ogr2ogr -f "GeoJSON" -s_srs "EPSG:2805" -t_srs "EPSG:4326" \
    data/grid_attr_MA.geojson ../../proc/grid_250m_shell_smaller_data.shp

ogr2ogr -f "GeoJSON" -s_srs "EPSG:2805" -t_srs "EPSG:4326"\
    -where "municipal IN ('CAMBRIDGE', 'SOMERVILLE', 'BOSTON', 'MEDFORD', 'ARLINGTON', 'NEWTON','WATERTOWN', 'BELMONT', 'EVERETT', 'CHELSEA', 'MALDEN','WINTHROP', 'BROOKLINE', 'MELROSE', 'SAUGUS', 'LYNN', 'WINCHESTER', 'LEXINGTON', 'WALTHAM', 'REVERE', 'WESTON', 'WELLESLEY', 'NEEDHAM', 'DOVER','DEDHAM','MILTON', 'QUINCY', 'BRAINTREE','WEYMOUTH', 'WAKEFIELD','WOBURN','PEABODY','SALEM','MARBLEHEAD', 'SWAMPSCOTT', 'BEVERLY','BURLINGTON','BEDFORD','LINCOLN', 'CONCORD','WAYLAND','NATICK', 'STONEHAM','NORWOOD','WESTWOOD', 'CANTON','RANDOLPH', 'NAHANT')" \
    data/grid_attr_filtBOS4.geojson ../../proc/grid_250m_shell_smaller_data.shp

ogr2ogr -f "GeoJSON" -s_srs "EPSG:2805" -t_srs "EPSG:4326"\
    -where "municipal IN ('CAMBRIDGE', 'SOMERVILLE', 'BOSTON', 'MEDFORD', 'ARLINGTON', 'NEWTON','WATERTOWN', 'BELMONT', 'EVERETT', 'CHELSEA', 'MALDEN','WINTHROP', 'BROOKLINE', 'MELROSE', 'SAUGUS', 'LYNN', 'WINCHESTER', 'LEXINGTON', 'WALTHAM', 'REVERE', 'WESTON', 'WELLESLEY', 'NEEDHAM', 'DOVER','DEDHAM','MILTON', 'QUINCY', 'BRAINTREE','WEYMOUTH', 'WAKEFIELD','WOBURN','PEABODY','SALEM','MARBLEHEAD', 'SWAMPSCOTT', 'BEVERLY','BURLINGTON','BEDFORD','LINCOLN', 'CONCORD','WAYLAND','NATICK', 'STONEHAM','NORWOOD','WESTWOOD', 'CANTON','RANDOLPH', 'NAHANT')" \
    data/grid_attr_filtBOSMetro.geojson ../proc/grid_250m_shell_smaller_data.shp


ogr2ogr -f "GeoJSON" -s_srs "EPSG:2805" -t_srs "EPSG:4326"\
     data/zip_attr.geojson ../proc/zips_data.shp
