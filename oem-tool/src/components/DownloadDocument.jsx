import { Autocomplete, Button, TextField } from "@mui/material";
import { useGetEquipmentsQuery } from "../redux/apiSlice";
import FileUploader from "./FileUploader";
import { useState } from "react";
import styled from "styled-components"
import { useSelector } from "react-redux";
import CustomizedSnackbars from "./Sneakbar";

const Div = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10rem;
    gap: 2rem;
`

const AutoCompleteWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4rem;
`

const Link = styled.a`
    font-size: 1rem;
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

const DownloadDocument = () => {
    const { data, error, isLoading } = useGetEquipmentsQuery();
    const [downloadableFiles, setDownloadableFiles] = useState([]);
    const equipment = useSelector((state) => state.currentEquipment);
    const [selectedEquipment, setSelectedEquipment] = useState(equipment);
    console.log(equipment)
    // const [equipmentName, setEquipmentName] = useState(equipment.equipment_name);
    

    const loadFiles = async () => {
        const formData = new FormData();
        const equipmentName = equipment.equipment_name
        formData.append('equipmentName', equipmentName);
        const request = await fetch("/fetch_system_files", {
            method: "POST",
            body: formData
        });
        const data = await request.json();
        if (data.code) {
            setDownloadableFiles(data.data);
            console.log(data)
        }
        setSnackBarMessage({
            severity: "success",
            message: "Equipment Loaded Successfully",
            showSnackBar: true,
        });
    }

    const [SnackBarMessage, setSnackBarMessage] = useState({
        severity: "error",
        message: "This is awesome",
        showSnackBar: false,
    });

    const onHandleSnackClose = () => {
        setSnackBarMessage({
            severity: "error",
            message: "Please Add Systems",
            showSnackBar: false,
        });
    };


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
                    /><Button variant="contained" onClick={loadFiles}>
                        Load Equipment
                    </Button>
                </AutoCompleteWrapper>
                <FilesWrappper>
                    <H2>Download Files</H2>
                    <UL>
                        {
                            downloadableFiles && downloadableFiles.map((file, idx) => (
                                <LI key={idx}><Link href={`/uploads/${equipment.equipment_name}/${file}`} >{file}</Link></LI>
                            ))
                        }
                    </UL>

                </FilesWrappper>
            </Div>
            {SnackBarMessage.showSnackBar && (
                <CustomizedSnackbars
                    message={SnackBarMessage}
                    onHandleClose={onHandleSnackClose}
                />
            )}
        </>
    )
}

export default DownloadDocument;