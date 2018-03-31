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
        this.onSuccessGetGeoLocation,
        GEO_OPTIONS
      );
    } else {

    }
  }

  onSuccessGetGeoLocation = (position) => {
    this.setState({loadingGeoLocation: false, error: ''});

    console.log(position);
    // const {latitude,longtitude}  = position.coords;
    // localStorage.setItem(POST_KEY, JSON.stringify({lat: latitude, lon: longtitude}));
    //
    //
    const lat = 37.7915953;
    const lon = -122.3937977;
    localStorage.setItem(POST_KEY, JSON.stringify({lat, lon}));
    this.loadNearByPosts(position);
  }
  onFailedGeoLocation = (error) => {
    this.setState({loadingGeoLocation: false, error: 'failed to load geolocation'});
    console.log(error);
  }

  getGalleryPanelConetent = () => {
    if (this.state.error) {
      return <div>{this.state.error}</div>
    } else if (this.state.loadingGeoLocation) {
      return <Spin tip="Loading geo location..."></Spin>
    } else if (this.state.loadingPosts){
      return <Spin tip="Loading posts..."></Spin>
    } else {
      //console.log("start log posts")
      //console.log(this.state.posts.length);
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
    const lat = 37.535623;
    const lon = -122.26956;
    this.setState({loadingPosts: true});
    $.ajax({
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
    const operations = <CreatePostButton type="primary">Create New Post</CreatePostButton>;
    return (
      <Tabs tabBarExtraContent={operations} className="main-tabs">
        <TabPane tab="Posts" key="1">
          {this.getGalleryPanelConetent()}
        </TabPane>
        <TabPane tab="Map" key="2">Content of tab 2</TabPane>
      </Tabs>
    );
  }
}
