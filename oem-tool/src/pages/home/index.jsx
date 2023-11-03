import styled from "styled-components";
import SettingsIcon from "@mui/icons-material/Settings";
import RateReviewIcon from "@mui/icons-material/RateReview";
import EngineeringIcon from "@mui/icons-material/Engineering";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import HandymanIcon from '@mui/icons-material/Handyman';
import { Link } from "react-router-dom";
import { Button } from "@mui/material";



const Div = styled.div`
    width: 100vw;
    height: 100vh;
    background: url('Homewave.svg'), linear-gradient(210deg, rgba(41, 41, 113, 0.6) 0%, rgba(91, 114, 129, 0.6) 100%), url(https://wallpaperaccess.com/full/2579311.jpg);
    background-size: cover;
    display: flex;
    align-items: center;
    padding: 3rem;
`
const Icon = styled.div`
    background-color: #fff;
    display: flex;
    margin-right: 1rem;
    border-radius: 50%;
    width: 4rem;
    height: 4rem;
    justify-content: center;
    align-items: center;
    color: #004d90;
    object-fit: cover;
`

const LinksWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    gap: 2rem;
    width: 50%;
`

const ModuleName = styled.div`
    font-size: 1.3rem;
    color: white;
    text-transform: uppercase;
    font-weight: 400;
`
const ModuleLink = styled(Link)`
    text-decoration: none;
`

const LogoWrapper = styled.div`
    width: 50%;
    display: flex;
    justify-content: center;
`

const Logo = styled.img`
    height: 30rem;
`



const Home = () => {
    const modules = [
        { name: "Equipment Configuration", icon: <SettingsIcon sx={{ fontSize: 30 }}/>, path: "/equipment_configuration" },
        { name: "Maintenance Allocation", icon: <EngineeringIcon sx={{ fontSize: 30 }}/>, path: "/maintainance_allocation" },
        { name: "Add System Docs", icon: <TextSnippetIcon sx={{ fontSize: 30 }}/>, path: "/equipment_docs" },
        { name: "Equipment Data", icon: <HandymanIcon sx={{ fontSize: 30 }}/>, path: "/x" },
    ];
    return (
        <>
            <Div>
                <LinksWrapper>
                    {
                        modules.map((module) => (
                            <ModuleLink key={module.name} to={module.path}>
                                <Button>
                                    <Icon>
                                        {module.icon}
                                    </Icon>
                                    <ModuleName>
                                        {module.name}
                                    </ModuleName>
                                </Button>
                            </ModuleLink>
                        ))
                    }
                </LinksWrapper>
                <LogoWrapper>

                    <Logo src="/netra_insma.png" />
                </LogoWrapper>
            </Div>
        </>
    )
}

export default Home;