import React from 'react';
import {GEO_OPTIONS, POST_KEY} from "../constants"
import { Tabs, Button, Spin} from 'antd';
const TabPane = Tabs.TabPane;



export class Home extends React.Component {

  state = {
    loadingGeoLocation: false,
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
    this.setState({loadingGeoLocation: false});
    console.log(position);
    const {latitude,longtitude}  = position.coords;
    localStorage.setItem(POST_KEY, JSON.stringify({lat: latitude, lon: longtitude}));
  }
  onFailedGeoLocation = (error) => {
    this.setState({loadingGeoLocation: false});
    console.log(error);
  }


  componentDidMount() {
    this.setState({loadingGeoLocation:true});
    this.getGeoLocation();
  }

  render(){
    const operations = <Button type="primary">Create New Post</Button>;
    return (
      <Tabs tabBarExtraContent={operations} className="main-tabs">
        <TabPane tab="Posts" key="1">
          {this.state.loadingGeoLocation ?   <Spin tip="Loading..."></Spin> : null}
        </TabPane>
        <TabPane tab="Map" key="2">Content of tab 2</TabPane>
      </Tabs>
    );
  }
}
