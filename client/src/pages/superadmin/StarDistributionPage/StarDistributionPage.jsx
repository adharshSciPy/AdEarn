import React from 'react'
import styles from "./StarDistributionPage.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from "../../../components/Header/Header"
import { Button } from 'antd'
import { FileTextOutlined, TagOutlined, UserAddOutlined, ProjectOutlined } from "@ant-design/icons"


function StarDistributionPage() {
    return (
        <div className={styles.stardistributionmain}>
            <div className={styles.stardistributioncontainer}>
                <SuperSidebar />
                <Header />
                <div className={styles.distributionsection}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.starimage}>
                        <div className={styles.distributionhead}>
                            <h1>Star Distribution</h1>
                            <Button>Log</Button>
                        </div>
                        <div className={styles.totalstardistribution}>
                            <h3>Total Stars</h3>
                            <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                            <div className={styles.starpargraph}>
                                <p>Company account</p>
                                <p>+8% from yesterday</p>
                            </div>
                        </div>
                        <div className={styles.cards}>
                            <div className={styles.cardfour}>
                                <div className={styles.cardfourTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircleBlue}>
                                        <ProjectOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                                <h4>Users</h4>
                                <p>+8% from yesterday</p>
                            </div>
                            <div className={styles.cardtwo}>
                                <div className={styles.cardtwoTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircleGreen}>
                                        <TagOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>

                                </div>
                                <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                                <h4>Company account</h4>
                                <p>+1,2% from yesterday</p>
                            </div>
                            <div className={styles.cardthree}>
                                <div className={styles.cardthreeTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCirclePurple}>
                                        <UserAddOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                                <h4>Admin account</h4>
                                <p>+0,5% from yesterday</p>
                            </div>
                            <div className={styles.cardfour}>
                                <div className={styles.cardfourTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircleBlue}>
                                        <ProjectOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                                <h4>Welcome bonus</h4>
                                <p>+8% from yesterday</p>
                            </div>
                            <div className={styles.cardthree}>
                                <div className={styles.cardthreeTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCirclePurple}>
                                        <UserAddOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                                <h4>Referral code</h4>
                                <p>+0,5% from yesterday</p>
                            </div>
                            <div className={styles.cardfour}>
                                <div className={styles.cardfourTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCircleBlue}>
                                        <ProjectOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                                <h4>Contest</h4>
                                <p>+8% from yesterday</p>
                            </div>
                            <div className={styles.cardthree}>
                                <div className={styles.cardthreeTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCirclePurple}>
                                        <UserAddOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                                <h4>Coupons</h4>
                                <p>+0,5% from yesterday</p>
                            </div>
                            <div className={styles.cardthree}>
                                <div className={styles.cardthreeTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCirclePurple}>
                                        <UserAddOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                                <h4>Subscriptions</h4>
                                <p>+0,5% from yesterday</p>
                            </div>
                            <div className={styles.cardthree}>
                                <div className={styles.cardthreeTop}></div>
                                <div className={styles.iconWrapper}>
                                    <div className={styles.iconCirclePurple}>
                                        <UserAddOutlined style={{ fontSize: 20, color: 'white' }} />
                                    </div>
                                </div>
                                <h3><span style={{ color: 'gold', fontSize: '24px' }}>★</span>20000</h3>
                                <h4>Ads</h4>
                                <p>+0,5% from yesterday</p>
                            </div>
                           
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StarDistributionPage