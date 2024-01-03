from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', items=data)

@app.route('/endpoint')
def endpoint():
    return 'We are so back!'

if __name__ == '__main__':
    app.run(debug=True)
