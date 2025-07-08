import React, { useEffect, useState } from "react";
import styles from "./SurveyResponses.module.css";
import axios from "axios";
import baseUrl from "../../../baseurl";
import { useParams } from "react-router-dom";
import Navbar from "../NavBar/Navbar";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SurveyResponses = () => {
  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const getSurveyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseUrl}/api/v1/ads/survey-stats/${id}`
      );
      setSurvey(response.data.stats);
    } catch (error) {
      console.error("Error fetching survey data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSurveyData();
  }, []);

  const getRandomColor = () => {
    const colors = [
      "#FF6384",
      "#36A2EB",
      "#FFCE56",
      "#4BC0C0",
      "#9966FF",
      "#FF9F40",
      "#8AC24A",
      "#F06292",
      "#7986CB",
      "#A1887F",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const renderQuestionChart = (question) => {
    const totalVotes = question.counts.reduce((a, b) => a + b, 0);
    const percentages = question.counts.map((count) =>
      totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100)
    );

    const data = {
      labels: question.options,
      datasets: [
        {
          label: "Votes",
          data: question.counts,
          backgroundColor: question.options.map(() => getRandomColor()),
          borderColor: question.options.map(() => "rgba(0,0,0,0.1)"),
          borderWidth: 1,
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
          callbacks: {
            label: function (context) {
              return `${context.parsed.y} votes (${
                percentages[context.dataIndex]
              }%)`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    };

    return <Bar data={data} options={options} />;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.container}>
          <div className={styles.loader}>
            <div className={styles.spinner}></div>
            <p>Loading survey data...</p>
          </div>
        </div>
      </>
    );
  }

  const totalResponses = survey
    ?.map((q) => q.counts.reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {survey && (
          <>
            <div className={styles.header}>
              <h2 className={styles.title}>{survey[0]?.title}</h2>
              <div className={styles.summaryCard}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total Questions</span>
                  <span className={styles.summaryValue}>{survey.length}</span>
                </div>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryLabel}>Total Responses</span>
                  <span className={styles.summaryValue}>
                    {survey && survey.length > 0
                      ? Math.floor(totalResponses / survey.length)
                      : 0}
                  </span>
                </div>
              </div>
            </div>

            {survey.map((q, idx) => {
              const totalVotes = q.counts.reduce((a, b) => a + b, 0);
              const percentages = q.counts.map((count) =>
                totalVotes === 0 ? 0 : Math.round((count / totalVotes) * 100)
              );

              return (
                <div key={idx} className={styles.questionCard}>
                  <div className={styles.questionHeader}>
                    <div className={styles.questionNumber}>{idx + 1}</div>
                    <h3 className={styles.questionText}>{q.question}</h3>
                  </div>

                  <div className={styles.statsRow}>
                    <span className={styles.totalVotes}>
                      <i className={`${styles.icon} fas fa-users`}></i>
                      Total Responses: {totalVotes}
                    </span>
                  </div>

                  <div className={styles.optionsGrid}>
                    {q.options.map((opt, i) => (
                      <div key={i} className={styles.optionCard}>
                        <div className={styles.optionHeader}>
                          <span className={styles.optionText}>{opt}</span>
                          <span className={styles.count}>
                            {q.counts[i]} votes ({percentages[i]}%)
                          </span>
                        </div>
                        <div className={styles.progressBar}>
                          <div
                            className={styles.progressFill}
                            style={{ width: `${percentages[i]}%` }}
                          ></div>
                        </div>
                        {q.respondentNames?.[i]?.length > 0 && (
                          <details className={styles.details}>
                            <summary className={styles.detailsSummary}>
                              <i
                                className={`${styles.icon} fas fa-user-friends`}
                              ></i>
                              View Respondents ({q.respondentNames[i].length})
                            </summary>
                            <ul className={styles.nameList}>
                              {q.respondentNames[i].map((name, nIdx) => (
                                <li key={nIdx}>
                                  <i
                                    className={`${styles.icon} fas fa-user`}
                                  ></i>
                                  {name}
                                </li>
                              ))}
                            </ul>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </>
  );
};

export default SurveyResponses;
