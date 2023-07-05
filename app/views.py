from flask import render_template, request, flash, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from flask_mysqldb import MySQL
from random import sample
import os, logging
from os import path, remove
from run import app

app.logger.setLevel(logging.ERROR)
file_handler = logging.FileHandler('error.log')
file_handler.setFormatter(logging.Formatter('%(asctime)s %(levelname)s: %(message)s'))
app.logger.addHandler(file_handler)

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'imgflaskapp'
app.config['MYSQL_PORT'] = 3308

mysql = MySQL(app)

UPLOAD_FOLDER = 'static/imgs'
ALLOWED_EXTENSIONS = {'webp','jpg', 'jpeg', 'png', 'gif', 'bmp'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = os.urandom(24)

@app.route('/')
def Index():
    return render_template('index.html')

def stringAleatorio():
    string_aleatorio = "0123456789abcdefghijklmnopqrstuvwxyz_"
    longitud         = 8
    secuencia        = string_aleatorio.upper()
    resultado_aleatorio  = sample(secuencia, longitud)
    string_aleatorio     = "".join(resultado_aleatorio)
    return string_aleatorio
  

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
           
def save_img(dirImg):
    err = ""
    if not dirImg:
        err = f'Hay un error de la direccion: {dirImg}'
    if not err:
        cur = mysql.connection.cursor()
        query = "INSERT INTO imgs (name_img) VALUES (%s);"
        values = (dirImg,)
        cur.execute(query, values)
        mysql.connection.commit()
        flash("Contacto agregado")
        return redirect(url_for('Index'))
    else:
        app.logger.error(f'Error en some_route: {err}')
        return "Error"           
           
@app.route('/add_img', methods=['POST'])           
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            basePath = path.dirname(__file__)
            filename = secure_filename(file.filename)
            
            nuevoNombreFile = stringAleatorio() + ".webp"
            
            upload_path = path.join (basePath, UPLOAD_FOLDER, nuevoNombreFile)
            file.save(upload_path)
            save_img(nuevoNombreFile)
    return render_template('index.html')
    
@app.route('/getImg', methods=['GET'])
def get_img():
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        cur.execute(f'SELECT name_img FROM imgs ;')
        data = cur.fetchall()
        return jsonify(data)  
    
@app.route('/delete_img/<string:file_name>', methods=['GET'])
def delete_file(file_name):
    if request.method == 'GET':
        cur = mysql.connection.cursor()
        basePath = path.dirname(__file__)
        url_file = path.join (basePath, UPLOAD_FOLDER, file_name)
        if path.exists(url_file):
            remove(url_file)
        try:
            cur.execute('DELETE FROM imgs WHERE name_img LIKE %s;', (file_name,))
            mysql.connection.commit()
        except Exception as e:
            print('Error executing query:', str(e))
            
    return render_template('index.html')
