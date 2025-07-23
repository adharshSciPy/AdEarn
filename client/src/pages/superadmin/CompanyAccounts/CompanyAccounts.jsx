import React, { useEffect, useState } from "react";
import styles from "./CompanyAccounts.module.css";
import SuperSidebar from "../../../components/SuperAdminSideBar/SuperSidebar";
import Header from "../../../components/Header/Header";
import { Modal, Input, Form, message } from "antd";
import {
  FileTextOutlined,
  TagOutlined,
  UserAddOutlined,
  ProjectOutlined,
} from "@ant-design/icons";
import { Button } from "antd";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import axios from "axios";
import baseUrl from "../../../baseurl";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Filler,
  Tooltip,
  Legend
);

function CompanyAccounts() {
  const data = {
    labels: ["0", "10k", "20k", "30k", "40k", "50k", "60k"],
    datasets: [
      {
        label: "Total Accounts",
        data: [10, 10, 20, 35, 40, 50, 60],
        fill: true,
        backgroundColor: "rgba(192, 132, 252, 0.2)",
        borderColor: "rgba(192, 132, 252, 1)",
        tension: 0.4,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [4, 4],
        },
      },
    },
  };

  const transactions = [
    { id: 1, stars: 1000, amount: 200 },
    { id: 2, stars: 1500, amount: 300 },
    { id: 3, stars: 2000, amount: 400 },
  ];

  const [datawallet, setDatawallet] = useState([]);
  const [received, setReceived] = useState(0);
  const [spent, setSpent] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState("");
  const [payoutNote, setPayoutNote] = useState("");

  const showModal = () => setIsModalOpen(true);

  useEffect(() => {
    const companyStar = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/api/v1/super-admin/superadmin-wallet`
        );
        console.log(response);
        setDatawallet(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    companyStar();
  }, []);

  useEffect(() => {
    const fetchAmounts = async () => {
      try {
        const [spentRes, receivedRes] = await Promise.all([
          axios.get(`${baseUrl}/api/v1/super-admin/total-stars/given`),
          axios.get(`${baseUrl}/api/v1/super-admin/total-stars/received`),
        ]);

        const spentAmount = spentRes?.data?.totalAmountInRupees || 0;
        const receivedAmount = receivedRes?.data?.totalAmountInRupees || 0;

        setSpent(spentAmount);
        setReceived(receivedAmount);

        console.log("Spent Amount:", spentRes);
        console.log("Received Amount:", receivedRes);
      } catch (error) {
        console.error("Error fetching amounts:", error);
      }
    };

    fetchAmounts();
  }, []);
const handlePayout = async () => {
//   try {
//     if (!payoutAmount || isNaN(payoutAmount)) {
//       return message.error("Please enter a valid amount.");
//     }

//     // Example payload (adjust according to your backend)
//     const payload = {
//       amount: Number(payoutAmount),
//       note: payoutNote,
//     };

//     const res = await axios.post(`${baseUrl}/api/v1/super-admin/payout`, payload);
//     if (res.status === 200) {
//       message.success("Payout successful!");
//       setIsModalOpen(false);
//       setPayoutAmount("");
//       setPayoutNote("");
//     }
//   } catch (err) {
//     console.error(err);
//     message.error("Something went wrong during payout.");
//   }
};
const handleCancel = () => {
  setIsModalOpen(false);
  setPayoutAmount("");
  setPayoutNote("");
};
  return (
    <div className={styles.accountsmain}>
      <div className={styles.accountscontainer}>
        <SuperSidebar />
        <Header />
        <div className={styles.accountsgraph}>
          <div
            style={{
              width: "100%",
              maxWidth: "1550px",
              height: "600px",
              padding: "30px",
            }}
            className={styles.accountimage}
          >
            <div className={styles.logbutton}>
              <Button>Log</Button>
            </div>
            {/* <div className={styles.companygraph}>
                            <Line data={data} options={options} />
                        </div> */}
            <div className={styles.accountshead}>
              <h1>Accounts</h1>
            </div>

            <div className={styles.estimatesection}>
              <div className={styles.estimatelist}>
                <h1>Total Amount</h1>
              </div>
              <div className={styles.amountlist}>
                <h1>Total Received: ₹ {received}</h1>
                <h1>Total Given: ₹ {spent}</h1>
              </div>
              <div className={styles.estimatetotal}>
                <h1>₹ {received - spent}</h1>
                <button className={styles.addStar} onClick={showModal}>
                  Payout
                </button>
              </div>
            </div>

            <div className={styles.cards}>
              <div className={styles.cardone}>
                <div className={styles.cardoneTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCircle}>
                    <FileTextOutlined
                      style={{ fontSize: 20, color: "white" }}
                    />
                  </div>
                </div>
                <h3>Ads</h3>
                <h4>
                  &#8377; {datawallet.adExtraDeductionsTotalAmountInRupees}
                </h4>
                <p>+5% from yesterday</p>
              </div>
              <div className={styles.cardthree}>
                <div className={styles.cardthreeTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCirclePurple}>
                    <UserAddOutlined style={{ fontSize: 20, color: "white" }} />
                  </div>
                </div>
                <h3>Users</h3>
                <h4>&#8377; {datawallet.userEntryTotalAmountInRupees}</h4>
                <p>+0,5% from yesterday</p>
              </div>
              <div className={styles.cardfour}>
                <div className={styles.cardfourTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCircleBlue}>
                    <ProjectOutlined style={{ fontSize: 20, color: "white" }} />
                  </div>
                </div>
                <h3>Payouts</h3>
                <h4>&#8377; demo</h4>
                <p>+8% from yesterday</p>
              </div>
              <div className={styles.cardfour}>
                <div className={styles.cardfourTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCircleBlue}>
                    <ProjectOutlined style={{ fontSize: 20, color: "white" }} />
                  </div>
                </div>
                <h3>Company accounts</h3>
                <h4>&#8377; {datawallet.totalAmountInRupees}</h4>
                <p>+8% from yesterday</p>
              </div>
              <div className={styles.cardone}>
                <div className={styles.cardoneTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCircle}>
                    <FileTextOutlined
                      style={{ fontSize: 20, color: "white" }}
                    />
                  </div>
                </div>
                <h3>Admin accounts</h3>
                <h4>&#8377; demo</h4>
                <p>+5% from yesterday</p>
              </div>
              <div className={styles.cardfour}>
                <div className={styles.cardfourTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCircleBlue}>
                    <ProjectOutlined style={{ fontSize: 20, color: "white" }} />
                  </div>
                </div>
                <h3>Welcome Bonus</h3>
                <h4>
                  &#8377; {datawallet.welcomeBonusLogsTotalAmountInRupees}
                </h4>
                <p>+8% from yesterday</p>
              </div>
              <div className={styles.cardthree}>
                <div className={styles.cardthreeTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCirclePurple}>
                    <UserAddOutlined style={{ fontSize: 20, color: "white" }} />
                  </div>
                </div>
                <h3>Referral Bonus</h3>
                <h4>&#8377; demo</h4>
                <p>+0,5% from yesterday</p>
              </div>
              <div className={styles.cardtwo}>
                <div className={styles.cardtwoTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCircleGreen}>
                    <TagOutlined style={{ fontSize: 20, color: "white" }} />
                  </div>
                </div>
                <h3>Contest</h3>
                <h4>&#8377; {datawallet.contestCollectedAmountInRupees}</h4>
                <p>+1,2% from yesterday</p>
              </div>
              <div className={styles.cardthree}>
                <div className={styles.cardthreeTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCirclePurple}>
                    <UserAddOutlined style={{ fontSize: 20, color: "white" }} />
                  </div>
                </div>
                <h3>Coupons</h3>
                <h4>
                  &#8377; {datawallet.couponGenerationTotalAmountInRupees}
                </h4>
                <p>+0,5% from yesterday</p>
              </div>
              <div className={styles.cardfour}>
                <div className={styles.cardfourTop}></div>
                <div className={styles.iconWrapper}>
                  <div className={styles.iconCircleBlue}>
                    <ProjectOutlined style={{ fontSize: 20, color: "white" }} />
                  </div>
                </div>
                <h3>Subscription</h3>
                <h4>&#8377; {datawallet.subscriptionAmountInRupeesUsed}</h4>
                <p>+8% from yesterday</p>
              </div>
            </div>

            <div className={styles.table}>
              <div className={styles.tabletitle}>
                <h2>Recent Transactions</h2>
              </div>
              <div className={styles.tablesection}>
                <table>
                  <thead>
                    <tr>
                      <td>Redeem star count</td>
                      <td>Amount</td>
                      <td>Export</td>
                      <td>Delete</td>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((txn) => (
                      <tr key={txn.id}>
                        <td>{txn.stars}</td>
                        <td>₹ {txn.amount}</td>
                        <td>
                          <a href="#">Download</a>
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              console.log(`Delete transaction ${txn.id}`)
                            }
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "red",
                              cursor: "pointer",
                              fontSize: "16px",
                            }}
                          >
                            🗑
                          </button>
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
      <Modal
  title="Make a Payout"
  open={isModalOpen}
  onOk={handlePayout}
  onCancel={handleCancel}
  okText="Submit"
>
  <Form layout="vertical">
    <Form.Item label="Amount (₹)" required>
      <Input
        type="number"
        placeholder="Enter amount"
        value={payoutAmount}
        onChange={(e) => setPayoutAmount(e.target.value)}
      />
    </Form.Item>
    <Form.Item label="Note">
      <Input.TextArea
        placeholder="Optional note"
        value={payoutNote}
        onChange={(e) => setPayoutNote(e.target.value)}
      />
    </Form.Item>
  </Form>
</Modal>

    </div>
  );
}

export default CompanyAccounts;
