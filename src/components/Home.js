import React from 'react';
import $ from 'jquery';
import {API_ROOT, GEO_OPTIONS, POST_KEY, AUTH_PREFIX, TOKEN_KEY} from "../constants"
import { Tabs, Button, Spin} from 'antd';
import {Gallery} from "./Gallery"
import {CreatePostButton} from "./CreatePostButton"


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

    }
  }

  onSuccessGetGeoLocation = (position) => {
    this.setState({loadingGeoLocation: false, error: ''});
    const { latitude, longitude } = position.coords;
    localStorage.setItem(POST_KEY, JSON.stringify({lat: latitude, lon: longitude}));
    this.loadNearByPosts(position);
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

  loadNearByPosts = (position)=> {
    // const lat = 37.535623;
    // const lon = -122.26956;
    const { lat, lon } = JSON.parse(localStorage.getItem(POST_KEY));

    this.setState({loadingPosts: true});
    // return a promise so that it can be used in createPostButton
    return $.ajax({
      url: `${API_ROOT}/search?lat=${lat}&lon=${lon}&range=20`,
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
        <TabPane tab="Map" key="2">Content of tab 2</TabPane>
      </Tabs>
    );
  }
}
