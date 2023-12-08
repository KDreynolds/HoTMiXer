from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Temporary data store. In a real app, this would be a database.
data = [{"id": 1, "name": "HoTMiX"}, {"id": 2, "name": "is"}, {"id": 3, "name": "Horse"}]

@app.route('/')
def index():
    return render_template('index.html', items=data)

@app.route('/data-table')
def data_table():
    return render_template('data_table.html', items=data)

@app.route('/add-item', methods=['POST'])
def add_item():
    # Add item to data
    new_item = {"id": len(data) + 1, "name": request.form.get("name")}
    data.append(new_item)
    return redirect(url_for('data_table'))

@app.route('/edit-item-form/<int:id>')
def edit_item_form(id):
    # Find item by id
    item = next((item for item in data if item['id'] == id), None)
    if item is None:
        abort(404)  # If no item found, return 404 error
    return render_template('edit_item_form.html', item=item)

@app.route('/edit-item/<int:id>', methods=['POST'])
def edit_item(id):
    # Find item by id and update it
    global data
    for item in data:
        if item['id'] == id:
            item['name'] = request.form.get('name')
            break
    return redirect(url_for('data_table'))

@app.route('/delete-item/<int:id>', methods=['POST'])
def delete_item(id):
    # Delete item from data
    # ...
    return redirect(url_for('data_table'))

@app.route('/new_item_form')
def new_item_form():
    return render_template('new_item_form.html')

if __name__ == '__main__':
    app.run(debug=True)
