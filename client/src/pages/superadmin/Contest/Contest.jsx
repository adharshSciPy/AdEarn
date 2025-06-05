import { React } from 'react'
import styles from "./Contest.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from "../../../components/Header/Header"
import { FileTextOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd'

function Contest() {
    const navigate = useNavigate()
    const contestData = [
        { id: 1, title: "Contest 1", date: "02/03/2025", entries: "1200/1500", type: "Manual Selection" },
        { id: 2, title: "Contest 2", date: "02/03/2025", entries: "1100/1500", type: "Machine Selection" },
        { id: 3, title: "Contest 3", date: "02/03/2025", entries: "1050/1500", type: "Machine Selection" },
        { id: 4, title: "Contest 4", date: "02/03/2025", entries: "1200/1500", type: "Machine Selection" },
    ];

    const contestdetails = [
        { id: 1, contestName: "Contest 1", entryStars: "1", entryDate: "01/05/2025", totalEntry: "1000/1200", status: "Ongoing", winner: "UserName" },
        { id: 2, contestName: "Contest 2", entryStars: "2", entryDate: "02/05/2025", totalEntry: "1050/1200", status: "Ongoing", winner: "UserName" },
        { id: 3, contestName: "Contest 3", entryStars: "3", entryDate: "03/05/2025", totalEntry: "1100/1200", status: "Ended", winner: "UserName" },
        { id: 4, contestName: "Contest 4", entryStars: "4", entryDate: "04/05/2025", totalEntry: "1200/1200", status: "Ongoing", winner: "UserName" },
    ];
    return (
        <div className={styles.contestmain}>
            <div className={styles.contestcontainer}>
                <SuperSidebar />
                <Header />
                <div className={styles.contestsection}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.contestimage}>
                        <div className={styles.contestheading}>
                            <h1>Contest</h1>
                            <Button>Log</Button>
                        </div>
                        <div className={styles.contestgrid}>
                            <div className={styles.sectionscontest}>
                                {contestData.map((contest) => (
                                    <div className={styles.contestcard} key={contest.id}>
                                        <div className={styles.cardheader}>
                                            <h4>{contest.title}</h4>
                                        </div>

                                        <div className={styles.contestlogo}>
                                            <div className={styles.iconcircle}><FileTextOutlined /></div>
                                            <p className={styles.contestdate}>{contest.date}</p>
                                        </div>

                                        <div className={styles.contestscore}>
                                            <h1>{contest.entries}</h1>
                                        </div>

                                        <div className={styles.field}>
                                            <p className={styles.entrydetails}>Entry details</p>
                                            <Button className={styles.selectbtn}>Select</Button>
                                        </div>

                                        <div className={styles.field}>
                                            <p className={styles.selectiontype}>{contest.type}</p>
                                            <Button className={styles.selectbtn}>Select</Button>
                                        </div>
                                        <Button className={styles.stopbtn}>Stop</Button>
                                    </div>
                                ))}

                            </div>
                            <div className={styles.createcontest}>
                                <Button onClick={() => navigate("/superadmincontestpage")}>Create</Button>
                            </div>
                            <div className={styles.contesttable}>
                                <table style={{ width: "100%", marginTop: "30px" }}>
                                    <thead>
                                        <tr>
                                            <th>Contest Name</th>
                                            <th>Entry Stars</th>
                                            <th>Entry Date</th>
                                            <th>Total Entry</th>
                                            <th>Status</th>
                                            <th>Winner</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contestdetails.map((value, index) => (
                                            <tr key={value.id}>
                                                <td>{value.contestName}</td>
                                                <td>{value.entryStars}</td>
                                                <td>{value.entryDate}</td>
                                                <td>{value.totalEntry}</td>
                                                <td>{value.status}</td>
                                                <td>{value.winner}</td>
                                                <td className={styles.action}>
                                                    <EditOutlined />
                                                    <DeleteOutlined style={{ color: "red" }} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contest