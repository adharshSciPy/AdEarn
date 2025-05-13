import React, { useState } from 'react'
import styles from "./header.module.css"
import { SearchOutlined, BellOutlined } from '@ant-design/icons';
import { Avatar, Input } from 'antd';

function Header() {
    const [showSearch, setShowSearch] = useState(false);

    return (
        <div className={styles.header}>
            <div className={styles.headermain}>
                <div className={styles.sectionone}>
                    {showSearch ? (
                        <Input.Search
                            placeholder="Search..."
                            allowClear
                            onBlur={() => setShowSearch(false)} // Hide when focus is lost
                            autoFocus
                            style={{ width: 200 }}
                        />
                    ) : (
                        <SearchOutlined
                            style={{ fontSize: '20px', cursor: 'pointer' }}
                            onClick={() => setShowSearch(true)}
                        />
                    )}

                </div>
                <div className={styles.headercontainer}>
                    <div className={styles.sectiontwo}>
                        <Avatar shape="circle" src="https://i.pravatar.cc/300" />
                        <BellOutlined style={{ fontSize: '20px' }} />
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Header