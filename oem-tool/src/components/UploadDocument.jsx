import { Autocomplete, Button, TextField } from "@mui/material";
import { useGetEquipmentsQuery } from "../redux/apiSlice";
import FileUploader from "./FileUploader";
import { useCallback, useState } from "react";
import styled from "styled-components"
import { useDropzone } from 'react-dropzone';
import { useDispatch, useSelector } from "react-redux";
import { setCurrentEquipment } from "../redux/currentEquipmentSlice";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DescriptionIcon from '@mui/icons-material/Description';

const Div = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`

const AutoCompleteWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4rem;
`

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
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    font-size: 1rem;
    text-transform: uppercase;
    font-family: 'Roboto', sans-serif;
    ${(props) => (props.isDragActive ? 'border-color: green;' : '')}
`

const FilesWrappper = styled.div`
    width: 50rem;
    height: 20rem;
    padding: 2rem;
`

const H2 = styled.h2`
    text-transform: uppercase;
    font-size: 1.2rem;
`
const UL = styled.ul`
    margin-top: 2rem;
    list-style: none;
    font-size: 1rem;
`
const LI = styled.li`
    padding: 0 2rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    background-color: #e0e0e0;
    height: 3rem;
`

const UploadDocument = () => {
    const { data, error, isLoading } = useGetEquipmentsQuery();
    const equipment = useSelector((state) => state.currentEquipment);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const dispatch = useDispatch();
    const formData = new FormData();

    const setEquipment = () => {
        dispatch(setCurrentEquipment(selectedEquipment));
    }

    const onDrop = useCallback(async (acceptedFiles) => {
        try {
            // Create a FormData object to send the files
            console.log(equipment);
            acceptedFiles.forEach((file) => {
                formData.append('file', file);
            });
            formData.append("equipmentName", equipment.equipment_name)
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
    }, [equipment]);

    console.log(selectedEquipment)

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <>
            <Div>
                <AutoCompleteWrapper>
                    <Autocomplete
                        options={data}
                        getOptionLabel={(option) => option.equipment_name}
                        value={selectedEquipment}
                        onChange={(event, newValue) => setSelectedEquipment(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Equipment Name" />
                        )}
                        sx={{ width: "300px" }}
                    /><Button variant="contained" onClick={setEquipment}>
                        Load Equipment
                    </Button>
                </AutoCompleteWrapper>
                <div>
                    {
                        uploadedFiles.length === 0 ? (
                            <DropZoneContainer {...getRootProps()} isDragActive={isDragActive}>
                                <input {...getInputProps()} />
                                <div><CloudUploadIcon sx={{fontSize: 80}}/></div>
                                {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
                            </DropZoneContainer>
                        )
                            : (<FilesWrappper>
                                <H2>Uploaded Files</H2>
                                <UL>
                                    {uploadedFiles.map((file, index) => (
                                        <LI key={index}>
                                            <DescriptionIcon/> <span>{file.name}</span>
                                        </LI>
                                    ))}
                                </UL>
                            </FilesWrappper>)
                    }
                </div>
            </Div>
        </>
    )
}

export default UploadDocument;