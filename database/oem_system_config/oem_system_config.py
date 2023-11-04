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
                    parallel_components = system["parallelComponents"]
                    repair_type = system["repairType"]
                    failure_mode = system["failureMode"]
                    duty_cycle = system["dutyCycle"]
                    failure_mode_id = str(uuid.uuid4())
                    insert_sql = '''
                        INSERT INTO oem_system_config(
                            equipment_id, equipment_name, parallel_components, repair_type, failure_mode, duty_cycle, parent_name, failure_mode_id
                        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)
                    '''
                    cursor.execute(insert_sql, equipment_id, equipment_name,
                                   parallel_components, repair_type, failure_mode, duty_cycle, parent_equipment, failure_mode_id)
            cursor.commit()
            return self.success_return
        except Exception as e:
            self.error_return['message'] = str(e)
            return self.error_return

    def get_all_equipment_data(self):
        try:
            select_sql = '''
                SELECT equipment_id, equipment_name, parallel_components, repair_type, failure_mode, duty_cycle, parent_name, failure_mode_id
                FROM oem_system_config
            '''
            cursor.execute(select_sql)
            equipments_data_list = []
            equipments = cursor.fetchall()
            for equipment in equipments:
                equipments_data_list.append(
                    {
                        "equipment_id": equipment[0],
                        "equipment_name": equipment[1],
                        "parallel_components": equipment[2],
                        "repair_type": equipment[3],
                        "failure_mode": equipment[4],
                        "duty_cycle": equipment[5],
                        "parent_name": equipment[6],
                        "failure_mode_id": equipment[7]
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
