import React from "react";

import { useState } from "react";
import styles from "./Report.module.css";
import edit from "../../../assets/edit.png";
import Duplicate from "../../../assets/copy.png";
import report from "../../../assets/report.png";
import generatePdf from "../Pdfgenerator/PdfGenerator";
import Chart from "react-apexcharts";
import Navbar from "../NavBar/Navbar";

function ReportPageUser() {
  const [toggleStates, setToggleStates] = useState({});

  const tableData = [
    {
      id: 1,
      name: "John Doe",
      age: 28,
      email: "Video Ad",
      phone: "100",
      address: "2000",
      city: "New York",
      state: "300",
      country: "ongoing",
    },
    {
      id: 2,
      name: "Jane Smith",
      age: 32,
      email: "Image Ad",
      phone: "1000",
      address: "2500",
      city: "Los Angeles",
      state: "200",
      country: "outgoing",
    },
{
      id: 3,
      name: "John Doe",
      age: 28,
      email: "Video Ad",
      phone: "100",
      address: "2000",
      city: "New York",
      state: "300",
      country: "ongoing",
    },
    {
      id: 4,
      name: "Jane Smith",
      age: 32,
      email: "Image Ad",
      phone: "1000",
      address: "2500",
      city: "Los Angeles",
      state: "200",
      country: "outgoing",
    },{
      id: 5,
      name: "John Doe",
      age: 28,
      email: "Video Ad",
      phone: "100",
      address: "2000",
      city: "New York",
      state: "300",
      country: "ongoing",
    },
    {
      id: 6,
      name: "Jane Smith",
      age: 32,
      email: "Image Ad",
      phone: "1000",
      address: "2500",
      city: "Los Angeles",
      state: "200",
      country: "outgoing",
    },{
      id: 7,
      name: "John Doe",
      age: 28,
      email: "Video Ad",
      phone: "100",
      address: "2000",
      city: "New York",
      state: "300",
      country: "ongoing",
    },
    {
      id: 8,
      name: "Jane Smith",
      age: 32,
      email: "Image Ad",
      phone: "1000",
      address: "2500",
      city: "Los Angeles",
      state: "200",
      country: "outgoing",
    },
  ];

  const chartLabels = tableData.map((item) => `${item.name} (${item.email})`);
  const chartSeries = tableData.map((item) => parseInt(item.phone));
  const chartOptions = {
    chart: {
      type: "donut",
    },
    labels: chartLabels,
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            total: {
              show: true,
              label: "Total Reach",
              formatter: () =>
                chartSeries.reduce((a, b) => a + b, 0).toString(),
            },
          },
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 300,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
    legend: {
      position: "right",
    },
  };

  return (
    <div>
      <Navbar/>
      <div className={styles.mainContainer}>
        <div className={styles.homeMainContainer}>
          <div className={styles.homeContainer}>
            <div className={styles.contentsContainer}>
              <div className={styles.firstContent}>
                <div className={styles.firstMain}>
                  <div className={styles.firstMainleftContainer}>
                    <div className={styles.firstMainHeader}>
                      <h2>Place Your Ads</h2>
                    </div>
                    <div className={styles.firstMainp}>
                      <p>
                        Providing cheap car rental services and safe and
                        comfortable facilities.
                      </p>
                    </div>
                    <div className={styles.firstMainbutton}>
                      <button>Place Ads</button>
                    </div>
                  </div>

                  <div className={styles.firstMainrightContainer}>
                    <div className={styles.firstImageContainer}>
                      <div className={styles.firstImageContainerMain}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chart Section */}
            <div className={styles.ChartContainer}>
              <div className={styles.ChartChild}>
                <div className={styles.AdCountContainer}>
                  <div className={styles.Adheading}><h3>Total Ads</h3></div>
                  <div className={styles.AdNumber}>
                    <h2>{tableData.length}</h2> 
                  </div>
                </div>
              </div>
              <div className={styles.ChartChild}>
                <div className={styles.AdCountContainer}>
                  <div className={styles.Adheading}><h3>Total Star Spent</h3></div>
                  <div className={styles.AdNumber}>
                    <h2>
                      {tableData.reduce(
                        (total, item) => total + parseInt(item.address),
                        0
                      )}
                    </h2>
                  </div>
                </div>
              </div>
              <div className={styles.ChartChildLast}>
                <div className={styles.AdCountContainer}>
                  <div className="donut">
                    <div className={styles.Adheading}><h3>Total Reach</h3></div>
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="donut"
                      width="380"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Table Section */}
            <div className={styles.tableContainer}>
              <div className={styles.tableMain}>
                <div className={styles.buttonsContainer}>
                  <div className={styles.reportButtonContainer}>
                    <button style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ height: "20px", width: "35px" }}>
                        <img src={report} alt="" className={styles.img} />
                      </span>
                      Reports
                    </button>
                  </div>
                </div>
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{ borderCollapse: "collapse", width: "100%" }}
                    className={styles.tableSub}
                  >
                    <thead>
                      <tr>
                        <th></th>
                        <th>Ads Name</th>
                        <th>Ads Type</th>
                        <th>Total Reach</th>
                        <th>Total Views</th>
                        <th>Status</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((row) => (
                        <tr key={row.id}>
                          <td>
                            <input type="checkbox" className={styles.tick} />
                          </td>
                          <td className={styles.tdBorder}>
                            <div className={styles.tdMainContainer}>
                              <div className={styles.topTd}>
                                <p>{row.name}</p>
                                <button className={styles.tdButton}>
                                  <span
                                    style={{
                                      height: "12px",
                                      width: "10px",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    <img
                                      className={styles.img}
                                      src={edit}
                                      alt=""
                                    />
                                  </span>
                                </button>
                              </div>
                              <div className={styles.bottomTd}>
                                <button className={styles.tdButton}>
                                  <p>Duplicate</p>
                                  <span
                                    style={{
                                      height: "12px",
                                      width: "8px",
                                      marginLeft: "5px",
                                    }}
                                  >
                                    <img
                                      className={styles.img}
                                      src={Duplicate}
                                      alt=""
                                    />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </td>
                          <td>{row.email}</td>
                          <td>{row.phone}</td>
                          <td>{row.address}</td>
                          <td
                            style={{
                              color: toggleStates[row.id] ? "green" : "red",
                              fontWeight: "bold",
                              textAlign: "center",
                            }}
                          >
                            {toggleStates[row.id] ? "Ongoing" : "Paused"}
                          </td>
                          <td>
                            <button
                              className={styles.downloadLink}
                              onClick={() => generatePdf(row)}
                            >
                              Download
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            {/* End table section */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportPageUser;
