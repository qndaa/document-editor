import React, {useCallback, useRef, useState} from "react";
import "draft-js/dist/Draft.css";
import "./App.css";
import ReactQuill from "react-quill";
import {debounce} from "lodash";
import axios from "axios";
import {PDFExport} from "@progress/kendo-react-pdf";
import {jsPDF} from "jspdf";

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
    const [contractType, setContractType] = useState(contractTypes[0]);
    const [loading, setLoading] = useState(false);

    const pdfExportComponent = useRef(null);
    const quill = useRef()
    const sendOnAPI = (text) => {
        axios
            .post(`http://localhost:5000/predict/`, {
                text: text.trim(),
                type: contractType,
            })
            .then((res) => {
                setWords(res.data.splice(0, 3).map((w) => w[0]));
                setLoading(false);
            });
    };

    const api = useCallback(debounce(sendOnAPI, 2000), []);

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
                <div className={`col-1`} key={word}>
                    <button
                        disabled={loading}
                        className="btn btn-outline-success"
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
        event.stopPropagation()
        event.preventDefault()
        const d = new jsPDF()

        const parser = new DOMParser();
        const doc = parser.parseFromString(quill.current.state.value, 'text/html');

        console.log(doc.body)
        d.html(doc.body, {
            callback: function (doc) {
                doc.save('sample.pdf');
            },
            width: 400, // <- here
            windowWidth: 1400, // <- here,
            x: 10,
            y: 10
        })

    }

    return (
        <div className={`container`}>
            <div className={`d-flex justify-content-center`}>
                <h1 className={`text-dark mt-5`}>Document editor</h1>
            </div>
            <div className={`d-flex justify-content-center mb-5 mt-4`}>
                <label className={`p-2 fw-bold`}>Document type:</label>
                <select
                    className={`form-select w-50`}
                    onChange={(e) => {
                        setContractType(e.target.value);
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
                        // setLoading(true);
                        api(e);
                        setInput(e);
                    }
                }}
            />
            <div className={`row mt-3`}>{renderWords()}</div>

            <div className={`row mt-3`} hidden={true}>
                <PDFExport paperSize={`A4`} ref={pdfExportComponent}>
                </PDFExport>

            </div>
            <div className={`row mt-3`}>
                <button className={`btn btn-success`} onClick={generatePDF}>Export to PDF</button>
            </div>

        </div>
    );
}

export default App;
