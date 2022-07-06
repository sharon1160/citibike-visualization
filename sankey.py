# SANKEY DIAGRAM
def trips_count(id,ids,df):
  trips_start_df = df[df["Start Station ID"] == id]
  trips_values = trips_start_df[trips_start_df['End Station ID'].isin(ids)]['End Station ID'].value_counts()
  return trips_values.to_dict()

def get_values(ids,df):
  values = {}
  for id in ids:
    values[id] = trips_count(id,ids,df)
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

def get_links(ids,df):
  values = get_values(ids,df)
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
