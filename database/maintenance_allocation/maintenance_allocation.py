import uuid
from database.database_connection import cursor, cnxn
from database.maintenance_allocation.maintenance_allocation_db import MaintenanceAllocationTables

class MaintenanceAllocation:
    def __init__(self):
        MaintenanceAllocationTables()
        self.success_return = {"message": "Data Saved Successfully.", "code": 1}
        self.error_return = {
            "message": "Some Error Occured, Please try agian.",
            "code": 0,
        }
    
    def add_sensor(self, data):
        try:
            for d in data:
                equipment_id = d['EquipmentId']
                id = str(uuid.uuid4())
                failure_mode_id=d['FailureModeId']
                name = d['name']
                frequency = d['frequency']
                unit=d['unit']
                min_value =d['min']
                max_value =d['max']
                param_data =d['data']
                level =d['level']
                
                insert_sensor_based = '''INSERT INTO sensor_based_data (id, component_id,equipment_id, name,
                                failure_mode_id,frequency,unit, min_value,max_value,data,level)
                                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);'''

                cursor.execute(insert_sensor_based, id, component_id, equipment_id, name,failure_mode_id,
                                frequency, unit, min_value,max_value,param_data,level)
            cursor.commit()
            return self.success_return
        except Exception as e:
            print(e)
            self.error_return['message'] = str(e)
            return self.error_return