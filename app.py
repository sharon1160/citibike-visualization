from flask import Flask, render_template, request, jsonify
import sankey as sk
import pandas as pd
import glob
import json
# render_template: para retornar archivos Ex. index.html
# request: para recibir data dada por el usuario

# initialize flask application
app = Flask(__name__)

# READING DATA
def readData(ruta):
  df = pd.read_csv(ruta)
  return df

df = readData("static/data/citibike(2013-07_2014-02).csv")

@app.route("/")
def home():
  return render_template('index.html')

@app.route("/get-stations")
def get_stations():
  with open("static/data/stations.json") as f:
    return json.load(f)

@app.route("/get-trips")
def get_data():
  with open("static/data/viajes-test.json") as f:
    return json.load(f)

@app.route("/sankey",methods=['POST','GET'])
def sankey():
  if request.method == 'POST':
    ids = request.form['estaciones-input']
    ids = ids.split(",")
    ids = [int(i) for i in ids]
    nodos = sk.get_nodos(ids)
    links = sk.get_links(ids,df)
    data = {"nodes":nodos, "links":links}
    with open('static/data/viajes.json', 'w') as fp:
      json.dump(data, fp)
    return render_template('index.html')
  else:
    with open('static/data/viajes.json') as fp:
      return json.load(fp)

if __name__ == "__main__":
  app.debug = True
  app.run()