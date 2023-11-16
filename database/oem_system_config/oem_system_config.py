import uuid

from database.database_connection import cursor, cnxn
from database.oem_system_config.oem_system_config_db import OemSystemConfigTable


class OemSystemConfig:
    def __init__(self):
        OemSystemConfigTable()
        self.success_return = {
            "message": "Data Saved Successfully.", "code": 1}
        self.error_return = {
            "message": "Some Error Occured, Please try agian.",
            "code": 0,
        }

    def insert_oem_system_conf_data(self, data):
        try:
            system_head = list(filter(lambda x: x['parentEquipment'] == '', data))[
                0]['equipmentName']
            for system in data:
                equipment_id = str(uuid.uuid4())
                is_exist = self.check_equipment_exists(equipment_id)
                if is_exist:
                    print("Equipment Already Exist")
                else:
                    equipment_name = system["equipmentName"]
                    parent_equipment = system["parentEquipment"]
                    parallel_components = system["parallelComponents"].split(",")
                    repair_type = system["repairType"]
                    failure_mode = system["failureMode"].split(",")
                    insert_failure_modes = '''
                        INSERT INTO equipments_failure_modes(
                            failure_mode_id, equipment_id, failure_mode
                        ) VALUES(?, ? , ?)
                    '''
                    insert_parallel_sql = '''
                        INSERT INTO parallel_equipments_table(
                            parallel_id, equipment_name, equipment_id
                        ) VALUES(?, ?, ?)
                    '''
                    for fmode in failure_mode:
                        failue_mode_id = str(uuid.uuid4())
                        cursor.execute(insert_failure_modes, failue_mode_id, equipment_id, fmode)

                    for component in parallel_components:
                        parallel_id = str(uuid.uuid4())
                        cursor.execute(insert_parallel_sql, parallel_id, component, equipment_id)

                    duty_cycle = system["dutyCycle"]
                    failure_mode_id = str(uuid.uuid4())
                    insert_sql = '''
                        INSERT INTO oem_system_config(
                            equipment_id, equipment_name, repair_type, duty_cycle, parent_name
                        ) VALUES(?, ?, ?, ?, ?)
                    '''
                    cursor.execute(insert_sql, equipment_id, equipment_name,
                        repair_type, duty_cycle, parent_equipment)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def get_all_equipment_data(self):
        try:
            select_sql = '''
                SELECT equipment_id, equipment_name, repair_type, duty_cycle
                FROM oem_system_config
            '''

            cursor.execute(select_sql)
            equipments = cursor.fetchall()
            equipments_data_list = []
            for equipment in equipments:
                failure_mode_sql = '''SELECT * FROM equipments_failure_modes  WHERE equipment_id = ?'''
                parallel_sql = '''SELECT * FROM parallel_equipments_table  WHERE equipment_id = ?'''
                cursor.execute(failure_mode_sql, equipment[0])
                failure_modes_equipment = cursor.fetchall()
                cursor.execute(parallel_sql, equipment[0])
                parallel_equipments = cursor.fetchall()
                failure_modes_list = []
                parallel_equipments_list = []
                for mode in failure_modes_equipment:
                    failure_modes_list.append({
                        "failure_mode_id": mode[0],
                        "equipment_id": mode[1],
                        "failure_mode": mode[2]
                    })
                    
                for equipment in parallel_equipments:
                    parallel_equipments_list.append({
                        "parallel_id": equipment[0],
                        "equipment_name": equipment[1],
                        "equipment_id": equipment[2]
                    })

                equipments_data_list.append(
                    {
                        "equipment_id": equipment[0],
                        "equipment_name": equipment[1],
                        "repair_type": equipment[2],
                        "failure_mode": failure_modes_list,
                    }
                )
            print(equipments_data_list)
            return equipments_data_list
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def get_equipment_and_children_data(self, equipment_id):
        try:
            select_sql = '''
                WITH EquipmentHierarchy AS (
                    -- Anchor member: Select the specified parent equipment
                    SELECT
                        equipment_id,
                        equipment_name,
                        parent_name,
                        parent_id
                    FROM
                        oem_system_config
                    WHERE
                        equipment_id = ?

                    UNION ALL

                    -- Recursive member: Join with children
                    SELECT
                        c.equipment_id,
                        c.equipment_name,
                        c.parent_name,
                        c.parent_id
                    FROM
                        oem_system_config c
                    JOIN
                        EquipmentHierarchy EH ON c.parent_id = EH.equipment_id
                )
                SELECT *
                FROM EquipmentHierarchy;
            '''
            cursor.execute(select_sql, equipment_id)
            tree = []
            equipments = cursor.fetchall()
            for equipment in equipments:
                tree.append(
                    {
                        "equipment_id": equipment[0],
                        "equipmentName": equipment[1],
                        "parentEquipment": equipment[2],
                        "parent_id": equipment[3],
                    }
                )
            print("tree", tree)
            return tree
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def check_equipment_exists(self, component_id):
        return False
