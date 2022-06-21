from flask import Flask, render_template, request
# render_template: para retornar archivos Ex. index.html
# request: para recibir data dada por el usuario

app = Flask(__name__)

@app.route("/")
def home():
  return render_template('index.html')

if __name__ == "__main__":
  app.run()