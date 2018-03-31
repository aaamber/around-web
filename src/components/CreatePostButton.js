import React from 'react';
import {WrapperCreatePostForm} from "./CreatePostForm"
import { Modal, Button } from 'antd';

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
    this.setState({
      ModalText: 'The modal will be closed after two seconds',
      confirmLoading: true,
    });
    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
      });
    }, 2000);
  }
  handleCancel = () => {
    console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
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
          <WrapperCreatePostForm/>
        </Modal>
      </div>
    );
  }
}
