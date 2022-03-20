from collections import Counter

import flask
from bs4 import BeautifulSoup
from flask import Flask, request
from flask_cors import CORS

from config import tokenizer, model
from helpers import clean_text

app = Flask(__name__)
CORS(app)


@app.route('/predict/', methods=['POST'])
def predict():
    request_data = request.get_json()
    input_text = request_data.get('text')
    contract_type = request_data.get('type')

    input_text = BeautifulSoup(input_text).get_text()

    generated = tokenizer(f"<|startoftext|> <<{contract_type}>> {input_text}", return_tensors="pt").input_ids.cuda()
    max_length_s_o = len(input_text.split(" ")) + 3
    sample_outputs_n_w_p = model.generate(generated, do_sample=True, top_k=50,
                                          max_length=max_length_s_o, top_p=0.95, temperature=1.9,
                                          num_return_sequences=20)
    dirty = [tokenizer.decode(
        sample_output_n_w_p, skip_special_tokens=True)
        for sample_output_n_w_p in sample_outputs_n_w_p]

    clean = [clean_text(input_text, sample, contract_type) for sample in dirty]
    response = flask.jsonify(Counter(clean).most_common())
    response.headers.add('Access-Control-Allow-Origin', '*')
    return response


if __name__ == '__main__':
    app.run()
