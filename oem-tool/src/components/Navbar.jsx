import styled from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import SettingsIcon from '@mui/icons-material/Settings';
import EngineeringIcon from "@mui/icons-material/Engineering";
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import HandymanIcon from '@mui/icons-material/Handyman';

const NavWrapper = styled.div`
    position: absolute;
    bottom: -5%;
    left: 50%;
    transform: translateX(-50%);
    width: 20rem;
    background-image: linear-gradient(10deg, #42a5f5, #1e88e5, #0d47a1);
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    height: 3rem;
    border-radius: 3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
`;

const Nav = styled.ul`
    list-style: none;
    display: flex;
    gap: 2rem;
`;

const Item = styled.li`
    position: relative;
`;

const StyledLink = styled(NavLink)`
    text-decoration: none;
    color: #90caf9; /* Set the default color */
    
    &:focus, &:hover, &:visited, &:link, &:active {
        text-decoration: none;
    }
    
    &.active {
        color: #fff; /* Se the color for the active link */
    }

    &.active:after {
        content: "";
        display: block;
        width: 5px; /* Set the width of the dot */
        height: 5px; /* Set the height of the dot */
        background-color: #fff; /* Set the color of the dot */
        border-radius: 50%;
        position: absolute;
        bottom: -5px; /* Adjust the distance from the link */
        left: 50%;
        transform: translateX(-50%);
    }
`;

const Navbar = () => {
    return (
        <>
            <NavWrapper>
                <Nav>
                    <Item><StyledLink to="/equipment_configuration" activeClassName="active"><SettingsIcon /></StyledLink></Item>
                    <Item><StyledLink to="/maintainance_allocation" activeClassName="active"><EngineeringIcon /></StyledLink></Item>
                    <Item><StyledLink to="/equipment_docs" activeClassName="active"><TextSnippetIcon /></StyledLink></Item>
                    <Item><StyledLink to="/equipment_data" activeClassName="active"><HandymanIcon /></StyledLink></Item>
                </Nav>
            </NavWrapper>
        </>
    );
}

export default Navbar;
