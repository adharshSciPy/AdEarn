import React, { useEffect, useState } from 'react'
import styles from "./SelectWinner.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from "../../../components/Header/Header"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import baseUrl from '../../../baseurl'



function SelectWinner() {
    const [contest,setContest]=useState([])
    const navigate = useNavigate()
    const navigation = (id) => {
        navigate(`/ContestGamification/${id}`)
    }
const getContest=async()=>{
    try {
        const res=await axios.get(`${baseUrl}/api/v1/super-admin/manual-contests/active`)
        console.log(res);
        setContest(res.data.contests)
    } catch (error) {
        
    }
}
useEffect(()=>{getContest()},[])
    return (
        <div className={styles.selectwinner}>
            <div className={styles.selectedwinnermain}>
                <SuperSidebar />
                <Header />
                <div className={styles.selectedcontainer}>
                    <div style={{ width: '100%', maxWidth: '1550px', height: '600px', padding: '30px' }} className={styles.contestimage}>
                        <h1>Select Contest</h1>
                        <div className={styles.cardGrid}>
                            {contest.map(user => {
                                return (
                                    <div
                                        key={user.id}
                                        className={styles.userCard}
                                        onClick={() => navigation(user.id)}
                                    >
                                        <h2>{user.contestName}</h2>
                                        <p>{user.contestNumber}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SelectWinner