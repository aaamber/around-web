import React from 'react';
import {WrapperCreatePostForm} from "./CreatePostForm"
import { Modal, Button, message} from 'antd';
import $ from 'jquery';
import {API_ROOT, AUTH_PREFIX, TOKEN_KEY,POST_KEY } from "../constants"

export class CreatePostButton extends React.Component {
  state = {
    ModalText: 'Content of the modal',
    visible: false,
    confirmLoading: false,
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleOk = () => {
    this.setState({ confirmLoading: true});
    this.form.validateFields((err, values)=>{
      if (!err) {

        const { lat, lon } = JSON.parse(localStorage.getItem(POST_KEY)); // string to json object
        const formData = new FormData();
        formData.set('lat', lat);
        formData.set('lon', lon);
        formData.set('message', values.message);
        formData.set('image', values.image[0]);

        $.ajax({
          url:`${API_ROOT}/post`,
          method: 'POST',
          data: formData,
          headers: {
            Authorization: `${AUTH_PREFIX} ${localStorage.getItem(TOKEN_KEY)}`
          },
          processData: false,
          contentType: false,
          dataType: 'text',
        }).then(()=>{
          message.success('created a post');
          this.setState({
            visible: false,
            confirmLoading: false,
          });
          this.props.loadNearByPosts().then(() => {
            this.setState({ visible: false, confirmLoading: false });
          });
          // if return  a promise here, chained then() will wait the current promis
        }, (response)=>{
          console.log(response.responseText);
        }).catch((error)=>{
          console.log(error);
        });
      }

    });

  }
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }
  saveFormRef=(form) =>{
    this.form = form;
  }

  render() {
    const { visible, confirmLoading, ModalText } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>Create new post</Button>
        <Modal title="Create new post"
               visible={visible}
               onOk={this.handleOk}
               okText="Create"
               confirmLoading={confirmLoading}
               onCancel={this.handleCancel}
        >
          <WrapperCreatePostForm ref={this.saveFormRef}/>
        </Modal>
      </div>
    );
  }
}
// ref:after DOM renders, return a form instance and save the reference of new created wrappecreatepost form instance