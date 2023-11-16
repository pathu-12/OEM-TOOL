
import { Autocomplete, Box, Button, TextField, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect, useState } from 'react';
import { styled } from "styled-components";
import { useGetEquipmentsQuery } from '../../redux/apiSlice';
import { useDispatch } from 'react-redux';
import { setCurrentEquipment } from '../../redux/currentEquipmentSlice';


const Div = styled.div`
    height: 100vh;
    width: 100vw;
    padding: 2rem;
`

const AutoCompleteWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 4rem;
`


const ProgressionBarWrapper = styled(Box)`
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`

const ProgressWrapper = styled(Box)`
    // height: 100%;
    // width: 100%;
`

const LinearProgressBar = styled(LinearProgress)`
    width: 20rem;
`

const ProgressContent = styled.div`
    text-transform: uppercase;
    font-size: 1rem;
`


const ContentWrapper = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-size: 1rem;
    flex-direction: column;
    gap: 2rem;
`

const BtnWrapper = styled.div`
    display: flex;
    gap: 2rem;
`

const StyledLinkButton = styled.button`
    background: none;
    color: #3498db;
    border: none;
    cursor: pointer;
    padding: 0;
    text-decoration: underline;
    font: inherit;
    &:hover {
        text-decoration: none;
    }
`;

const DownloadData = () => {
    const [progress, setProgress] = useState(10);
    const dispatch = useDispatch();
    const { data, error, isLoading } = useGetEquipmentsQuery();
    const [selectedEquipment, setSelectedEquipment] = useState(null);
    const downloadCSV = (url, filename) => {
        fetch(url, {
            method: "POST"
        })
            .then((response) => response.blob())
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch((error) => {
                console.error('Error downloading CSV:', error);
            });
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => (prevProgress >= 100 ? 10 : prevProgress + 10));
        }, 800);

        if (progress >= 100) {
            clearInterval(timer);
        }

        return () => {
            clearInterval(timer);
        };
    }, [progress]);
    const displayContent = (progress) => {
        if (progress === 10) {
            return <ProgressContent>Analysing Request</ProgressContent>;
        } else if (progress > 10 && progress < 30) {
            return <ProgressContent>Some other content</ProgressContent>;
        } else if (progress === 30) {
            return <ProgressContent>Fetching Data From Backend</ProgressContent>;
        } else if (progress > 30 && progress < 70) {
            return <ProgressContent>Another content</ProgressContent>;
        } else if (progress === 70) {
            return <ProgressContent>Validating data</ProgressContent>;
        } else if (progress > 70 && progress < 90) {
            return <ProgressContent>Yet another content</ProgressContent>;
        } else if (progress === 90) {
            return <ProgressContent>Generating Download Links</ProgressContent>;
        } else {
            return <ProgressContent>Default content for other cases</ProgressContent>;
        }
    };

    const setEquipment = () => {
        dispatch(setCurrentEquipment(selectedEquipment));
    }

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
                {
                    progress < 100 ? <ProgressionBarWrapper>
                        <ProgressWrapper>
                            <Box sx={{ mr: 2 }}>
                                <LinearProgressBar variant="determinate" value={progress} />
                            </Box>
                            <Box sx={{ minWidth: 35 }}>
                                <Typography variant="body2" color="text.secondary">{`${Math.round(
                                    progress,
                                )}%`}</Typography>
                            </Box>
                        </ProgressWrapper>
                        {
                            displayContent(progress)
                        }
                    </ProgressionBarWrapper> : <ContentWrapper>
                        <div>
                            download the files
                        </div>
                        <BtnWrapper>
                            <StyledLinkButton
                                onClick={() => downloadCSV('/export_equipment_data', 'equipment_data.csv')}
                            >
                                Download Equipment Data
                            </StyledLinkButton>
                            <StyledLinkButton
                                onClick={() => downloadCSV('/export_sensor_data', 'sensor_data.csv')}
                            >
                                Download Sensor Data
                            </StyledLinkButton>
                        </BtnWrapper>
                    </ContentWrapper>
                }

            </Div>
        </>
    )
}

export default DownloadData