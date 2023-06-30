from flask import Flask
from app import views

app = Flask(__name__)
app = Flask(__name__, template_folder='app/templates', static_folder='app/static')


if __name__ == '__main__':
    views.app.run(port=3000, debug = True)