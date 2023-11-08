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
                    repair_type VARCHAR(200),
                    duty_cycle FLOAT
                )
                CREATE UNIQUE INDEX oem_system_config_equipment_id_uindex
                    ON oem_system_config(equipment_id)
            '''
        is_exist = check_table_exist('equipments_failure_modes')
        if not is_exist:
            failure_table = '''
                CREATE TABLE equipments_failure_modes(
                    failure_mode_id VARCHAR(200) NOT NULL PRIMARY KEY,
                    equipment_id VARCHAR(200) NOT NULL,
                    failure_mode VARCHAR(200) NOT NULL,
                )
            '''
        is_exist = check_table_exist('parallel_equipments_table')
        if not is_exist:
            parallel_table = '''
                CREATE TABLE parallel_equipments_table(
                    parallel_id VARCHAR(200) NOT NULL PRIMARY KEY,
                    equipment_name VARCHAR(200),
                    equipment_id VARCHAR(200)
                )
            '''
        try:
            cursor.execute(table)
            cursor.execute(failure_table)
            cursor.execute(parallel_table)
            cnxn.commit()
            return "Tables Created Successfully"
        except Exception as e:
            return "Some Error Occured"