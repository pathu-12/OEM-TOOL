from database.database_connection import cursor, cnxn
from database.utility import check_table_exist

class MaintenanceAllocationTables:
    def __init__(self):
        self.init_tables()

    def init_tables(self):
        is_exist = check_table_exist('oem_sensor_data')
        if not is_exist:
            table = '''
                CREATE TABLE oem_sensor_data (
                    id VARCHAR(255) NOT NULL PRIMARY KEY,
                    equipment_id VARCHAR(255) NOT NULL,
                    failure_mode_id VARCHAR(255),
                    name VARCHAR(255) NOT NULL,
                    min_value VARCHAR(255),
                    max_value VARCHAR(255),
                    unit VARCHAR(255),
                    frequency VARCHAR(255),
                    p VARCHAR(200),
                    f VARCHAR(200)
                );
            '''
        try:
            cursor.execute(table)
            cnxn.commit()
            return "Tables Created Successfully"
        except Exception as e:
            print(e)
            return "Some Error Occured"