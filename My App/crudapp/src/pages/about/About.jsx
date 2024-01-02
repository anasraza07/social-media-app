import { useContext } from "react";
import "./About.css"
import { GlobalContext } from "../../context/Context";

const About = () => {
    const { state, dispatch } = useContext(GlobalContext);

    return <div>
        <h1>About Page</h1>
        <p>{JSON.stringify(state)}</p>
    </div>
}

export default About;