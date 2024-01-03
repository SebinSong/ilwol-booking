import { Container, NaverMap, Marker, useNavermaps } from 'react-naver-maps'

const latLngs = {
  oriStation: { lat: 37.33780553242877, lng: 127.1093872426527 },
  lgTwin: { lat: 37.3356926132163, lng: 127.10938982077288 }
}

export default function HomeNaverMap () {
  const navermaps = useNavermaps()

  return (
    <Container className='naver-map-container'>
      <NaverMap
        defaultCenter={new navermaps.LatLng(latLngs.oriStation.lat, latLngs.oriStation.lng)}
        defaultZoom={15}
        scaleControl={true}
        zoomControl={true}
        scrollWheel={false}>
        <Marker defaultPosition={new navermaps.LatLng(latLngs.lgTwin.lat, latLngs.lgTwin.lng)} />
      </NaverMap>
    </Container>
  )
}
