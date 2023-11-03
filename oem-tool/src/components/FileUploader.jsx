import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from "styled-components"

const dropzoneStyles = {
    border: '2px dashed #cccccc',
    borderRadius: '4px',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
};

const activeDropzoneStyles = {
    borderColor: 'green',
};

const DropZoneContainer = styled.div`
    border: 0.1rem dashed #cccccc;
    border-radius: 0.4rem;
    width: 50rem;
    height: 20rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    text-transform: uppercase;
    font-family: 'Roboto', sans-serif;
    ${(props) => (props.isDragActive ? 'border-color: green;' : '')}
`

const FileUploader = ({ equipment }) => {
    const [uploadedFiles, setUploadedFiles] = useState([]);
    console.log(equipment)

    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            // Create a FormData object to send the files
            console.log(equipment.equipment_name)
            console.log(acceptedFiles)
           
            const formData = new FormData();
            acceptedFiles.forEach((file) => {
                formData.append('file', file);
            });
             debugger
            // Append the equipmentName
            formData.append('equipmentName', equipment.equipment_name);

            // Send the files and equipmentName to the API using Axios
            const request = await fetch('/upload', {
                method: "POST",
                body: formData
            });
            const data = await request.json()
            // Handle success, e.g., display a success message to the user
            console.log(data)

            // Update the list of uploaded files
            setUploadedFiles(acceptedFiles);
        } catch (error) {
            // Handle errors, e.g., display an error message to the user
            console.error('Error uploading files:', error);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div>
            <DropZoneContainer {...getRootProps()} isDragActive={isDragActive}>
                <input {...getInputProps()} />
                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
            </DropZoneContainer>
            <div>
                <h2>Uploaded Files</h2>
                <ul>
                    {uploadedFiles.map((file, index) => (
                        <li key={index}>
                            {file.name} - <a href={file.preview} target="_blank" rel="noopener noreferrer">View</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default FileUploader;