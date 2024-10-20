from flask import Flask

app = Flask(__name__, static_folder='static')

# Set Flask secret key
app.config['SECRET_KEY'] = 'supersecretflaskskey'

# Initialize database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///your_database.db'