from database.database_connection import cursor, cnxn
from database.utility import check_table_exist

class MaintenanceAllocationTables:
    def __init__(self):
        self.init_tables()

    def init_tables(self):
        is_exist = check_table_exist('oem_sensor_data')
        if not is_exist:
            table = '''
                CREATE TABLE oem_sensor_data(
                    id VARCHAR(8000) NOT NULL PRIMARY KEY NONCLUSTERED,
                    equipment_id VARCHAR(8000) NOT NULL,
                    CONSTRAINT oem_sensor_data_oem_system_config_equipment_id_FK
                        REFERENCES oem_system_config,
                    equipment_id VARCHAR(8000) NOT NULL,
                    failure_mode_id VARCHAR(8000),
                    name VARCHAR(8000) NOT NULL,
                    min_value VARCHAR(200),
                    max_value VARCHAR(200),
                    unit VARCHAR(200),
                    level VARCHAR(200),
                    frequency VARCHAR(200),
                )
            '''
        try:
            cursor.execute(table)
            cnxn.commit()
            return "Tables Created Successfully"
        except:
            return "Some Error Occured"