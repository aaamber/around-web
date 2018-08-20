import React from 'react';
import $ from 'jquery';
import {API_ROOT, GEO_OPTIONS, POST_KEY, AUTH_PREFIX, TOKEN_KEY} from "../constants"
import { Tabs, Spin} from 'antd';
import {Gallery} from "./Gallery"
import {CreatePostButton} from "./CreatePostButton"
import {WrappedAroundMap} from "./AroundMap"

const TabPane = Tabs.TabPane;


export class Home extends React.Component {

  state = {
    loadingPosts: false,
    loadingGeoLocation: false,
    error: '',
    posts: [],
  }

  getGeoLocation = ()=> {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        this.onSuccessGetGeoLocation,
        this.onFailedGeoLocation,
        GEO_OPTIONS
      );
    } else {
      this.setState({ error: 'Your browser does not support geolocation!'});
    }
  }

  onSuccessGetGeoLocation = (position) => {
    console.log(position);
    this.setState({loadingGeoLocation: false, error: ''});

    //const lat = 37.535623;
    //const lon = -122.26956;
    const { latitude: lat, longitude: lon } = position.coords;
    const location = { lat: lat, lon: lon };
    localStorage.setItem(POST_KEY, JSON.stringify(location));

    this.loadNearByPosts(location);
  }
  onFailedGeoLocation = (error) => {
    this.setState({loadingGeoLocation: false, error: 'failed to load geolocation'});
    console.log(error);
  }

  getGalleryPanelContent = () => {
    if (this.state.error) {
      return <div>{this.state.error}</div>
    } else if (this.state.loadingGeoLocation) {
      return <Spin tip="Loading geo location..."></Spin>
    } else if (this.state.loadingPosts){
      return <Spin tip="Loading posts..."></Spin>
    } else {

      if (this.state.posts && this.state.posts.length > 0) {

        const images = this.state.posts.map((post) => {
          return {
            user: post.user,
            src: post.url,
            thumbnail: post.url,
            caption: post.message,
            thumbnailWidth: 400,
            thumbnailHeight: 300
          }
        });
        return <Gallery images={images}/>
      } else {
        return null;
      }
    }
  }

  loadNearByPosts = (location, range)=> {
    const { lat, lon } = location ? location : JSON.parse(localStorage.getItem(POST_KEY));
    const radius = range ? range : 20;
    this.setState({loadingPosts: true});
    // return a promise so that it can be used in createPostButton
    return $.ajax({
      url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=${radius}`,
      method: 'GET',
      headers: {
        Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
      }
    }).then((response)=>{
      console.log(response);

      this.setState({posts: response, loadingPosts: false, error:''});
    }, (response)=>{
      this.setState({loadingPosts: false, error: response.responseText});
      console.log(response.responseText);
    }).catch((error)=>{
      console.log(error);
    });
  }

  componentDidMount() {
    this.setState({loadingGeoLocation:true});
    this.getGeoLocation();
  }

  render(){
    const operations = <CreatePostButton type="primary" loadNearByPosts={this.loadNearByPosts}>Create New Post</CreatePostButton>;
    return (
      <Tabs tabBarExtraContent={operations} className="main-tabs">
        <TabPane tab="Posts" key="1">
          {this.getGalleryPanelContent()}
        </TabPane>
        <TabPane tab="Map" key="2"><WrappedAroundMap

          googleMapURL="https://maps.googleapis.com/maps/api/js?key=AIzaSyB86hB8rPNndtWYzDTFo0gyqz8XlXGSGY4&v=3.exp&libraries=geometry,drawing,places"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
          posts={this.state.posts}
          loadNearByPosts={this.loadNearByPosts}
        /></TabPane>
      </Tabs>
    );
  }
}
