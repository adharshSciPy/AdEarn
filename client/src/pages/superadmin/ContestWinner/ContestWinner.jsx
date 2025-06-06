import React, { useState } from 'react'
import styles from "./Contestwinner.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from "../../../components/Header/Header"
import { Button, Modal } from 'antd'

function ContestWinner() {
    const contestwinner = [
        { id: 1, contestName: "Contest 1", winnerName: "Vishva K", endDate: "02/06/2025", price: 20000, totalEntry: "1200/1200", payoutAmount: 1000 },
        { id: 2, contestName: "Contest 2", winnerName: "Sanju TL", endDate: "03/06/2025", price: 20000, totalEntry: "1200/1200", payoutAmount: 2000 },
        { id: 3, contestName: "Contest 3", winnerName: "Adithya A", endDate: "04/06/2025", price: 20000, totalEntry: "1200/1200", payoutAmount: 1500 },
        { id: 4, contestName: "Contest 3", winnerName: "Gokul S", endDate: "05/06/2025", price: 20000, totalEntry: "1200/1200", payoutAmount: 1000 }
    ]

    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState();
    const [selectedWinner, setSelectedWinner] = useState(null);

    const showModal = (winner) => {
        setSelectedWinner(winner);
        setOpen(true);
    };
    const handleOk = () => {
        setModalText('The modal will be closed after two seconds');
        setConfirmLoading(true);
        setTimeout(() => {
            setOpen(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setOpen(false);
    };

    return (
        <div className={styles.winnermain}>
            <div className={styles.winnercontainer}>
                <SuperSidebar />
                <Header />
                <div className={styles.winner}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.winnerimage}>
                        <div className={styles.winnerheading}>
                            <h1>Contest Winner</h1>
                            <Button>Log</Button>
                        </div>
                        <div className={styles.winnertable}>
                            <table style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th>Contest Name</th>
                                        <th>Winner Name</th>
                                        <th>Price</th>
                                        <th>End Date</th>
                                        <th>Total Entry</th>
                                        <th>Payout Amount</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        contestwinner.map((winner, index) => (
                                            <tr>
                                                <td>{winner.contestName}</td>
                                                <td>{winner.winnerName}</td>
                                                <td>{winner.price}</td>
                                                <td>{winner.endDate}</td>
                                                <td>{winner.totalEntry}</td>
                                                <td>{winner.payoutAmount}</td>
                                                <td><Button onClick={() => showModal(winner)}>Redeem Now</Button></td>
                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>
                            <Modal
                                className={styles.modaltext}
                                title="Are you want to do this payout?"
                                open={open}
                                onOk={handleOk}
                                confirmLoading={confirmLoading}
                                onCancel={handleCancel}
                            >
                                {selectedWinner && (
                                    <div className={styles.modalcontent}>
                                        <b>{selectedWinner.contestName}</b>
                                        <b>{selectedWinner.winnerName}</b>
                                        <b>₹ {selectedWinner.price}</b>
                                        <b>{selectedWinner.endDate}</b>
                                        <b>₹ {selectedWinner.payoutAmount}</b>
                                    </div>
                                )}
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContestWinner