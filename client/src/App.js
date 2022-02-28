import React, {useCallback, useState} from 'react';
import 'draft-js/dist/Draft.css';
import './App.css'
import ReactQuill from "react-quill";
import {debounce} from "lodash";

const example_words = [
    'at',
    'start',
    'end',
    'justice',
    'failed',
    'guilty',
    'loyalty',
    'other'
];

function App() {

    const [input, setInput] = useState('')
    const [words, setWords] = useState([example_words[0], example_words[1], example_words[3]]);

    const sendOnAPI = (text) => {
        console.log(text);
    }


    const api = useCallback(
        debounce(sendOnAPI, 1000)
        , [])

    const onChangeInput = (event) => {

        api(event);
    }

    const appendWord = (word) => {
        console.log(word)
        setInput(input.concat(' ', word))
    }

    const renderWords = () => {
        return words.map((word) => {
            return (
                <div className={`col-4`} key={word} >
                    <div className="alert alert-primary" role="alert" onClick={() => appendWord(word)}>
                        {word}
                    </div>
                </div>
            )
        })
    }

    return (
        <div className={`container`}>
            <div className={`d-flex justify-content-center`}>
                <h1 className={`text-dark mt-5`}>Document editor</h1>
            </div>
            <div className={`d-flex justify-content-center mb-5 mt-4`}>
                <label className={`p-2 fw-bold`}>Document type:</label>
                <select className={`form-select w-50`}>
                    <option>X</option>
                    <option>Y</option>

                </select>
            </div>
            <ReactQuill
                value={input}
                onChange={onChangeInput}
                bounds={`.app`}
            />
            <div className={`row mt-3`}>
                {renderWords()}


            </div>

            {/*<button className={`btn btn-primary mt-2 w-100`}><FontAwesomeIcon className={`me-2`} icon={faFilePdf} />Save PDF</button>*/}

        </div>
    );
}

export default App;
