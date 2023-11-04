from database.database_connection import cursor, cnxn
from database.utility import check_table_exist


class EquipmentDataTables:
    def __init__(self):
        self.init_tables()
    
    def init_tables(self):
        is_exist = check_table_exist('alpha_beta')
        if not is_exist:
            table1 = '''
                CREATE TABLE alpha_beta(
                    id VARCHAR(8000) NOT NULL PRIMARY KEY NONCLUSTERED,
                    alpha VARCHAR(200),
                    beta VARCHAR(200),
                    equipment_id VARCHAR(8000)
                )
            '''

        is_exist = check_table_exist('eta_beta')
        if not is_exist:
            table2 = '''
                CREATE TABLE eta_beta(
                    id VARCHAR(8000) NOT NULL PRIMARY KEY NONCLUSTERED,
                    eta VARCHAR(200),
                    beta VARCHAR(200),
                    equipment_id VARCHAR(8000)
                )
            '''
        try:
            cursor.execute(table1)
            cursor.execute(table2)
            cnxn.commit()
            return "Tables Created Successfully"
        except:
            return "Some Error Occured"

