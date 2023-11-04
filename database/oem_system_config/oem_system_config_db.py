from database.database_connection import cursor, cnxn
from database.utility import check_table_exist



class OemSystemConfigTable:
    def __init__(self):
        self.init_tables()

    def init_tables(self):
        is_exist = check_table_exist('oem_system_config')
        if not is_exist:
            table = '''
                CREATE TABLE oem_system_config(
                    equipment_id VARCHAR(200) NOT NULL
                        CONSTRAINT oem_system_config_pk
                        PRIMARY KEY NONCLUSTERED,
                    equipment_name VARCHAR(MAX) NOT NULL,
                    parent_id VARCHAR(200),
                    parent_name VARCHAR(8000),
                    parallel_components VARCHAR(8000),
                    repair_type VARCHAR(200),
                    failure_mode VARCHAR(200),
                    failure_mode_id VARCHAR(200),
                    duty_cycle INT
                )
                CREATE UNIQUE INDEX oem_system_config_equipment_id_uindex
                    ON oem_system_config(equipment_id)
            '''
        try:
            cursor.execute(table)
            cnxn.commit()
            return "Tables Created Successfully"
        except:
            return "Some Error Occured"