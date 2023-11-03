import os
from werkzeug.utils import secure_filename


class SystemDocuments:
    def __init__(self):
        self.success_return = {"message": "Data Saved Successfully.", "code": 1}
        self.error_return = {
            "message": "Some Error Occured, Please try agian.",
            "code": 0,
        }

    def upload_system_documents(self, target_folder, file):
        try:
            if not os.path.exists(target_folder):
                os.mkdir(target_folder)
            for f in file:
                filename = secure_filename(f.filename)
                f.save(os.path.join(target_folder, filename))
            return self.success_return
        except Exception as e:
            return self.error_return

    def fetch_system_files(self, target_folder):
        try:
            files = os.listdir(target_folder)
            print(target_folder)
            print(files)
            self.success_return["data"] = files
            return self.success_return
        except Exception as e:
            return self.error_return