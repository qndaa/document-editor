import React, { useCallback, useRef, useState } from "react";
import "draft-js/dist/Draft.css";
import "./App.css";
import ReactQuill from "react-quill";
import { debounce } from "lodash";
import axios from "axios";
import { PDFExport } from "@progress/kendo-react-pdf";
import { jsPDF } from "jspdf";

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
  const [loading, setLoading] = useState(false);
  const [idx, setIdx] = useState(0);
  const fileRef = useRef(null);

  const pdfExportComponent = useRef(null);
  const quill = useRef();
  var index = 0;

  const sendOnAPI = (text) => {
    const paragraphs = text.split("<p>");
    const lastParagraph = paragraphs[paragraphs.length - 1];
    axios
      .post(`${process.env.REACT_APP_BACKEND_URL}/predict/`, {
        text: lastParagraph.trim(),
        type: contractTypes[index],
      })
      .then((res) => {
        setWords(clean(res.data.splice(0, 3).map((w) => w[0])));
        setLoading(false);
      });
  };

  const api = useCallback(debounce(sendOnAPI, 2000), []);
  const clean = (originalArray) => {
    let cleanArray = [];
    for (let el of originalArray) {
      if (el && el !== " ") {
        cleanArray.push(el);
      }
    }

    return cleanArray;
  };

  const appendWord = (word) => {
    const lastIndexOfP = input.lastIndexOf("</p>");
    const textWithoutEndP = input.slice(0, lastIndexOfP);
    const newInput = `${textWithoutEndP} ${word} </p>`;
    setInput(newInput);
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
        <div key={word}>
          <button
            disabled={loading}
            className="btn btn-outline-success"
            style={{ marginRight: "1vw" }}
            onClick={() => {
              appendWord(word);
            }}
          >
            {word}
          </button>
        </div>
      );
    });
  };

  const generatePDF = async (event) => {
    event.stopPropagation();
    event.preventDefault();
    const d = new jsPDF();

    const parser = new DOMParser();
    const doc = parser.parseFromString(quill.current.state.value, "text/html");

    d.html(doc.body, {
      callback: function (doc) {
        doc.save("sample.pdf");
      },
      width: 400, // <- here
      windowWidth: 1400, // <- here,
      x: 10,
      y: 10,
    });
  };

  const renderNewText = (e) => {
    var reader = new FileReader();
    var textFile = /text.*/;
    var file = fileRef.current.files[0];

    if (file.type.match(textFile)) {
      reader.onload = function (e) {
        setInput(e.target.result);
      };
    }
    reader.readAsText(file);
  };

  return (
    <div className={`container`}>
      <div className={`d-flex justify-content-center`}>
        <h1 className={`text-dark mt-5`}>Contract editor</h1>
      </div>
      <div className={`d-flex justify-content-center mb-3 mt-2`}>
        <label className={`p-2 fw-bold`}>Contract type:</label>
        <select
          className={`form-select w-50`}
          onChange={(e) => {
            index = contractTypes.indexOf(e.target.value);
          }}
        >
          {renderOptions()}
        </select>
      </div>
      <ReactQuill
        ref={quill}
        value={input}
        onChange={(e) => {
          if (e !== "<p><br></p>") {
            api(e);
            setInput(e);
          }
        }}
      />
      <div className={`row mt-2`}>
        <div className="d-flex justify-content-center">{renderWords()}</div>
      </div>

      <div className={`row mt-3`} hidden={true}>
        <PDFExport paperSize={`A4`} ref={pdfExportComponent}></PDFExport>
      </div>
      <hr></hr>
      <div className="d-flex justify-content-center align-items-center mt-2 mb-2">
        <button className={`btn btn-success w-3`} onClick={generatePDF}>
          Export to PDF
        </button>
        <span>&nbsp;&nbsp;or&nbsp;&nbsp;</span>
        <div className="w-3">
          <input
            ref={fileRef}
            type="file"
            className="form-control"
            accept=".txt"
            onChange={(e) => {
              renderNewText(e);
            }}
          ></input>
        </div>
      </div>
    </div>
  );
}

export default App;
