import { useEffect, useState } from "react";
import "./App.css";
import Papa from "papaparse";
import findSimilarCompanies from "./functions/findSimilarCompanies";
import calculatePercentile from "./functions/calculatePercentile";

function App() {
  const [scoreRecords, setScoreRecords] = useState([]);
  const [parsedCompanies, setParsedCompanies] = useState([]);
  const [candidateId, setCandidateId] = useState(0);
  const [candidateCompany, setCandidateCompany] = useState(
    scoreRecords.filter(
      (record) => parseInt(record.candidate_id) === parseInt(candidateId)
    )[0]
  );
  const [error, setError] = useState("");
  const [candidateTitle, setCandidateTitle] = useState(candidateCompany?.title);
  const [communicationScorePercentile, setCommunicationScorePercentile] =
    useState(0);
  const [codeScorePercentile, setCodeScorePercentile] = useState(0);
  const [inputId, setInputId] = useState();

  // Set app title
  useEffect(() => {
    document.title = "Candidate Score Percentile Calculator";
  }, []);

  // Parse csv into json
  useEffect(() => {
    Papa.parse("../data/score-records.csv", {
      header: true,
      download: true,
      complete: (results) => {
        setScoreRecords(results.data);
      },
    });

    Papa.parse("/data/companies.csv", {
      header: true,
      download: true,
      complete: (results) => {
        setParsedCompanies(results.data);
      },
    });
  }, [candidateCompany, candidateTitle]);

  useEffect(() => {
    setCandidateCompany(
      scoreRecords.filter(
        (record) => parseInt(record.candidate_id) === parseInt(candidateId)
      )[0]
    );
    setCandidateTitle(candidateCompany?.title);
  }, [candidateCompany, candidateTitle, candidateId]);

  let similarCompanies = findSimilarCompanies(
    parseInt(candidateCompany?.company_id),
    Object.values(parsedCompanies)
  );

  const filteredData = Object.values(scoreRecords).filter(
    (candidate) =>
      candidate.title === candidateTitle &&
      similarCompanies.find((item) => item.company_id === candidate.company_id)
  );

  const getPercentiles = () => {
    // Error messages
    if (
      scoreRecords.filter((company) => company.candidate_id == candidateId)
        .length === 0
    ) {
      if (candidateId === "" || candidateId === undefined) {
        setError("Please enter a valid candidate id number.");
      } else {
        setError("Invalid candidate id number");
      }
    } else {
      setError("");
      setInputId(candidateId);
    }

    setCommunicationScorePercentile(
      calculatePercentile(
        candidateId,
        Object.values(filteredData),
        "communication_score"
      )
    );

    setCodeScorePercentile(
      calculatePercentile(
        candidateId,
        Object.values(filteredData),
        "code_score"
      )
    );
  };
  return (
    <div className="candidate-score-percentile-calculator">
      <h1>Candidate Score Percentile Calculator</h1>
      <div className="calculator-title">
        <p className="instructions">
          Enter a valid candidate id in the input box below to calculate the
          candidate's code score percentile and communication score percentile.
        </p>
      </div>
      <div className="candidateid-input-wrapper">
        <label>Candidate id number:</label>
        <div className="candidateid-input-box">
          <input
            type="text"
            onKeyDown={(e) => {
              e.key === "Enter" && getPercentiles();
            }}
            onChange={(e) => setCandidateId(e.target.value)}
            value={candidateId}
            className="candidateid-input"
          />
          <button className="go-btn" onClick={getPercentiles}>
            Go
          </button>
        </div>
        <div className="error-msg">{error}</div>
      </div>
      <div className="percentile-results">
        <h2>Results</h2>
        <table className="percentile-results-table">
          <thead>
            <tr>
              <th>Candidate Id</th>
              <th>Code Score %</th>
              <th>Communication Score %</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{inputId === 0 ? "" : inputId}</td>
              <td>{parseFloat(codeScorePercentile?.toFixed(2)) || 0}%</td>
              <td>
                {" "}
                {parseFloat(communicationScorePercentile?.toFixed(2)) || 0}%
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
