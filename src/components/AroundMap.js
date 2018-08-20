import React from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import {AroundMarker} from "./AroudMarker"
import {POST_KEY} from "../constants"

class AroundMap extends React.Component {

  reloadMarkers = () => {
    //console.log(this.map);
    const center = this.map.getCenter();
    const position = {lat: center.lat(), lon: center.lng()};
    const range = this.getRange();
    this.props.loadNearByPosts(position, range);
  }
  getMapRef = (map) => {
    this.map = map;
  }

  getRange = () => {
    const google = window.google;
    const center = this.map.getCenter();
    const bounds = this.map.getBounds();
    if (center && bounds) {
      const ne = bounds.getNorthEast();
      const right = new google.maps.LatLng(center.lat(), ne.lng());
      return 0.001 * google.maps.geometry.spherical.computeDistanceBetween(center, right);
    }
  }


  render() {
    const pos = JSON.parse(localStorage.getItem(POST_KEY));
    return (
      <GoogleMap
        ref={this.getMapRef}
        onZoomChanged={this.reloadMarkers}
        onDragEnd={this.reloadMarkers}
        defaultZoom={11}
        defaultCenter={{ lat: pos.lat, lng: pos.lon}}
      >
        {this.props.posts ? this.props.posts.map((post)=> <AroundMarker key={`${post.url}`} post={post}/>) : null}
      </GoogleMap>
    );
  }
}

export const WrappedAroundMap = withScriptjs(withGoogleMap(AroundMap))