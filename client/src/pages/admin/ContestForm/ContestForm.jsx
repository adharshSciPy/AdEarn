import React from 'react'
import styles from "./ContestForm.module.css"
import Sidebar from "../../../components/sidebar/Sidebar"
import Header from "../../../components/Header/Header"
import { Input, Button, message, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons';

function ContestForm() {
    const props = {
        name: 'file',
        action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
        headers: {
            authorization: 'authorization-text',
        },
        onChange(info) {
            if (info.file.status !== 'uploading') {
                console.log(info.file, info.fileList);
            }
            if (info.file.status === 'done') {
                message.success(`${info.file.name} file uploaded successfully`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} file upload failed.`);
            }
        },
    };
    return (
        <div className={styles.contestformmain}>
            <div className={styles.contestformcontainer}>
                <Sidebar />
                <Header />
                <div className={styles.contestform}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.formpage}>
                        <h1>Contest Form</h1>
                        <div className={styles.contestformpage}>
                            <label>Enter Contest Name</label>
                            <Input type='text' style={{ maxWidth: 500 }} />
                            <label>Enter Contest Number</label>
                            <Input type='number' style={{ maxWidth: 500 }} />
                            <label>Enter Start Date</label>
                            <Input type='date' style={{ maxWidth: 500 }} />
                            <label>Enter Total Entry</label>
                            <Input type='text' style={{ maxWidth: 500 }} />
                            <div className={styles.uploadbutton}>
                                <Upload {...props}>
                                    <Button style={{ color: "white" }} icon={<UploadOutlined />}>Upload</Button>
                                </Upload>
                            </div>
                            <div className={styles.actionbuttons}>
                                <Button>Cancel</Button>
                                <Button style={{ backgroundColor: "#693bb8", color: "white" }}>Submit</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContestForm