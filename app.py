from flask import Flask, render_template, request, jsonify
import pandas as pd
import json
# render_template: para retornar archivos Ex. index.html
# request: para recibir data dada por el usuario

app = Flask(__name__)

@app.route("/")
def home():
  return render_template('index.html')

@app.route("/get-stations")
def get_stations():
  with open("static/data/stations.json") as f:
    return json.load(f)

@app.route("/get-trips")
def get_data():
  with open("static/data/viajes.json") as f:
    return json.load(f)

if __name__ == "__main__":
  app.debug = True
  app.run()