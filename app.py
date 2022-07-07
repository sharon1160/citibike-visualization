from flask import Flask, render_template, request, jsonify
import sankey as sk
import stations as st
import pandas as pd
import glob
import json

DAY = "day"
HOUR = "hour"
MONTH = "month"

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


@app.route("/get-stations", methods=['POST', 'GET'])
def get_stations():
    if request.method == 'POST':
        df_stations = st.trip_counts(df)
        ids = list(df_stations.index)
        latitudes = list(df_stations['Latitude'])
        longitudes = list(df_stations['Longitude'])
        nombres = list(df_stations['Name'])
        salidas = list(df_stations['Departure Count'])
        llegadas = list(df_stations['Arrival Count'])
        data = {}
        n = len(list(df_stations['Latitude']))
        for i in range(n):
            suma = salidas[i] + llegadas[i]
            porcentaje_salidas = round((salidas[i] * 100)/suma, 2)
            porcentaje_llegadas = round((llegadas[i] * 100)/suma, 2)
            data[ids[i]] = [longitudes[i], latitudes[i], nombres[i], salidas[i], llegadas[i], str(
                porcentaje_salidas) + '%', str(porcentaje_llegadas) + '%']
        with open('static/data/stations.json', 'w') as fp:
            json.dump(data, fp)
        return render_template('index.html')
    else:
        with open("static/data/stations.json") as fp:
            return json.load(fp)


@app.route("/sankey", methods=['POST', 'GET'])
def sankey():
    if request.method == 'POST':
        ids = request.form['estaciones-input']
        ids = ids.split(",")
        ids = [int(i) for i in ids]
        nodos = sk.get_nodos(ids)
        links = sk.get_links(ids, df)
        data = {"nodes": nodos, "links": links}
        with open('static/data/viajes.json', 'w') as fp:
            json.dump(data, fp)
        return render_template('index.html')
    else:
        with open('static/data/viajes.json') as fp:
            return json.load(fp)


if __name__ == "__main__":
    app.debug = True
    app.run()
