import { useDispatch, useSelector } from "react-redux";
import Tree from "react-d3-tree";
import { useGetEquipmentsQuery } from "../../redux/apiSlice";
import styled from "styled-components";
import { TreeWrapper } from "../../components/constants";
import { Autocomplete, Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { setCurrentEquipment } from "../../redux/currentEquipmentSlice";
import { DataGrid } from '@mui/x-data-grid';
import { styled as styledMUI } from '@mui/material/styles';
import { blue, blueGrey } from '@mui/material/colors';
import CustomizedSnackbars from "../../components/Sneakbar";



const EquipmentButton = styled(Button)`
    width: 5rem;
    align-self: flex-end;

`

const AutoCompleteWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4rem;
`
const Div = styled.div`
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100vw;
`

const DataGridDiv = styled.div`
    margin-top: 1rem;
    align-self: flex-end;
`

// const TreeWrapper = styled.div`
//     background-color: ${blueGrey[100]}
// `




const calculateHeight = (numberOfRows) => {
    // Calculate the height based on the number of rows and row height
    const rowHeight = 52; // You can adjust this value
    return (numberOfRows + 1.1) * rowHeight; // Add 1 to account for the header row
};

const calculateWidth = (numberOfColumns) => {
    // Calculate the width based on the number of columns and column width
    const columnWidth = 200; // You can adjust this value
    return numberOfColumns * columnWidth;
};

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

const createTree = (data, parentName) => {
    debugger
    return data
        .filter(item => item.parent_name === parentName)
        .map(item => {
            const node = { name: item.equipment_name };
            const attributes = {};

            if (item.parallel_components !== "") {
                attributes.parallel_components = item.parallel_components;
            }

            if (item.repair_type !== "") {
                attributes.repair_type = item.repair_type;
            }

            if (item.failure_mode !== "") {
                attributes.failure_mode = item.failure_mode;
            }

            if (item.duty_cycle !== "") {
                attributes.duty_cycle = item.duty_cycle;
            }

            if (Object.keys(attributes).length > 0) {
                node.attributes = attributes;
            }

            node.children = createTree(data, item.equipment_name);

            return node;
        });
};



const EquipmentData = () => {
    const { data, error, isLoading } = useGetEquipmentsQuery();
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const [type, setType] = useState("repirable");
    const dispatch = useDispatch();
    const [result, setResult] = useState([]);
    const equipment_data = useSelector((state) => state.currentEquipment);
    const [treeData, setTreeData] = useState({
        name: "Tree",
        children: []
    });

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


    const setEquipment = () => {
        dispatch(setCurrentEquipment(selectedEquipment));
        setType(equipment_data.repair_type)
        setTreeData({
            ...treeData,
            children: createTree([equipment_data], '')
        })
        setSnackBarMessage({
            severity: "success",
            message: "Equipment Loaded Successfully",
            showSnackBar: true,
        });
    }


    const repairable_components = {
        columns: [
            { field: 'alpha', headerName: 'Alpha', flex: 1, editable: true },
            { field: 'beta', headerName: 'Beta', flex: 1, editable: true },
        ],

        rows: [
            { id: 1, alpha: 'X', beta: 'X', equipment_id: equipment_data.equipment_id },
        ]
    }
    const replacable_components = {
        columns: [
            { field: 'eta', headerName: 'Eta', flex: 1 },
            { field: 'beta', headerName: 'Beta', flex: 1 },
        ],

        rows: [
            { id: 1, eta: '', beta: '', equipment_id: equipment_data.equipment_id },
        ]
    }

    const numRows = repairable_components.rows.length;
    const numColumns = repairable_components.columns.length;

    const handleCellChange = (params) => {
        debugger
        if (type === "repairable") {
            repairable_components.rows = repairable_components.rows.map(row => {
                if (row.id === params.id) {
                    return { ...row, [params.field]: params.value };
                }
                return row;
            });
        } else {
            replacable_components.rows = replacable_components.rows.map(row => {
                if (row.id === params.id) {
                    return { ...row, [params.field]: params.value };
                }
                return row;
            });
        }
        console.log(repairable_components.rows);
        console.log(replacable_components.rows);
    }


    const handleSubmit = async () => {
        debugger
        try {
            const request = await fetch("/equipment_data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    repairable_data: repairable_components.rows[0],
                    replacable_data: replacable_components.rows[0],
                    equipment_type: type
                })
            })
            const data = await request.json()
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
            console.log(err)
        }
    }

    useEffect(() => {
        if (selectedEquipment) {
            setEquipment();
        }
    }, [selectedEquipment]);


    return (
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
            {
                treeData.children && <TreeWrapper id="treeWrapper" style={{ width: '100%', height: '22rem' }}>
                    <Tree
                        data={treeData}
                        translate={{ x: 300, y: 100 }}
                        nodeSize={{ x: 200, y: 200 }}
                        rootNodeClassName="node__root"
                        branchNodeClassName="node__branch"
                        leafNodeClassName="node__leaf"
                    />
                </TreeWrapper>
            }
            <DataGridDiv style={{ height: calculateHeight(numRows), width: calculateWidth(numColumns), overflow: 'hidden' }}>
                {
                    type == "repairable" ? (
                        <StyledDataGrid
                            rows={repairable_components.rows}
                            columns={repairable_components.columns}
                            pageSize={5}
                            hideFooter={true}
                            onCellEditCommit={handleCellChange}
                        />
                    ) : (
                        <StyledDataGrid
                            rows={replacable_components.rows}
                            columns={replacable_components.columns}
                            pageSize={5}
                            hideFooter={true}
                            onCellEditCommit={handleCellChange}
                        />
                    )

                }
            </DataGridDiv>
            <EquipmentButton variant="contained" onClick={handleSubmit}>
                submit
            </EquipmentButton>
            {SnackBarMessage.showSnackBar && (
                <CustomizedSnackbars
                    message={SnackBarMessage}
                    onHandleClose={onHandleSnackClose}
                />
            )}
        </Div>
    )
};

export default EquipmentData;