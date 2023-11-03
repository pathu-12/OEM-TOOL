from database.database_connection import cursor, cnxn


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