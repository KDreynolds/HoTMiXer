from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

@app.route('/endpoint')
def endpoint():
    return 'Hello, World'

if __name__ == '__main__':
    app.run(debug=True)
