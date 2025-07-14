import React, { useEffect, useState } from 'react'
import styles from "./SelectWinner.module.css"
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar"
import Header from "../../../components/Header/Header"
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import baseUrl from '../../../baseurl'


const dummyContest = [
    { id: 1, name: "Contest One", email: "contest1@example.com" },
    { id: 2, name: "Contest Two", email: "contest2@example.com" },
    { id: 3, name: "Contest Three", email: "contest3@example.com" },
    { id: 4, name: "Contest Four", email: "contest4@example.com" },
    { id: 5, name: "Contest Five", email: "contest5@example.com" },
    { id: 6, name: "Contest Six", email: "contest6@example.com" },
];


function SelectWinner() {
    const [contest,setContest]=useState()
    const navigate = useNavigate()
    const navigation = (id) => {
        navigate(`/ContestGamification/${id}`)
    }
const getContest=async()=>{
    try {
        const res=await axios.get(`${baseUrl}/api/v1/super-admin/contests`)
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