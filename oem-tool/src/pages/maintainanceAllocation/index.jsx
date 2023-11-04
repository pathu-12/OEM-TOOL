import { Autocomplete, Box, Button, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState } from "react";
import { styled as styledMUI } from '@mui/material/styles';
import { blue } from '@mui/material/colors';


import styled from "styled-components";
import { useGetEquipmentsQuery } from "../../redux/apiSlice";
import { setCurrentEquipment } from "../../redux/currentEquipmentSlice";
import { useDispatch } from "react-redux";


const Div = styled.div`
    margin: 2rem;
    display: flex;
    flex-direction: column;
`
const FailureDiv = styled.div`
    width: 100%;
    height: 20rem;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    text-transform: uppercase;
`

const BoxWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`

const AutoCompleteWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 2rem;
    align-self:flex-start;
`

const EquipmentWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 3rem;
    align-self:flex-start;
    margin-bottom: 2rem;
`

const DataGridContainer = styled.div`
    width: 100%;
    height: 20rem;
`
const StyledDataGrid = styledMUI(DataGrid)(({ theme }) => ({
    color: theme.palette.mode === 'light' ? 'rgba(0,0,0,.85)' : 'rgba(255,255,255,0.85)',
    letterSpacing: 'normal',
    '& .MuiDataGrid-iconSeparator': {
        display: 'none',
    },
    '& .MuiDataGrid-columnHeader': {
        backgroundColor: blue[700],
        fontSize: "1rem",
        color: "#fff",
        textTransform: "Uppercase"
    },
    '& .MuiDataGrid-cell': {
        borderRadius: 0
    },
    // "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
    //     borderRight: `2px solid ${theme.palette.mode !== 'light' ? '#f0f0f0' : '#303030'
    //     }`,
    // },
    // "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    //     borderBottom: `2px solid ${theme.palette.mode !== 'light' ? '#f0f0f0' : '#303030'
    //     }`,
    // },
}));

const StyledButton = styledMUI(Button)`
    align-self: flex-end;
    margin-top: 2rem;
`


const StyledRadioGroup = styledMUI(RadioGroup)`
    width: 100%;
    height: 10rem;
    display: flex;
    padding: 2rem;
    gap: 1rem;
    box-shadow: 0 3px 10px rgb(0 0 0 / 0.2);
    border-radius: 0.3rem;
    flex-direction: column;
`

const RadioHeading = styled.div`
    text-transform: uppercase;
    font-size: 1.2rem;
    height: 2rem;
`
const RadioBtnOptions = styled.div`
    height: 2rem;
    display: flex;
    align-items: center;
    padding-left: 2rem;
    gap: 10rem;
`



const MaintainanceAllocation = () => {
    const { data, error, isLoading } = useGetEquipmentsQuery();
    const [numSensors, setNumSensors] = useState("");
    const [failureMode, setFailureMode] = useState("");
    const [tableData, setTableData] = useState([]);
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        setNumSensors(parseInt(e.target.value) || 0);
    };

    const [selectedRadio, setSelectedRadio] = useState("runToFailure");
    const [iRadio, setiRadio] = useState("nonIt");

    const handleRadioChange = (event) => {
        setSelectedRadio(event.target.value);
    };
    const handleRadio = (event) => {
        setiRadio(event.target.value);
    };


    const generateRows = () => {
        const rows = [];
        for (let i = 0; i < numSensors; i++) {
            rows.push({
                id: i + 1,
                parameterName: "",
                unit: "",
                minValue: "",
                maxValue: "",
                p: "",
                f: "",
                frequency: "",
                failureMode: failureMode,
                failureModeId: selectedEquipment.failure_mode_id,
                equipmentId: selectedEquipment.equipment_id
            });
        }
        setTableData(rows);
    };

    const saveSensorData = async () => {
        console.log("hello world")
        try {
            console.log(tableData)
            const request = await fetch("/add_maintenance_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: tableData,
                }),
            })

            const data = await request.json()
            console.log(data)
        }
        catch (e) {
            console.log(e)
        }

    }

    const renderMaintenanceUI = (state) => {
        switch (state) {
            case "runToFailure":
                return (
                    <>
                        <FailureDiv>
                            run to failure
                        </FailureDiv>
                    </>
                )
            case "conditionMonitoring":
                return (
                    <>
                        <StyledRadioGroup
                            aria-label="config-type"
                            name="config-type"
                            onChange={handleRadio}
                            value={iRadio}
                        >

                            <RadioHeading>
                                select sensor monitoring type
                            </RadioHeading>
                            <RadioBtnOptions>
                                <FormControlLabel
                                    value="it"
                                    control={<Radio />}
                                    label="Intermittent Monitoring"
                                />
                                <FormControlLabel
                                    value="nonIt"
                                    control={<Radio />}
                                    label="Continuous Monitoring"
                                />
                            </RadioBtnOptions>
                        </StyledRadioGroup>
                        <AutoCompleteWrapper>
                            <Autocomplete
                                options={data}
                                getOptionLabel={(option) => option.failure_mode}
                                onChange={(event, newValue) => setFailureMode(newValue.failure_mode)}
                                renderInput={(params) => (
                                    <TextField {...params} label="Failure Mode to be Inspected" />
                                )}
                                sx={{ width: "300px" }}
                            />
                            <TextField
                                label="Number of Sensors"
                                type="number"
                                value={numSensors}
                                onChange={handleInputChange}
                            />
                            <Button variant="contained" color="primary" onClick={generateRows}>
                                Generate Table
                            </Button>
                        </AutoCompleteWrapper>
                        <DataGridContainer>
                            <StyledDataGrid
                                rows={tableData}
                                columns={columns}
                                onCellEditCommit={handleCellChange}
                            />
                        </DataGridContainer>
                    </>
                )
        }

    }

    const setEquipment = () => {
        dispatch(setCurrentEquipment(selectedEquipment));
    }


    const handleCellChange = (params) => {
        const updatedData = tableData.map((row) => {
            if (row.id === params.id) {
                return { ...row, [params.field]: params.value };
            }
            return row;
        });
        setTableData(updatedData);
    };

    console.log(tableData)

    const columns = [
        { field: "id", headerName: "id" },
        { field: "parameterName", headerName: "Parameter Name", flex: 1, editable: true },
        { field: "unit", headerName: "Unit", flex: 1, editable: true },
        { field: "minValue", headerName: "Minimum Value", flex: 1, editable: true },
        { field: "maxValue", headerName: "Maximum Value", flex: 1, editable: true },
        { field: "p", headerName: "P", flex: 1, editable: true },
        { field: "f", headerName: "F", flex: 1, editable: true },
        iRadio === "it"
            ?
            { field: "frequency", headerName: "Frequency", flex: 1, editable: true }
            : null,
        { field: "failureMode", headerName: "Failure Mode", flex: 1 },
    ].filter((column) => column !== null);;

    return (
        <>
            <Div>
                <EquipmentWrapper>
                    <Autocomplete
                        options={data}
                        getOptionLabel={(option) => option.equipment_name}
                        value={selectedEquipment}
                        onChange={(event, newValue) => setSelectedEquipment(newValue)}
                        renderInput={(params) => (
                            <TextField {...params} label="Equipment Name" />
                        )}
                        sx={{ width: "300px" }}
                    />
                    <Button variant="contained" color="primary" onClick={setEquipment}>
                        load Equipment
                    </Button>
                </EquipmentWrapper>
                <BoxWrapper>
                    <Box>
                        <StyledRadioGroup
                            aria-label="config-type"
                            name="config-type"
                            value={selectedRadio}
                            onChange={handleRadioChange}
                        >

                            <RadioHeading>
                                select maintenance type
                            </RadioHeading>
                            <RadioBtnOptions>
                                <FormControlLabel
                                    value="runToFailure"
                                    control={<Radio />}
                                    label="Run to Failure"
                                />
                                <FormControlLabel
                                    value="conditionMonitoring"
                                    control={<Radio />}
                                    label="Condition Monitoring"
                                />
                            </RadioBtnOptions>
                        </StyledRadioGroup>
                    </Box>
                    {renderMaintenanceUI(selectedRadio)}
                </BoxWrapper>
                {selectedRadio === "conditionMonitoring" && <StyledButton variant="contained" onClick={saveSensorData}>submit</StyledButton>}
            </Div >
        </>
    )
}

export default MaintainanceAllocation;