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
                print(d)
                id = str(uuid.uuid4())
                equipment_id = d['equipmentId']
                failure_mode_id = d['failureModeId']
                name = d['parameterName']
                min_value =d['minValue']
                max_value =d['maxValue']
                unit=d['unit']
                frequency = d['frequency']
                p = d['p']
                f = d['f']
                
                insert_sensor_based = '''
                    INSERT INTO oem_sensor_data (id, equipment_id, failure_mode_id, name,
                        min_value, max_value, unit, frequency, p, f)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
                '''

                cursor.execute(
                    insert_sensor_based, id, equipment_id, failure_mode_id, name,
                    min_value, max_value, unit, frequency, p, f
                )
            cursor.commit()
            return self.success_return
        except Exception as e:
            print(e)
            self.error_return['message'] = str(e)
            return self.error_return