import json

def trip_counts(df):
  # bike station ID, Name, and coordinates
  locations = df.groupby("Start Station ID").first()
  locations = locations.loc[:, ["Start Station Latitude", "Start Station Longitude","Start Station Name"]]

  # no. of departures for each station
  departure_df = df.groupby("Start Station ID").count()
  departure_df = departure_df.iloc[:,[0]]
  departure_df.columns= ["Departure Count"]

  # no. of arrivals for each station
  arrival_df = df.groupby("End Station ID").count().iloc[:,[0]]
  arrival_df.columns= ["Arrival Count"]

  # for each bike station shown depatures and arrivals
  trip_counts_df = departure_df.join(locations).join(arrival_df)
  trip_counts_df.rename(columns={'Start Station Latitude': 'Latitude'}, inplace=True)
  trip_counts_df.rename(columns={'Start Station Longitude': 'Longitude'}, inplace=True)
  trip_counts_df.rename(columns={'Start Station Name': 'Name'}, inplace=True)
  new_cols = ['Name', 'Latitude', 'Longitude', 'Departure Count', 'Arrival Count']
  trip_counts_df = trip_counts_df[new_cols]

  return trip_counts_df

def trip_counts_by_month(df, month):
  # bike station ID, Name, and coordinates
  locations = df.groupby("Start Station ID").first()
  locations = locations.loc[:, ["Start Station Latitude", "Start Station Longitude","Start Station Name"]]

  # pick a month
  month_df = df[df["month"]==month]

  # no. of departures for each station
  departure_df = month_df.groupby("Start Station ID").count()
  departure_df = departure_df.iloc[:,[0]]
  departure_df.columns= ["Departure Count"]

  # no. of arrivals for each station
  arrival_df = month_df.groupby("End Station ID").count().iloc[:,[0]]
  arrival_df.columns= ["Arrival Count"]

  # for each bike station shown depatures and arrivals
  trip_counts_df = departure_df.join(locations).join(arrival_df)
  trip_counts_df.rename(columns={'Start Station Latitude': 'Latitude'}, inplace=True)
  trip_counts_df.rename(columns={'Start Station Longitude': 'Longitude'}, inplace=True)
  trip_counts_df.rename(columns={'Start Station Name': 'Name'}, inplace=True)
  new_cols = ['Name', 'Latitude', 'Longitude', 'Departure Count', 'Arrival Count']
  trip_counts_df = trip_counts_df[new_cols]

  return trip_counts_df

# Obtiene las estaciones con viajes de salida y viajes de llegada
def get_stations_todo(df):
  nombre = 'static/data/stations-todo.json'
  df_stations = trip_counts(df)
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
  with open(nombre, 'w') as fp:
      json.dump(data, fp)
  return nombre