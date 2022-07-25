import json

# SANKEY DIAGRAM
def trips_count(df, id, ids, tipo='', numero=0):
  trips_start_df = df[df["Start Station ID"] == id]
  if tipo == 'month':
    trips_start_df = trips_start_df[trips_start_df['month'] == numero]
  elif tipo == 'day':
    trips_start_df = trips_start_df[trips_start_df['day'] == numero]
  elif tipo == 'hour':
    trips_start_df = trips_start_df[trips_start_df['hour'] == numero]
  trips_values = trips_start_df[trips_start_df['End Station ID'].isin(ids)]['End Station ID'].value_counts()
  return trips_values.to_dict()

def get_values(df, ids, tipo='', numero=0):
  values = {}
  for id in ids:
    values[id] = trips_count(df, id, ids, tipo, numero)
  return values

def stations_start_list(ids):
  lista = []
  for i in range(2):
    if i == 0:
      for id in ids:
        lista.append(str(id)+"A")
    else:
      for id in ids:
        lista.append(str(id)+"B")
  return lista

def get_nodos(ids):
  nodos = []
  count = 0
  for i in range(2):
    if i == 0:
      for id in ids:
        nodo = {"node":count, "name":str(id)+"A"}
        nodos.append(nodo)
        count += 1
    else:
      for id in ids:
        nodo = {"node":count, "name":str(id)+"B"}
        nodos.append(nodo)
        count += 1
  return nodos

def get_links(df, ids, tipo='', numero=0):
  values = get_values(df, ids,tipo, numero)
  stations_list = stations_start_list(ids)
  links = []
  for idA in ids:
    for idB in values[idA]:
      dic = {}
      dic["source"] = stations_list.index(str(idA)+"A")
      dic["target"] = stations_list.index(str(idB)+"B")
      dic["value"] = values[idA][idB]
      links.append(dic)
  return links

################## TODO ##################

def get_graph(df, ids):
  nodos = get_nodos(ids)
  links = get_links(df, ids)
  data = {"nodes": nodos, "links": links}
  with open('static/data/viajes.json', 'w') as fp:
    json.dump(data, fp)

################## MONTH ##################

def get_graph_month(df, ids, month):
  tipo = 'month'
  nodos = get_nodos(ids)
  links = get_links(df, ids,tipo, month)
  viajes = {"nodes":nodos, "links":links}
  with open('static/data/viajes-mes.json', 'w') as fp:
    json.dump(viajes, fp)

################## DAY ##################

def get_graph_day(df, ids, day):
  tipo = 'day'
  nodos = get_nodos(ids)
  links = get_links(df, ids,tipo, day)
  viajes = {"nodes":nodos, "links":links}
  with open('static/data/viajes-dia.json', 'w') as fp:
    json.dump(viajes, fp)

################## HORA ##################

def get_graph_hora(df, ids, hour):
  tipo = 'hour'
  nodos = get_nodos(ids)
  links = get_links(df, ids,tipo, hour)
  viajes = {"nodes":nodos, "links":links}
  with open('static/data/viajes-hora.json', 'w') as fp:
    json.dump(viajes, fp)
  return viajes