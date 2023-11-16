import { useState } from "react";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import {
    Button,
    TextField,
    Table,
    TableBody,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Box,
    Drawer,
    IconButton,
    Stack,
    Checkbox,
    Stepper,
    Step,
    StepButton,
    Typography,
} from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import styled from "styled-components";
import TreeStructure from "../../components/tree";
import { blueGrey, grey, blue } from "@mui/material/colors";
import { styled as styledMUI } from '@mui/material/styles';
import CustomizedSnackbars from "../../components/Sneakbar";
import Navbar from "../../components/Navbar";

const theme = createTheme({
    components: {
        MuiTextField: {
            styleOverrides: {
                root: {
                    marginBottom: "1rem",
                    // display: "block",
                    width: "50rem"
                },
            },
        },
        MuiFormControl: {
            styleOverrides: {
                root: {
                    marginBottom: "1rem",
                    width: "50rem"
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    marginBottom: "1rem",
                    width: "50rem"
                },
            },
        }
    },
});


const StyledTableCell = styledMUI(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: blue[700],
        color: grey["A100"],
        textTransform: "uppercase",
        fontSize: 14
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));


const StyledTableRow = styledMUI(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: blueGrey[100],
        height: "1.5rem"
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
        height: "1.5rem"
    },
}));

const StyledStepButton = styled(StepButton)(({ theme }) => ({
    textTransform: "uppercase"
}));



const Form = styled.form`
    display: flex;
    flex-direction: column;
    width: 100%;
    justify-containt: center;
    align-items: center;
`

const Div = styled.div`
    padding: 2rem;
`

const Container = styled.div`
    margin-top: 2rem;
    min-height: 30rem;
`
const StepLabel = styled.div`
    font-size: 1.2rem;
    text-transform: uppercase;
    font-weight: 500;
    margin-left: 0.5rem;
`

const EquipmentConfiguration = () => {
    const [tableData, setTableData] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);
    const [equipmentTree, setEquipmentTree] = useState({});
    const steps = ['Create Equipment', 'Load Tree', 'Save Equipment'];

    const [activeStep, setActiveStep] = useState(0);
    const [completed, setCompleted] = useState({});

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

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ? // It's the last step, but not all steps have been completed,
                // find the first step that has been completed
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleStep = (step) => () => {
        setActiveStep(step);
    };

    const handleComplete = () => {
        const newCompleted = completed;
        newCompleted[activeStep] = true;
        setCompleted(newCompleted);
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };


    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };


    const [formData, setFormData] = useState({
        equipmentName: "",
        parentEquipment: "",
        parallelComponents: "",
        repairType: "",
        failureMode: "",
        dutyCycle: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(tableData)
        setTableData([...tableData, formData]);

        if (formData.parentEquipment === "") {
            equipmentTree.name = formData.equipmentName
            equipmentTree.attributes = {
                repairType: formData.repairType,
                failureMode: formData.failureMode,
                dutyCycle: formData.dutyCycle
            }
            equipmentTree.children = []
        } else if (formData.parentEquipment === equipmentTree.name) {
            const child = {
                name: formData.equipmentName,
                attributes: {
                    repairType: formData.repairType,
                    failureMode: formData.failureMode,
                    dutyCycle: formData.dutyCycle,
                },
            }
            equipmentTree.children.push(child);
        } else {
            const child = {
                name: formData.equipmentName,
                attributes: {
                    repairType: formData.repairType,
                    failureMode: formData.failureMode,
                    dutyCycle: formData.dutyCycle,
                },
            }
            equipmentTree.children.push(child);
        }

        console.log(equipmentTree)

        setFormData({
            equipmentName: "",
            parentEquipment: "",
            parallelComponents: "",
            repairType: "",
            failureMode: "",
            dutyCycle: "",
        });

        setSnackBarMessage({
            severity: "success",
            message: "Equipment Added Successfully",
            showSnackBar: true,
        });
    };

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const handleCheckboxChange = (event, row) => {
        const isChecked = event.target.checked;
        setSelectedRows((prevSelectedRows) => {
            if (isChecked) {
                return [...prevSelectedRows, row];
            } else {
                return prevSelectedRows.filter((selectedRow) => selectedRow !== row);
            }
        });
    };

    const handleDeleteRows = () => {
        setTableData((prevTableData) =>
            prevTableData.filter((row) => !selectedRows.includes(row))
        );
        setSelectedRows([]);

        setSnackBarMessage({
            severity: "warning",
            message: "Row Deleted Successfully",
            showSnackBar: true,
        });
    };


    const handleSave = async () => {
        try {
            console.log(tableData)
            debugger;
            const res = await fetch("/oem_system_config", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    data: tableData,
                }),
            });
            const data = await res.json();
            if (data.code) {
                setSnackBarMessage({
                    severity: "success",
                    message: data.message,
                    showSnackBar: true,
                });
            } else {
                setSnackBarMessage({
                    severity: "success",
                    message: data.message,
                    showSnackBar: true,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const loadActiveStateComponent = (state) => {
        switch (state) {
            case 0:
                return (
                    <>
                        <Navbar/>
                        <ThemeProvider theme={theme}>
                            <Box>
                                <StepLabel>
                                    Step 1: Create a equipment
                                </StepLabel>
                                <Form>
                                    <TextField
                                        name="equipmentName"
                                        label="Equipment Name"
                                        variant="outlined"
                                        value={formData.equipmentName}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        name="parentEquipment"
                                        label="Parent Equipment"
                                        variant="outlined"
                                        value={formData.parentEquipment}
                                        onChange={handleInputChange}
                                    />
                                    <TextField
                                        name="parallelComponents"
                                        label="Parallel Components"
                                        variant="outlined"
                                        value={formData.parallelComponents}
                                        onChange={handleInputChange}
                                    />
                                    <FormControl variant="outlined">
                                        <InputLabel>Repair Type</InputLabel>
                                        <Select
                                            name="repairType"
                                            value={formData.repairType}
                                            onChange={handleInputChange}
                                            label="Repair Type"
                                        >
                                            <MenuItem value="repairable">Repairable</MenuItem>
                                            <MenuItem value="replaceable">Replaceable</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        name="failureMode"
                                        label="Failure Mode"
                                        variant="outlined"
                                        value={formData.failureMode}
                                        onChange={handleInputChange}

                                    />
                                    <TextField
                                        name="dutyCycle"
                                        label="Duty Cycle"
                                        variant="outlined"
                                        value={formData.dutyCycle}
                                        onChange={handleInputChange}
                                    />
                                </Form>
                            </Box>
                        </ThemeProvider>
                    </>
                )
            case 1:
                return (
                    <>
                        <StepLabel>
                            Step 2: show tree
                        </StepLabel>
                        {tableData && <TreeStructure data={tableData} />}
                    </>
                )

            case 2:
                return (
                    <>
                        <StepLabel>
                            Step 3: show equipments
                        </StepLabel>
                        <TableContainer component={Paper} sx={{ mt: 2 }}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Select</StyledTableCell>
                                        <StyledTableCell>Equipment Name</StyledTableCell>
                                        <StyledTableCell>Parent Equipment</StyledTableCell>
                                        <StyledTableCell>Parallel Components</StyledTableCell>
                                        <StyledTableCell>Repair Type</StyledTableCell>
                                        <StyledTableCell>Failure Mode</StyledTableCell>
                                        <StyledTableCell>Duty Cycle</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tableData.map((row, index) => (
                                        <TableRow key={index}>
                                            <StyledTableCell>
                                                <Checkbox
                                                    checked={selectedRows.includes(row)}
                                                    onChange={(e) => handleCheckboxChange(e, row)}
                                                />
                                            </StyledTableCell>
                                            <StyledTableCell>{row.equipmentName}</StyledTableCell>
                                            <StyledTableCell>{row.parentEquipment}</StyledTableCell>
                                            <StyledTableCell>{row.parallelComponents}</StyledTableCell>
                                            <StyledTableCell>{row.repairType}</StyledTableCell>
                                            <StyledTableCell>{row.failureMode}</StyledTableCell>
                                            <StyledTableCell>{row.dutyCycle}</StyledTableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleDeleteRows}
                            disabled={selectedRows.length === 0}
                        >
                            Delete Row
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            disabled={tableData.length === 0}
                        >
                            Save
                        </Button> */}
                    </>
                )
        }
    }

    return (
        <>
            <Div>
                <Stepper nonLinear activeStep={activeStep}>
                    {steps.map((label, index) => (
                        <Step key={label} completed={completed[index]}>
                            <StyledStepButton color="inherit" onClick={handleStep(index)}>
                                {label}
                            </StyledStepButton>
                        </Step>
                    ))}
                </Stepper>
                <Container>
                    {loadActiveStateComponent(activeStep)}
                </Container>
                <div>
                    {allStepsCompleted() ? (
                        <>
                            <Typography sx={{ mt: 2, mb: 1 }}>
                                All steps completed - you&apos;re finished
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                <Box sx={{ flex: '1 1 auto' }} />
                                <Button onClick={handleReset}>Reset</Button>
                            </Box>
                        </>
                    ) : (
                        <>
                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>

                                <Button
                                    color="inherit"
                                    disabled={activeStep === 0}
                                    onClick={handleBack}
                                    sx={{ mr: 1 }}
                                >
                                    Back
                                </Button>
                                <Box sx={{ flex: '1 1 auto' }} />
                                {
                                    activeStep === 0 && <Button onClick={handleSubmit} sx={{ mr: 1 }}>
                                        Save
                                    </Button>
                                }
                                {
                                    activeStep === 2 && <Button onClick={handleDeleteRows}
                                        disabled={tableData.length === 0} sx={{ mr: 1 }}>
                                        Delete Row
                                    </Button>
                                }
                                {
                                    activeStep === 2 && <Button onClick={handleSave}
                                        disabled={tableData.length === 0} sx={{ mr: 1 }}>
                                        Save Table
                                    </Button>
                                }
                                <Button onClick={handleNext} sx={{ mr: 1 }}>
                                    Next
                                </Button>
                                {activeStep !== steps.length &&
                                    (completed[activeStep] ? (
                                        // <Typography variant="caption" sx={{ display: 'inline-block' }}>
                                        //     Step {activeStep + 1} already completed
                                        // </Typography>
                                        <></>
                                    ) : (
                                        <Button onClick={handleComplete}>
                                            {completedSteps() === totalSteps() - 1
                                                ? 'Finish'
                                                : 'Complete Step'}
                                        </Button>
                                    ))}
                            </Box>
                        </>
                    )}
                </div>
                {SnackBarMessage.showSnackBar && (
                    <CustomizedSnackbars
                        message={SnackBarMessage}
                        onHandleClose={onHandleSnackClose}
                    />
                )}
            </Div>
        </>
    )
}


export default EquipmentConfiguration;