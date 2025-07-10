import React, { useState, useEffect } from 'react'
import styles from './SubscriptionModal.module.css'
import { Button, Modal } from 'antd';
import axios from 'axios'
import baseUrl from '../../baseurl';
import { useSelector } from 'react-redux';

function SubscriptionModal() {

    const token = useSelector((state) => state.user.token)
    const [data, setData] = useState({})

    const [isModalOpen, setIsModalOpen] = useState(true);
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        });
    };


    useEffect(() => {
        const fetchSubscription = async () => {
            try {
                const response = await axios.get(`${baseUrl}/api/v1/subscription/get-subscriptions`);
                setData(response.data.settings)
                console.log("vada", response)
            } catch (error) {
                console.log(error)
            }
        }

        fetchSubscription()
    }, [])

    const renewAccount = async () => {
        try {

            const response = await axios.post(
                `${baseUrl}/api/v1/user/activate-subscription`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("Renewed:", response.data);
            // Show success toast/message here if needed

            setIsModalOpen(false); // close modal on success
        } catch (error) {
            console.error("Error renewing account:", error);
            // Show error toast/message here if needed
        }
    };


    return (
        <div className={styles.div}>
            <Modal
                title="Subscription"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={renewAccount}
                onCancel={handleCancel}
            >
                <div className={styles.getsubscrip}>
                    <p>{formatDate(data.createdAt)}</p>
                    <p>{data.starCountRequired}</p>
                    <p>{data.subscriptionDurationDays} days</p>
                </div>
                <div>Do you want to renew your account ?</div>
            </Modal>

        </div>
    )
}

export default SubscriptionModal