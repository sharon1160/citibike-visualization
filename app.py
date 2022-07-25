from flask import Flask, render_template, request, jsonify
import sankey as sk
import stations as st
import pandas as pd
import glob
import json

DAY = "day"
HOUR = "hour"
MONTH = "month"
nombre_file_stations = 'static/data/stations-todo.json'

# initialize flask application
app = Flask(__name__)

# READING DATA
def readData(ruta):
    df = pd.read_csv(ruta)
    return df

df = readData("static/data/citibike(2013-07_2014-02).csv")

@app.route("/")
def home():
    return render_template('map.html')

@app.route("/analysis")
def analysis():
    return render_template('analysis.html')

@app.route("/metadata")
def metadata():
    return render_template('metadata.html')

@app.route("/get-stations", methods=['POST', 'GET'])
def get_stations():
    global nombre_file_stations
    if request.method == 'POST':
        if 'hour-field' in request.form:
            hora = int(request.form['hour-field'])
            st.get_stations_hour(df, hora)
            nombre_file_stations = 'static/data/stations-todo-hour.json'
            return render_template('map.html')
        elif 'month-field' in request.form:
            mes = int(request.form['month-field'])
            st.get_stations_month(df, mes)
            nombre_file_stations = 'static/data/stations-todo-month.json'
            return render_template('map.html')
        elif 'viaje-tipos' in request.form:
            option = request.form['viaje-tipos']
            if option == "viajes-todo":
                nombre_file_stations = 'static/data/stations-todo.json'
            elif option == "viajes-salida":
                nombre_file_stations = 'static/data/stations-salida.json'
            elif option == "viajes-llegada":
                nombre_file_stations = 'static/data/stations-llegada.json'
            return render_template('map.html')
    else:
        with open(nombre_file_stations) as fp:
            return json.load(fp)


@app.route("/sankey", methods=['POST', 'GET'])
def sankey():
    if request.method == 'POST':
        ids = request.form['estaciones-input']
        ids = ids.split(",")
        ids = [int(i) for i in ids]
        sk.get_graph(df,ids)
        return render_template('map.html')
    else:
        with open('static/data/viajes.json') as fp:
            return json.load(fp)

if __name__ == "__main__":
    app.debug = True
    app.run()
