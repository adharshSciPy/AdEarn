import React from 'react'
import styles from './AdminSettings.module.css'
import Sidebar from '../../../components/sidebar/Sidebar'
import Header from '../../../components/Header/Header'
import { Button, Tabs } from 'antd'
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';
import { Row, Col, Input } from 'antd';

const { Dragger } = Upload;

function AdminSettings() {
    const onChange = key => {
        console.log(key);
    };

    const items = [
        {
            key: '1',
            label: 'My Details',
            children: (
                <form className={styles.form}>
                    <div className={styles.row}>
                        <div className={styles.inputGroup}>
                            <label>First name</label>
                            <Input placeholder="Killan" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Last name</label>
                            <Input placeholder="James" />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Email</label>
                        <Input type="email" placeholder="killanjames@gmail.com" />
                    </div>

                    <div className={styles.uploadArea}>
                        <Dragger
                            name="file"
                            multiple={false}
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            style={{ padding: '20px' }}
                        >
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">
                                Click to upload or drag and drop
                            </p>
                            <p className="ant-upload-hint">
                                SVG, PNG, JPG or GIF (max, 800x400px)
                            </p>
                        </Dragger>
                    </div>
                </form>
            ),
        },
        {
            key: '2',
            label: 'Profile',
            children: 'Content of Tab Profile',
        },
        {
            key: '3',
            label: 'Password',
            children: 'Content of Tab Password',
        },
        {
            key: '4',
            label: 'Notification',
            children: 'Content of Tab Notification',
        },
    ];

    return (
        <div className={styles.adminmain}>
            <div className={styles.adminsettingscontainermain}>
                <Sidebar />
                <Header />
                <div className={styles.settings}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.settingimg}>
                        <h1>Settings</h1>
                        <div className={styles.head}>
                            <div className={styles.headdesign}></div>
                            <div className={styles.profileimg}></div>
                        </div>
                        <div className={styles.actionbuttons}>
                            <Button>Cancel</Button>
                            <Button style={{ backgroundColor: "#693bb8", color: "white" }}>Save</Button>
                        </div>
                        <div className={styles.tabs}>
                            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminSettings