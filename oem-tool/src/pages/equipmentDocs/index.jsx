import * as React from 'react';
import { useState } from "react";
import FileUploader from "../../components/FileUploader";
import { useGetEquipmentsQuery } from "../../redux/apiSlice";
import styled from "styled-components";
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import PublishIcon from '@mui/icons-material/Publish';
import DownloadIcon from '@mui/icons-material/Download';
import UploadDocument from '../../components/UploadDocument';
import DownloadDocument from '../../components/DownloadDocument';
import Navbar from "../../components/Navbar";

const Div = styled.div`
    width: 100vw;
    height: 85vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const BoxWrapper = styled.div`
    width: 60%;
    height: 75%;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    display: flex;
    justify-content: center;
    border-radius: 0.2rem;
    align-items: center;
`





const EquipmentDocs = () => {
    const { data, error, isLoading } = useGetEquipmentsQuery();
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [file, setFile] = useState();
    const [view, setView] = React.useState('list');
    const renderComponent = () => {
        switch (view) {
            case "list":
                return (
                    <UploadDocument />
                )
            case "module":
                return (
                    <DownloadDocument/>
                )
        }
    }
    const handleChange = (event, nextView) => {
        setView(nextView);
    };
    return (
        <>
            <Navbar/>
            <Div>
                <ToggleButtonGroup
                    orientation="vertical"
                    value={view}
                    exclusive
                    onChange={handleChange}
                >
                    <ToggleButton value="list" aria-label="list">
                        <PublishIcon />
                    </ToggleButton>
                    <ToggleButton value="module" aria-label="module">
                        <DownloadIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
                <BoxWrapper>
                    {renderComponent()}
                </BoxWrapper>
            </Div>
        </>
    )
}

export default EquipmentDocs;