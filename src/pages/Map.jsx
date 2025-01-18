import { useEffect, useRef } from 'react';
import geo from 'geojs'; // Import thư viện GeoJS
import PropTypes from 'prop-types'; // Import thư viện PropTypes
// import 'geojs/Map.css'; // Không cần import CSS nếu GeoJS không cung cấp

const Map = ({ locations }) => {
  const mapContainer = useRef(null);

  useEffect(() => {
    const map = geo.map({
      node: mapContainer.current,
      center: { x: 106.6296, y: 10.8230 }, // Tọa độ trung tâm (Ho Chi Minh City)
      zoom: 6,
    });

    map.createLayer('osm'); // Tạo lớp OSM
    const featureLayer = map.createLayer('feature');

    locations.forEach(location => {
      featureLayer.createFeature('point')
        .data([{ x: location.longitude, y: location.latitude }])
        .style({
          fillColor: '#FF0000',
          fillOpacity: 1.0,
          stroke: true,
          strokeColor: '#FFFFFF',
          strokeWidth: 1,
        })
        .draw();
    });

  }, [locations]);

  return <div ref={mapContainer} style={{ height: '400px', width: '100%' }} />;
};

Map.propTypes = {
  locations: PropTypes.arrayOf(PropTypes.shape({
    city: PropTypes.string,
    region: PropTypes.string,
    country: PropTypes.string,
    latitude: PropTypes.number.isRequired,
    longitude: PropTypes.number.isRequired,
  })).isRequired
};

export default Map;
