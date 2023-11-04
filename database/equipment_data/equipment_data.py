import uuid

from database.database_connection import cursor, cnxn
from database.equipment_data.equipment_data_db import EquipmentDataTables

class EquipmentData:
    def __init__(self):
        EquipmentDataTables()
        self.success_return = {
            "message": "Data Saved Successfully.", "code": 1}
        self.error_return = {
            "message": "Some Error Occured, Please try agian.",
            "code": 0,
        }
    
    def add_equipment_data(self, data, equipment_type):
        try:
            if equipment_type == "repairable":
                id = str(uuid.uuid4())
                alpha = data["alpha"]
                beta = data["beta"]
                equipment_id = data["equipment_id"]
                insert_sql = '''
                    INSERT INTO alpha_beta(
                        id, alpha, beta, equipment_id
                    ) VALUES(?, ?, ?, ?)
                '''
                cursor.execute(insert_sql, id, alpha, beta, equipment_id)
            else:
                id = str(uuid.uuid4())
                eta = data["eta"]
                beta = data["beta"]
                equipment_id = data["equipment_id"]
                insert_sql = '''
                    INSERT INTO eta_beta(
                        id, alpha, beta
                    ) VALUES(?, ?, ?, ?)
                '''
                cursor.execute(insert_sql, id, eta, beta, equipment_id)
            cursor.commit()
            return self.success_return
            
        except Exception as e:
            print(e)
            return self.error_return