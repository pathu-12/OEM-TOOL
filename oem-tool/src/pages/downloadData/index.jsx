
import { Box, Typography } from '@mui/material';
import LinearProgress from '@mui/material/LinearProgress';
import { useEffect, useState } from 'react';
import { styled } from "styled-components";


const Div = styled.div`
    height: 100vh;
    width: 100vw;
    padding: 2rem;
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


const DownloadData = () => {
    const [progress, setProgress] = useState(10);
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

    return (
        <>
            <Div>
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
                    </ProgressionBarWrapper> : <>
                        download contaent
                    </>
                }

            </Div>

            {/* <button onClick={() => downloadCSV('/export_equipment_data', 'equipment_data.csv')}>
                Download CSV 1
            </button>
            <button onClick={() => downloadCSV('/export_sensor_data', 'sensor_data.csv')}>
                Download CSV 1
            </button> */}
        </>
    )
}

export default DownloadData