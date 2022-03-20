import React, { useCallback, useState } from "react";
import "draft-js/dist/Draft.css";
import "./App.css";
import ReactQuill from "react-quill";
import { debounce } from "lodash";
import axios from "axios";

const example_words = [
  "at",
  "start",
  "end",
  "justice",
  "failed",
  "guilty",
  "loyalty",
  "other",
];

const contractTypes = [
  "Affiliate Agreement",
  "Co-Branding Agreement",
  "Development Agreement",
  "Distributor Agreement",
  "Endorsement Agreement",
  "Franchise Agreement",
  "Hosting agreement",
  "IP Agreement",
  "Joint Venture Agreement",
  "License Agreement",
  "Maintenance Agreement",
  "Manufacturing Agreement",
  "Marketing Agreement",
  "Non-Competition Agreement",
  "Outsourcing Agreement",
  "Reseller Agreement",
  "Service Agreement",
  "Sponsorship Agreement",
  "Supply Agreement",
  "Transportation Agreement",
  "Strategic Alliance Agreement",
  "Promotion Agreement",
];

function App() {
  const [input, setInput] = useState("");
  const [words, setWords] = useState([
    example_words[0],
    example_words[1],
    example_words[3],
  ]);

  const sendOnAPI = (text) => {
    axios
      .post(`http://localhost:5000/predict/`, {
        text: text.trim(),
        type: "Agency agreement",
      })
      .then((res) => {
        setWords(res.data.splice(0, 3).map((w) => w[0]));
      });
  };

  const api = useCallback(debounce(sendOnAPI, 400), []);

  const onChangeInput = (event) => {
    api(event);
  };

  const appendWord = (word) => {
    console.log(word);
    setInput(input.concat(" ", word));
  };

  const renderOptions = () => (
    <>
      {contractTypes.map((ct) => (
        <option key={ct}>{ct}</option>
      ))}
    </>
  );

  const renderWords = () => {
    return words.map((word) => {
      return (
        <div className={`col-4`} key={word}>
          <div
            className="alert alert-primary"
            role="alert"
            onClick={() => appendWord(word)}
          >
            {word}
          </div>
        </div>
      );
    });
  };

  return (
    <div className={`container`}>
      <div className={`d-flex justify-content-center`}>
        <h1 className={`text-dark mt-5`}>Document editor</h1>
      </div>
      <div className={`d-flex justify-content-center mb-5 mt-4`}>
        <label className={`p-2 fw-bold`}>Document type:</label>
        <select className={`form-select w-50`}>{renderOptions()}</select>
      </div>
      <ReactQuill value={input} onChange={onChangeInput} bounds={`.app`} />
      <div className={`row mt-3`}>{renderWords()}</div>

      {/*<button className={`btn btn-primary mt-2 w-100`}><FontAwesomeIcon className={`me-2`} icon={faFilePdf} />Save PDF</button>*/}
    </div>
  );
}

export default App;
