from database.database_connection import cursor, cnxn
import pandas as pd
from flask import Response


def check_table_exist(object_id):
    check_table_query = '''SELECT OBJECT_ID('{}')'''.format(object_id)
    try:
        cursor.execute(check_table_query)
        row = cursor.fetchone()
        if row[0]:
            return True
        else:
            return False
    except:
        return False

def export_equipment_config_data():
    equipment_configuration = '''
        SELECT
            sys.*,
            alpha_beta.alpha,
            alpha_beta.beta,
            eta_beta.eta,
            eta_beta.beta
        FROM oem_system_config AS sys
        LEFT JOIN alpha_beta ON sys.equipment_id = alpha_beta.equipment_id
        LEFT JOIN eta_beta ON sys.equipment_id = eta_beta.equipment_id;
    '''

    dataframe = pd.read_sql(equipment_configuration, cnxn)
    csv_data = dataframe.to_csv(index=False)
    response = Response(
        csv_data,
        content_type='text/csv',
    )
    response.headers["Content-Disposition"] = "attachment; filename=table_data.csv"
    return response


def export_sensor_data():
    equipment_configuration = '''
        SELECT * FROM oem_sensor_data
    '''

    dataframe = pd.read_sql(equipment_configuration, cnxn)
    csv_data = dataframe.to_csv(index=False)
    response = Response(
        csv_data,
        content_type='text/csv',
    )
    response.headers["Content-Disposition"] = "attachment; filename=table_data.csv"
    return response
