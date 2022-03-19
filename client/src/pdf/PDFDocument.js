import React from "react";
import {Document, Page} from "@react-pdf/renderer";
import Html from "react-pdf-html";

const PDFDocument = ({html}) => {

    return (
        <Document>
            <Page>
                <Html>{html}</Html>
            </Page>
        </Document>
    );
}

export default PDFDocument;
