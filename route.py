import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from database.database_connection import cnxn, cursor
from database.oem_system_config.oem_system_config import OemSystemConfig
from database.system_documents.system_documents import SystemDocuments
from database.maintenance_allocation.maintenance_allocation import MaintenanceAllocation
from database.equipment_data.equipment_data import EquipmentData
from database.utility import export_equipment_config_data, export_sensor_data


APP_ROOT = os.path.dirname(os.path.abspath(__file__))
app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
CORS(app) 


@app.route('/home', methods=["POST"])
def get_data():
    data = {'message': 'Hello from Flask backend!'}
    return jsonify(data)

@app.route("/oem_system_config", methods=["POST"])
def oem_system_config():
    if request.method == "POST":
        data = request.json["data"]
        instance = OemSystemConfig()
        return  instance.insert_oem_system_conf_data(data=data)

@app.route("/fetch_equipments", methods=["GET"])
def fetch_equipments():
    if request.method == "GET":
        instance = OemSystemConfig()
        return  instance.get_all_equipment_data()

@app.route("/fetch_tree", methods=["POST"])
def fetch_tree():
    if request.method == "POST":
        equipment_id = request.json["equipment_id"]
        instance = OemSystemConfig()
        return  instance.get_equipment_and_children_data(equipment_id)


@app.route("/add_maintenance_data", methods=["POST"])
def maintenance_data():
    if request.method == "POST":
        data = request.json["data"]
        instance = MaintenanceAllocation()
        return instance.add_sensor(data=data)



@app.route("/equipment_data", methods=["POST"])
def equipment_data_ui():
    if request.method == "POST":
        equipment_type = request.json["equipment_type"]
        if equipment_type == "repairable":
            data = request.json["repairable_data"]
        else:
            data = request.json["replacable_data"]
        instance = EquipmentData()
        return instance.add_equipment_data(equipment_type=equipment_type, data= data)
        return request.json
    
@app.route("/upload", methods=["POST", "GET"])
def file_upload():
    if request.method == "POST" or request.method == "GET":
        file = request.files.getlist("file")
        equipment = request.form.get("equipmentName")
        target_folder = os.path.join(APP_ROOT, f"oem-tool/public/uploads/{equipment}")
        inst = SystemDocuments()
        return inst.upload_system_documents(target_folder=target_folder, file=file)




@app.route("/fetch_system_files", methods=["POST", "GET"])
def file_download():
    if request.method == "POST":
        equipment = request.form.get("equipmentName")
        target_folder = os.path.join(APP_ROOT, f"oem-tool/public/uploads/{equipment}")
        inst = SystemDocuments()
        return inst.fetch_system_files(target_folder=target_folder)


@app.route("/export_equipment_data", methods=["POST"])
def equipment_config_data():
    if request.method == "POST":
        return export_equipment_config_data()


@app.route("/export_sensor_data", methods=["POST"])
def sensor_data():
    if request.method == "POST":
        return export_sensor_data()

if __name__ == '__main__':
    app.run(debug=True)
