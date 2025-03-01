import {react} from "react"
import BugReportIcon from '@mui/icons-material/BugReport';

const CustomCursor = (props) => {
    return (
        <>
        <div className=" w-6 h-6 bg-transparent rounded-full z-50 absolute  translate-x-[-10%] translate-y-[-10%] flex justify-center items-center" style={{top : `${props.y}px`, left : `${props.x}px`, pointerEvents : "none"}} >
            {/* <BugReportIcon style={{backgroundColor: "#5b55552c", mixBlendMode: "difference", rotate : "320deg"}}/> */}
            <img src="/src/assets/CustomLinuxCursor.svg" alt="." style={{ background: "none", mixBlendMode: "multiply"}} />
            </div>
        </>
    )
}
export default CustomCursor

