import React from 'react';
import {Form, Input, Upload, Icon} from "antd/lib/index"



const FormItem = Form.Item;

class CreatePostForm extends React.Component {

  normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList; // Boolean(e) ? e.fileList : e; if e exist, return e.fileList not a boolean
  }

  beforeUpload = () => {
    return false;
  }

  render() {
    const { getFieldDecorator } = this.props.form; // a high order function that can return a high order function
    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };
    return (
      <Form layout="vertical">
        <FormItem  {...formItemLayout} label="Message">

          {getFieldDecorator('message', {
            rules: [{ required: true, message: 'Please input message!' }],
          })(
            <Input />
          )}
        </FormItem>
        <FormItem
          {...formItemLayout}
          label="Image"
        >
          <div className="dropbox">
            {getFieldDecorator('image', {
              rules: [{ required: true, message: 'Please select an image.' }],
              valuePropName: 'fileList',
              getValueFromEvent: this.normFile,
            })(
              <Upload.Dragger name="files" action="/upload.do"  beforeUpload={this.beforeUpload}>
                <p className="ant-upload-drag-icon">
                  <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
                <p className="ant-upload-hint">Support for a single or bulk upload.</p>
              </Upload.Dragger>
            )}
          </div>
        </FormItem>

      </Form>
    );
  }
}

export const WrapperCreatePostForm = Form.create()(CreatePostForm);
// this.post.form is a prop of WrapperCreatePost